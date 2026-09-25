from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]  # carpeta server/


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", env_prefix="NBA_", extra="ignore")

    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    cache_db_path: Path = BASE_DIR / "data" / "cache.sqlite3"
    upstream_timeout: int = 30  # segundos

    roster_rollover_month: int = 7  # desde julio se pide la plantilla de la temporada que viene
    ttl_rosters: int = 60 * 60 * 12


settings = Settings()