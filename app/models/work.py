from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.db import Base


class Work(Base):

    __tablename__ = "works"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    nome = Column(
        String,
        nullable=False
    )