from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db

from app.models.user import User

from app.schemas.user import LoginData

from app.core.security import verificar_senha

from app.core.auth import criar_token

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"]
)


@router.post("/login")
def login(
    dados: LoginData,
    db: Session = Depends(get_db)
):

    usuario = db.query(User).filter(
        User.email == dados.email
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos"
        )

    senha_valida = verificar_senha(
        dados.senha,
        usuario.senha
    )

    if not senha_valida:
        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos"
        )

    token = criar_token({
        "sub": usuario.email,
        "role": usuario.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }