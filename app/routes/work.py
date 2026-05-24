from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db import get_db

from app.models.work import Work

from app.schemas.work import (
    WorkCreate,
    WorkResponse
)

from app.core.deps import (
    require_admin_or_planner
)


router = APIRouter(
    prefix="/works",
    tags=["Works"]
)


"""
===================================
LISTAR OBRAS
===================================
"""

@router.get(
    "/",
    response_model=list[WorkResponse]
)
def listar_obras(
    db: Session = Depends(get_db)
):

    obras = db.query(Work).all()

    return obras


"""
===================================
CRIAR OBRA
===================================
"""

@router.post(
    "/",
    response_model=WorkResponse
)
def criar_obra(
    dados: WorkCreate,
    db: Session = Depends(get_db),
    usuario=Depends(
        require_admin_or_planner
    )
):

    obra_existente = db.query(Work).filter(
        Work.nome == dados.nome
    ).first()

    if obra_existente:

        raise HTTPException(
            status_code=400,
            detail="Obra já existe"
        )

    obra = Work(
        nome=dados.nome
    )

    db.add(obra)

    db.commit()

    db.refresh(obra)

    return obra


"""
===================================
DELETAR OBRA
===================================
"""

@router.delete("/{id}")
def deletar_obra(
    id: int,
    db: Session = Depends(get_db),
    usuario=Depends(
        require_admin_or_planner
    )
):

    obra = db.query(Work).filter(
        Work.id == id
    ).first()

    if not obra:

        raise HTTPException(
            status_code=404,
            detail="Obra não encontrada"
        )

    db.delete(obra)

    db.commit()

    return {
        "message": "Obra removida"
    }