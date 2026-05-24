from pydantic import BaseModel


class ProjectCreate(BaseModel):

    nome: str
    descricao: str | None = None


class ProjectResponse(ProjectCreate):

    id: int

    class Config:

        from_attributes = True