from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.security import gerar_hash

router = APIRouter(
    prefix="/users",
    tags=["Usuários"]
)


@router.post(
    "/",
    response_model=UserResponse
)
def criar_usuario(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    senha_hash = gerar_hash(user.senha)

    novo_usuario = User(
        nome=user.nome,
        email=user.email,
        senha=senha_hash,
        role=user.role
    )

    db.add(novo_usuario)

    db.commit()

    db.refresh(novo_usuario)

    return novo_usuario