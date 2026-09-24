from pydantic import BaseModel

class Player(BaseModel):
    id: int
    name: str
    number: str | None = None
    position: str | None = None
    height: str | None = None
    weight: str | None = None
    age: float | None = None
    experience: str | None = None
    school: str | None = None
