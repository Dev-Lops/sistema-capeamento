from sqlalchemy import Boolean, Column, Date, Integer, String
from sqlalchemy.orm import relationship

from app.db import Base


class Obra(Base):

    __tablename__ = "obras"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String, nullable=False)

    cliente = Column(String, nullable=False)

    local = Column(String, nullable=False)

    status = Column(String, default="planejada")

    data_inicio = Column(Date)

    data_fim = Column(Date)

    ativo = Column(Boolean, default=True)

    activities = relationship("Activity", back_populates="obra")
