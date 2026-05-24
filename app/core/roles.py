"""
Papéis oficiais do sistema.

admin    — acesso total
planner  — planejamento (atividades, obras, equipes, empresas)
operador — visualização (dashboard)
"""

from enum import Enum


class Role(str, Enum):
    ADMIN = "admin"
    PLANNER = "planner"
    OPERADOR = "operador"


ADMIN = Role.ADMIN.value
PLANNER = Role.PLANNER.value
OPERADOR = Role.OPERADOR.value

ALL_ROLES = tuple(r.value for r in Role)
