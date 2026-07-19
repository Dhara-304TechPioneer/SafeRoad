from pydantic import BaseModel


class UserPublic(BaseModel):
    id: int
    name: str
    email: str
    role: str
