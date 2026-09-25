from fastapi import APIRouter, HTTPException

from app.schemas.player import Player
from app.schemas.team import Team
from app.services import nba_service

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("", response_model=list[Team])
def list_teams() -> list[dict]:
    return nba_service.get_teams()


@router.get("/{team_id}", response_model=Team)
def get_team(team_id: int) -> dict:
    team = nba_service.get_team(team_id)
    if team is None:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")
    return team


@router.get("/{team_id}/roster", response_model=list[Player])
def get_roster(team_id: int) -> list[dict]:
    if nba_service.get_team(team_id) is None:
        raise HTTPException(status_code=404, detail=f"Team {team_id} not found")
    return nba_service.get_roster(team_id)
