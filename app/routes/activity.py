from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.models.activity import Activity
from app.models.obras import Obra
from app.models.project import Project
from app.models.team import Team
from app.models.user import User
from app.schemas.activity import (
    ActivityCreate,
    ActivityResponse,
    ActivityUpdate,
)
from app.core.deps import require_admin, require_admin_or_planner

router = APIRouter(
    prefix="/activities",
    tags=["Atividades"],
)


def _query_com_relacionamentos(db: Session):
    return db.query(Activity).options(
        joinedload(Activity.obra),
        joinedload(Activity.project),
        joinedload(Activity.team),
        joinedload(Activity.responsavel),
    )


def _validar_fks(db: Session, dados: ActivityCreate | ActivityUpdate):
    if dados.obra_id is not None:
        obra = db.query(Obra).filter(
            Obra.id == dados.obra_id,
            Obra.ativo == True,
        ).first()
        if not obra:
            raise HTTPException(status_code=400, detail="Obra não encontrada")

    if dados.project_id is not None:
        projeto = db.query(Project).filter(Project.id == dados.project_id).first()
        if not projeto:
            raise HTTPException(status_code=400, detail="Projeto não encontrado")

    if dados.team_id is not None:
        equipe = db.query(Team).filter(
            Team.id == dados.team_id,
            Team.ativo == True,
        ).first()
        if not equipe:
            raise HTTPException(status_code=400, detail="Equipe não encontrada")

    if dados.responsavel_id is not None:
        usuario = db.query(User).filter(
            User.id == dados.responsavel_id,
            User.ativo == True,
        ).first()
        if not usuario:
            raise HTTPException(status_code=400, detail="Responsável não encontrado")


def _aplicar_dados(atividade: Activity, dados: ActivityCreate | ActivityUpdate):
    atividade.titulo = dados.titulo
    atividade.descricao = dados.descricao
    atividade.status = dados.status
    atividade.prioridade = dados.prioridade
    atividade.data_inicio = dados.data_inicio
    atividade.data_fim = dados.data_fim
    atividade.obra_id = dados.obra_id
    atividade.project_id = dados.project_id
    atividade.team_id = dados.team_id
    atividade.responsavel_id = dados.responsavel_id


@router.post("/", response_model=ActivityResponse)
def criar_atividade(
    activity: ActivityCreate,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin_or_planner),
):
    _validar_fks(db, activity)

    nova_atividade = Activity()
    _aplicar_dados(nova_atividade, activity)

    db.add(nova_atividade)
    db.commit()

    atividade = _query_com_relacionamentos(db).filter(
        Activity.id == nova_atividade.id
    ).first()

    return atividade


@router.get("/", response_model=list[ActivityResponse])
def listar_atividades(
    status: str | None = Query(default=None),
    prioridade: str | None = Query(default=None),
    obra_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    usuario=Depends(require_admin_or_planner),
):
    query = _query_com_relacionamentos(db).filter(Activity.ativo == True)

    if status:
        query = query.filter(Activity.status == status)

    if prioridade:
        query = query.filter(Activity.prioridade == prioridade)

    if obra_id is not None:
        query = query.filter(Activity.obra_id == obra_id)

    return query.all()


@router.put("/{activity_id}", response_model=ActivityResponse)
def atualizar_atividade(
    activity_id: int,
    activity: ActivityUpdate,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin_or_planner),
):
    atividade = db.query(Activity).filter(Activity.id == activity_id).first()

    if not atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")

    _validar_fks(db, activity)
    _aplicar_dados(atividade, activity)

    db.commit()

    return _query_com_relacionamentos(db).filter(
        Activity.id == activity_id
    ).first()


@router.delete("/{activity_id}")
def deletar_atividade(
    activity_id: int,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin),
):
    atividade = db.query(Activity).filter(Activity.id == activity_id).first()

    if not atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")

    atividade.ativo = False
    db.commit()

    return {"mensagem": "Atividade removida"}
