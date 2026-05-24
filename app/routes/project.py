from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db import get_db

from app.models.project import Project

from app.schemas.project import (
    ProjectCreate,
    ProjectResponse
)

from app.core.deps import require_admin_or_planner

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.post(
    "/",
    response_model=ProjectResponse
)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    usuario=Depends(require_admin_or_planner),
):

    project = Project(**data.model_dump())

    db.add(project)

    db.commit()

    db.refresh(project)

    return project


@router.get(
    "/",
    response_model=list[ProjectResponse]
)
def list_projects(
    db: Session = Depends(get_db),
    usuario=Depends(require_admin_or_planner),
):

    return db.query(Project).all()
