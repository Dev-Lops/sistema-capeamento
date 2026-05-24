from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db import get_db

from app.models.team import Team
from app.models.company import Company
from app.models.work import Work

from app.schemas.team import (
    TeamCreate,
    TeamResponse
)

from app.core.deps import (
    require_admin_or_planner
)


router = APIRouter(
    prefix="/teams",
    tags=["Teams"]
)


"""
===================================
LISTAR
===================================
"""

@router.get(
    "/",
    response_model=list[
        TeamResponse
    ]
)
def listar_equipes(
    db: Session = Depends(get_db)
):

    equipes = db.query(
        Team
    ).all()

    return equipes


"""
===================================
CRIAR
===================================
"""

@router.post(
    "/",
    response_model=TeamResponse
)
def criar_equipe(
    dados: TeamCreate,
    db: Session = Depends(get_db),
    usuario=Depends(
        require_admin_or_planner
    )
):

    empresa = db.query(
        Company
    ).filter(
        Company.id == dados.company_id
    ).first()

    if not empresa:

        raise HTTPException(
            status_code=404,
            detail="Empresa não encontrada"
        )

    obra = db.query(
        Work
    ).filter(
        Work.id == dados.work_id
    ).first()

    if not obra:

        raise HTTPException(
            status_code=404,
            detail="Obra não encontrada"
        )

    equipe = Team(
        nome=dados.nome,
        company_id=dados.company_id,
        work_id=dados.work_id
    )

    db.add(equipe)

    db.commit()

    db.refresh(equipe)

    return equipe


"""
===================================
DELETAR
===================================
"""

@router.delete("/{id}")
def deletar_equipe(
    id: int,
    db: Session = Depends(get_db),
    usuario=Depends(
        require_admin_or_planner
    )
):

    equipe = db.query(
        Team
    ).filter(
        Team.id == id
    ).first()

    if not equipe:

        raise HTTPException(
            status_code=404,
            detail="Equipe não encontrada"
        )

    db.delete(equipe)

    db.commit()

    return {
        "message":
        "Equipe removida"
    }