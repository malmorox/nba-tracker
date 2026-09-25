import json
import time
from datetime import datetime, timezone
from typing import Any

from nba_api.stats.endpoints import commonteamroster, teamdetails
from nba_api.stats.static import teams

from app.core.cache import cache
from app.core.config import BASE_DIR, settings
from app.core.errors import UpstreamError

TEAMS_FILE = BASE_DIR / "data" / "teams.json"


def _s(value: Any) -> str | None:
    return str(value) if value not in (None, "") else None


def refresh_teams() -> list[dict]:
    """
    Regenera teams.json: lista de equipos + su background (estadio,
    entrenador, director general) en un único fichero.

    No se llama nunca sola en el arranque normal salvo la primera vez
    (ver _load_teams). Ejecútala a mano cuando sepas que algo ha cambiado:

        python -c "from app.services.nba_service import refresh_teams; refresh_teams()"

    Tarda ~20-30s: una llamada a la NBA por cada uno de los 30 equipos.
    """
    merged = []
    for t in teams.get_teams():
        bg = teamdetails.TeamDetails(
            team_id=t["id"], timeout=settings.upstream_timeout
        ).get_normalized_dict()["TeamBackground"][0]
        merged.append(
            {
                "id": t["id"],
                "full_name": t["full_name"],
                "abbreviation": t["abbreviation"],
                "nickname": t["nickname"],
                "city": t["city"],
                "state": t["state"],
                "year_founded": t["year_founded"],
                "arena": _s(bg["ARENA"]),
                "head_coach": _s(bg["HEADCOACH"]),
                "general_manager": _s(bg["GENERALMANAGER"]),
            }
        )
        time.sleep(0.6)  # no machacar con 30 peticiones seguidas
    merged.sort(key=lambda t: t["full_name"])
    TEAMS_FILE.parent.mkdir(parents=True, exist_ok=True)
    TEAMS_FILE.write_text(json.dumps(merged, ensure_ascii=False, indent=4), encoding="utf-8")
    return merged


def _load_teams() -> list[dict]:
    if not TEAMS_FILE.exists():
        return refresh_teams()  # primera vez: lo crea solo (tarda un poco)
    return json.loads(TEAMS_FILE.read_text(encoding="utf-8"))


TEAMS_BY_ID: dict[int, dict] = {t["id"]: t for t in _load_teams()}


def get_teams() -> list[dict]:
    return sorted(TEAMS_BY_ID.values(), key=lambda t: t["full_name"])


def get_team(team_id: int) -> dict | None:
    return TEAMS_BY_ID.get(team_id)


# ---------------------------------------------------------------------------
# Roster
# ---------------------------------------------------------------------------

def _safe_int(value: Any) -> int | None:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _safe_float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _roster_season() -> str:
    """Devuelve la temporada activa en formato '2024-25'.
    A partir del mes de rollover (julio por defecto) se asume la temporada siguiente."""
    now = datetime.now(tz=timezone.utc)
    if now.month >= settings.roster_rollover_month:
        return f"{now.year}-{str(now.year + 1)[-2:]}"
    return f"{now.year - 1}-{str(now.year)[-2:]}"


def get_roster(team_id: int) -> list[dict]:
    """Devuelve la plantilla del equipo, cacheada en SQLite."""
    cache_key = f"roster:{team_id}:{_roster_season()}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    try:
        data = commonteamroster.CommonTeamRoster(
            team_id=team_id,
            season=_roster_season(),
            timeout=settings.upstream_timeout,
        ).get_normalized_dict()["CommonTeamRoster"]
    except Exception as exc:
        raise UpstreamError(f"CommonTeamRoster failed for team {team_id}: {exc}") from exc

    players = [
        {
            "id": _safe_int(p.get("PLAYER_ID")),
            "name": _s(p.get("PLAYER")),
            "number": _s(p.get("NUM")),
            "position": _s(p.get("POSITION")),
            "height": _s(p.get("HEIGHT")),
            "weight": _s(p.get("WEIGHT")),
            "age": _safe_float(p.get("AGE")),
            "experience": _s(p.get("EXP")),
            "school": _s(p.get("SCHOOL")),
        }
        for p in data
    ]

    cache.set(cache_key, players, ttl=settings.ttl_rosters)
    return players
