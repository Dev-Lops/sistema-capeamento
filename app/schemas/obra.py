from datetime import date

from pydantic import BaseModel


class ObraBase(BaseModel):

    nome: str
    cliente: str
    local: str
    status: str
    data_inicio: date | None = None
    data_fim: date | None = None


class ObraCreate(ObraBase):
    pass


class ObraResponse(ObraBase):

    id: int
    ativo: bool

    class Config:

        from_attributes = True