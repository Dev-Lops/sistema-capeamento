from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.security import gerar_hash
from app.core.deps import require_admin, require_admin_or_planner
from app.core.roles import ALL_ROLES

router = APIRouter(
    prefix="/users",
    tags=["Usuários"],
)


@router.get(
    "/",
    response_model=list[UserResponse],
)
def listar_usuarios(
    db: Session = Depends(get_db),
    usuario: User = Depends(require_admin_or_planner),
):
    return db.query(User).filter(User.ativo == True).all()


@router.post(
    "/",
    response_model=UserResponse,
)
def criar_usuario(
    user: UserCreate,
    db: Session = Depends(get_db),
    usuario: User = Depends(require_admin),
):

    if user.role not in ALL_ROLES:
        raise HTTPException(
            status_code=400,
            detail=f"Role inválida. Use: {', '.join(ALL_ROLES)}",
        )

    email_existente = db.query(User).filter(
        User.email == user.email
    ).first()

    if email_existente:
        raise HTTPException(
            status_code=400,
            detail="Email já cadastrado",
        )

    senha_hash = gerar_hash(user.senha)

    novo_usuario = User(
        nome=user.nome,
        email=user.email,
        senha=senha_hash,
        role=user.role,
    )

    db.add(novo_usuario)

    db.commit()

    db.refresh(novo_usuario)

    return novo_usuario
