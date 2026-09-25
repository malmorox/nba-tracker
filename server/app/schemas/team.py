from pydantic import BaseModel


class Team(BaseModel):
    id: int
    full_name: str
    abbreviation: str
    nickname: str
    city: str
    state: str
    year_founded: int
    arena: str | None = None
    head_coach: str | None = None
    general_manager: str | None = None
