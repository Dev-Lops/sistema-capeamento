from datetime import date

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db import get_db

from app.models.activity import Activity

from app.core.deps import get_current_user


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user)
):

    total_atividades = db.query(Activity).filter(
        Activity.ativo == True
    ).count()

    planejadas = db.query(Activity).filter(
        Activity.status == "planejado",
        Activity.ativo == True
    ).count()

    em_execucao = db.query(Activity).filter(
        Activity.status == "em_execucao",
        Activity.ativo == True
    ).count()

    concluidas = db.query(Activity).filter(
        Activity.status == "concluido",
        Activity.ativo == True
    ).count()

    atrasadas = db.query(Activity).filter(
        Activity.data_fim < date.today(),
        Activity.status != "concluido",
        Activity.ativo == True
    ).count()

    return {
        "total_atividades": total_atividades,
        "planejadas": planejadas,
        "em_execucao": em_execucao,
        "concluidas": concluidas,
        "atrasadas": atrasadas
    }