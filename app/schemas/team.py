from pydantic import BaseModel


class TeamBase(BaseModel):

    nome: str
    tipo: str
    empresa: str | None = None


class TeamCreate(TeamBase):
    pass


class TeamResponse(TeamBase):

    id: int
    ativo: bool

    class Config:
        from_attributes = True