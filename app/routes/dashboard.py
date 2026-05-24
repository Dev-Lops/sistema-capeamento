from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.models.activity import Activity
from app.core.deps import get_current_user
from app.schemas.activity import ActivityResponse

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user),
):
    base = db.query(Activity).filter(Activity.ativo == True)

    total_atividades = base.count()

    planejadas = base.filter(Activity.status == "planejado").count()

    em_execucao = base.filter(Activity.status == "em_execucao").count()

    concluidas = base.filter(Activity.status == "concluido").count()

    atrasadas = base.filter(
        Activity.data_fim < date.today(),
        Activity.status != "concluido",
    ).count()

    recentes = (
        db.query(Activity)
        .options(
            joinedload(Activity.obra),
            joinedload(Activity.project),
            joinedload(Activity.team),
            joinedload(Activity.responsavel),
        )
        .filter(Activity.ativo == True)
        .order_by(Activity.id.desc())
        .limit(10)
        .all()
    )

    return {
        "total_atividades": total_atividades,
        "planejadas": planejadas,
        "em_execucao": em_execucao,
        "concluidas": concluidas,
        "atrasadas": atrasadas,
        "atividades_recentes": [
            ActivityResponse.model_validate(a) for a in recentes
        ],
    }
