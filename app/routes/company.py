from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db import get_db

from app.models.company import Company

from app.schemas.company import (
    CompanyCreate,
    CompanyResponse
)

from app.core.deps import (
    require_admin_or_planner
)


router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


"""
===================================
LISTAR
===================================
"""

@router.get(
    "/",
    response_model=list[
        CompanyResponse
    ]
)
def listar_empresas(
    db: Session = Depends(get_db)
):

    empresas = db.query(
        Company
    ).all()

    return empresas


"""
===================================
CRIAR
===================================
"""

@router.post(
    "/",
    response_model=CompanyResponse
)
def criar_empresa(
    dados: CompanyCreate,
    db: Session = Depends(get_db),
    usuario=Depends(
        require_admin_or_planner
    )
):

    empresa_existente = db.query(
        Company
    ).filter(
        Company.nome == dados.nome
    ).first()

    if empresa_existente:

        raise HTTPException(
            status_code=400,
            detail="Empresa já existe"
        )

    empresa = Company(
        nome=dados.nome,
        tipo=dados.tipo
    )

    db.add(empresa)

    db.commit()

    db.refresh(empresa)

    return empresa


"""
===================================
DELETAR
===================================
"""

@router.delete("/{id}")
def deletar_empresa(
    id: int,
    db: Session = Depends(get_db),
    usuario=Depends(
        require_admin_or_planner
    )
):

    empresa = db.query(
        Company
    ).filter(
        Company.id == id
    ).first()

    if not empresa:

        raise HTTPException(
            status_code=404,
            detail="Empresa não encontrada"
        )

    db.delete(empresa)

    db.commit()

    return {
        "message":
        "Empresa removida"
    }