from fastapi import APIRouter, HTTPException
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db import get_db

from app.models.activity import Activity, ActivityUpdate

from fastapi import Query

from app.schemas.activity import (
    ActivityCreate,
    ActivityResponse
)

from app.core.deps import get_current_user

from app.core.deps import (
    get_current_user,
    require_admin,
    require_admin_or_planner
)


router = APIRouter(
    prefix="/activities",
    tags=["Atividades"]
)


@router.post(
    "/",
    response_model=ActivityResponse
)
def criar_atividade(
    activity: ActivityCreate,
    db: Session = Depends(get_db),
    usuario = Depends(require_admin_or_planner)
):

    nova_atividade = Activity(
        titulo=activity.titulo,
        descricao=activity.descricao,
        status=activity.status,
        prioridade=activity.prioridade,
        data_inicio=activity.data_inicio,
        data_fim=activity.data_fim,
        responsavel=activity.responsavel,
        obra=activity.obra
    )

    db.add(nova_atividade)

    db.commit()

    db.refresh(nova_atividade)

    return nova_atividade

@router.get(
    "/",
    response_model=list[ActivityResponse]
)
def listar_atividades(
    status: str | None = Query(default=None),
    prioridade: str | None = Query(default=None),
    obra: str | None = Query(default=None),
    db: Session = Depends(get_db),
    usuario = Depends(require_admin_or_planner)
):
    query = db.query(Activity).filter(
        Activity.ativo == True
    )

    if status:
        query = query.filter(
            Activity.status == status
        )

    if prioridade:
        query = query.filter(
            Activity.prioridade == prioridade
        )

    if obra:
        query = query.filter(
            Activity.obra == obra
        )

    atividades = query.all()

    return atividades

@router.put(
    "/{activity_id}",
    response_model=ActivityResponse
)
def atualizar_atividade(
    activity_id: int,
    activity: ActivityUpdate,
    db: Session = Depends(get_db),
    usuario = Depends(require_admin_or_planner)
):

    atividade = db.query(Activity).filter(
        Activity.id == activity_id
    ).first()

    if not atividade:
        raise HTTPException(
            status_code=404,
            detail="Atividade não encontrada"
        )

    atividade.titulo = activity.titulo
    atividade.descricao = activity.descricao
    atividade.status = activity.status
    atividade.prioridade = activity.prioridade
    atividade.data_inicio = activity.data_inicio
    atividade.data_fim = activity.data_fim
    atividade.responsavel = activity.responsavel
    atividade.obra = activity.obra

    db.commit()

    db.refresh(atividade)

    return atividade

@router.delete("/{activity_id}")
def deletar_atividade(
    activity_id: int,
    db: Session = Depends(get_db),
    usuario = Depends(require_admin)
):

    atividade = db.query(Activity).filter(
        Activity.id == activity_id
    ).first()

    if not atividade:
        raise HTTPException(
            status_code=404,
            detail="Atividade não encontrada"
        )

    atividade.ativo = False

    db.commit()

    return {
        "mensagem": "Atividade removida"
    }