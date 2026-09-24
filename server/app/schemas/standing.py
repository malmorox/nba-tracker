from typing import Literal
from pydantic import BaseModel

class Standing(BaseModel):
    team_id: int
    team_city: str
    team_name: str
    conference: Literal["East", "West"]
    division: str
    conference_rank: int
    wins: int
    losses: int
    win_pct: float
    streak: str
    last_ten: str
