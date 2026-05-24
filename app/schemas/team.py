from pydantic import BaseModel


class TeamBase(BaseModel):

    nome: str
    tipo: str
    company_id: int


class TeamCreate(TeamBase):
    pass


class CompanyMini(BaseModel):
    id: int
    nome: str

    class Config:
        from_attributes = True

class TeamResponse(TeamBase):
    id: int
    ativo: bool
    company: CompanyMini | None = None

    class Config:
        from_attributes = True