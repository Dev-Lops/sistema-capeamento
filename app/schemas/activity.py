from datetime import date

from pydantic import BaseModel

class ActivityCreate(BaseModel):

    titulo: str

    descricao: str | None = None

    status: str = 'planejado'

    prioridade: str = "media"

    data_inicio: date

    data_fim: date

    responsavel: str

    obra : str

class ActivityResponse(BaseModel):
    id: int

    titulo: str

    descricao: str | None

    status: str

    prioridade: str

    data_inicio: date

    data_fim: date

    responsavel: str

    obra: str

    class Config:
        from_atributes = True