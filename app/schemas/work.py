from pydantic import BaseModel


class WorkBase(BaseModel):

    nome: str


class WorkCreate(WorkBase):
    pass


class WorkResponse(WorkBase):

    id: int

    class Config:

        from_attributes = True