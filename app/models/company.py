from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.db import Base


class Company(Base):

    __tablename__ = "companies"

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