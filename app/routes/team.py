from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db import get_db

from app.models.team import Team

from app.schemas.team import (
    TeamCreate,
    TeamResponse
)

from app.core.deps import (
    get_current_user,
    require_admin_or_planner
)

router = APIRouter(
    prefix="/teams",
    tags=["Teams"]
)


"""
===================================
CRIAR EQUIPE
===================================
"""


@router.post(
    "/",
    response_model=TeamResponse
)
def criar_team(
    dados: TeamCreate,
    db: Session = Depends(get_db),
    usuario=Depends(
        require_admin_or_planner
    )
):

    team = Team(
        nome=dados.nome,
        tipo=dados.tipo,
        empresa=dados.empresa
    )

    db.add(team)

    db.commit()

    db.refresh(team)

    return team


"""
===================================
LISTAR EQUIPES
===================================
"""


@router.get(
    "/",
    response_model=list[TeamResponse]
)
def listar_teams(
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user)
):

    teams = db.query(Team).filter(
        Team.ativo == True
    ).all()

    return teams


"""
===================================
ATUALIZAR
===================================
"""


@router.put(
    "/{team_id}",
    response_model=TeamResponse
)
def atualizar_team(
    team_id: int,
    dados: TeamCreate,
    db: Session = Depends(get_db),
    usuario=Depends(
        require_admin_or_planner
    )
):

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:

        raise HTTPException(
            status_code=404,
            detail="Equipe não encontrada"
        )

    team.nome = dados.nome
    team.tipo = dados.tipo
    team.empresa = dados.empresa

    db.commit()

    db.refresh(team)

    return team


"""
===================================
DELETAR
===================================
"""


@router.delete("/{team_id}")
def deletar_team(
    team_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(
        require_admin_or_planner
    )
):

    team = db.query(Team).filter(
        Team.id == team_id
    ).first()

    if not team:

        raise HTTPException(
            status_code=404,
            detail="Equipe não encontrada"
        )

    team.ativo = False

    db.commit()

    return {
        "message": "Equipe removida"
    }