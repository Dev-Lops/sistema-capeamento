from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db import get_db

from app.models.obras import Obra

from app.schemas.obra import (
    ObraCreate,
    ObraResponse
)

from app.core.deps import require_admin_or_planner

router = APIRouter(
    prefix="/obras",
    tags=["Obras"]
)


"""
===================================
CRIAR OBRA
===================================
"""


@router.post(
    "/",
    response_model=ObraResponse
)
def criar_obra(
    dados: ObraCreate,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin_or_planner),
):

    obra = Obra(**dados.model_dump())

    db.add(obra)

    db.commit()

    db.refresh(obra)

    return obra


"""
===================================
LISTAR OBRAS
===================================
"""


@router.get(
    "/",
    response_model=list[ObraResponse]
)
def listar_obras(
    db: Session = Depends(get_db),
    usuario=Depends(require_admin_or_planner),
):

    return db.query(Obra).filter(Obra.ativo == True).all()


"""
===================================
BUSCAR OBRA
===================================
"""


@router.get(
    "/{obra_id}",
    response_model=ObraResponse
)
def buscar_obra(
    obra_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin_or_planner),
):

    obra = db.query(Obra).filter(
        Obra.id == obra_id
    ).first()

    if not obra:

        raise HTTPException(
            status_code=404,
            detail="Obra não encontrada"
        )

    return obra


"""
===================================
ATUALIZAR
===================================
"""


@router.put(
    "/{obra_id}",
    response_model=ObraResponse
)
def atualizar_obra(
    obra_id: int,
    dados: ObraCreate,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin_or_planner),
):

    obra = db.query(Obra).filter(
        Obra.id == obra_id
    ).first()

    if not obra:

        raise HTTPException(
            status_code=404,
            detail="Obra não encontrada"
        )

    for campo, valor in dados.model_dump().items():

        setattr(
            obra,
            campo,
            valor
        )

    db.commit()

    db.refresh(obra)

    return obra


"""
===================================
DELETAR
===================================
"""


@router.delete("/{obra_id}")
def deletar_obra(
    obra_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin_or_planner),
):

    obra = db.query(Obra).filter(
        Obra.id == obra_id
    ).first()

    if not obra:

        raise HTTPException(
            status_code=404,
            detail="Obra não encontrada"
        )

    db.delete(obra)

    db.commit()

    return {
        "message":
        "Obra removida"
    }