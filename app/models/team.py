from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean

from app.db import Base


class Team(Base):

    __tablename__ = "teams"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nome = Column(
        String,
        nullable=False
    )

    tipo = Column(
        String,
        nullable=False
    )
    # propria | terceirizada

    empresa = Column(
        String,
        nullable=True
    )

    ativo = Column(
        Boolean,
        default=True
    )