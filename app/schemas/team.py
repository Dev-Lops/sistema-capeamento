from pydantic import BaseModel


class TeamBase(BaseModel):

    nome: str

    company_id: int

    work_id: int


class TeamCreate(TeamBase):
    pass


class TeamResponse(TeamBase):

    id: int

    class Config:

        from_attributes = True