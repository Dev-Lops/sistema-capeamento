from sqlalchemy import Integer, Column, String, Text, Date

from app.db import Base

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
        default="planejado"
    )

    prioridade = Column(
        String,
        default="media"
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