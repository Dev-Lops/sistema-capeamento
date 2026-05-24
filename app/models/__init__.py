"""
Importa todos os models para o SQLAlchemy resolver relationships
antes de qualquer query (seed, rotas, etc.).
"""

from app.models.activity import Activity
from app.models.user import User
from app.models.obras import Obra
from app.models.company import Company
from app.models.team import Team
from app.models.project import Project

__all__ = [
    "Activity",
    "User",
    "Obra",
    "Company",
    "Team",
    "Project",
]
