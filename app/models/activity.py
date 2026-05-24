from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db import Base


class Activity(Base):

    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)

    titulo = Column(String, nullable=False)

    descricao = Column(Text)

    status = Column(String, default="planejado")

    prioridade = Column(String, default="media")

    data_inicio = Column(Date)

    data_fim = Column(Date)

    ativo = Column(Boolean, default=True)

    obra_id = Column(Integer, ForeignKey("obras.id"), nullable=True)

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)

    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)

    responsavel_id = Column(Integer, ForeignKey("user.id"), nullable=True)

    obra = relationship("Obra", back_populates="activities")

    project = relationship("Project", back_populates="activities")

    team = relationship("Team", back_populates="activities")

    responsavel = relationship("User", back_populates="atividades")
