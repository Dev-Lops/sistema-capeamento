from sqlalchemy import Column, ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean

from app.db import Base


from sqlalchemy.orm import relationship


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

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False
    )

    ativo = Column(
        Boolean,
        default=True
    )

    company = relationship("Company", lazy="joined")

    activities = relationship("Activity", back_populates="team")
