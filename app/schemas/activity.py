from datetime import date

from pydantic import BaseModel, ConfigDict, model_validator


class ObraRef(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str


class ProjectRef(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str


class TeamRef(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str


class UserRef(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str


class ActivityBase(BaseModel):

    titulo: str
    descricao: str | None = None
    status: str = "planejado"
    prioridade: str = "media"
    data_inicio: date
    data_fim: date
    obra_id: int | None = None
    project_id: int | None = None
    team_id: int | None = None
    responsavel_id: int | None = None

    @model_validator(mode="after")
    def validar_datas(self):
        if self.data_fim < self.data_inicio:
            raise ValueError("data_fim deve ser igual ou posterior a data_inicio")
        return self


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(ActivityBase):
    pass


class ActivityResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    titulo: str
    descricao: str | None
    status: str
    prioridade: str
    data_inicio: date
    data_fim: date
    obra_id: int | None = None
    project_id: int | None = None
    team_id: int | None = None
    responsavel_id: int | None = None
    obra: ObraRef | None = None
    project: ProjectRef | None = None
    team: TeamRef | None = None
    responsavel: UserRef | None = None
