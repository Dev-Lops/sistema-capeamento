from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.db import Base


class User(Base):

    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    senha = Column(String, nullable=False)

    role = Column(String, nullable=False)

    ativo = Column(Boolean, default=True)

    atividades = relationship(
        "Activity",
        back_populates="responsavel",
    )
