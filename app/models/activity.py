from datetime import date

from pydantic import BaseModel
from sqlalchemy import Integer, Column, String, Text, Date, Boolean

from app.db import Base

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Activity(Base):

    __tablename__ =  "activities"

    id = Column(
        Integer,
        primary_key = True,
        index = True,
    )

    titulo = Column(
        String,
        nullable=False
    )

    descricao = Column(
        Text
    )

    status = Column(
        String,
        default = "planejado"
    )

    prioridade = Column(
        String,
        default = "media"
    )

    data_inicio = Column(
        Date
    )

    data_fim = Column(
        Date
    )

    responsavel = Column(
        String
    )

    obra = Column(
        String
    )

    ativo = Column(
        Boolean,
        default=True
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id")
    )

    project = relationship(
        "Project",
        back_populates="activities"
    )

    team_id = Column(
        Integer,
        ForeignKey("teams.id")
    )

    responsavel_id = Column(
        Integer,
        ForeignKey("user.id")
    )

class ActivityUpdate(BaseModel):
    titulo: str

    descricao: str | None = None

    status: str

    prioridade: str

    data_inicio: date

    data_fim: date

    responsavel: str

    obra: str

    ativo: bool