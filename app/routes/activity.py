from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db import get_db

from app.models.activity import Activity

from app.schemas.activity import (
    ActivityCreate,
    ActivityResponse
)

from app.core.deps import get_current_user


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
    usuario=Depends(get_current_user)
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