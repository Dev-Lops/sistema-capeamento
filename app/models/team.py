from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

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

    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )

    work_id = Column(
        Integer,
        ForeignKey("works.id")
    )