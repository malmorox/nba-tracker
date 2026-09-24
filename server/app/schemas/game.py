from typing import Literal
from pydantic import BaseModel

class GameTeam(BaseModel):
    id: int
    tricode: str
    name: str
    city: str
    wins: int
    losses: int
    score: int

class Game(BaseModel):
    id: str
    status: Literal[1, 2, 3]  # 1 programado, 2 en juego, 3 finalizado
    status_text: str
    start_time_utc: str
    home: GameTeam
    away: GameTeam
