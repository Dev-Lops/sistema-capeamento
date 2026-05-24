from collections.abc import Callable

from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer

from jose import jwt
from jose import JWTError

from sqlalchemy.orm import Session

from app.db import get_db

from app.models.user import User

from app.config import (
    SECRET_KEY,
    ALGORITHM
)

from app.core.roles import ADMIN, PLANNER


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:

    credentials_exception = HTTPException(
        status_code=401,
        detail="Credenciais inválidas",
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    usuario = db.query(User).filter(
        User.email == email
    ).first()

    if usuario is None:
        raise credentials_exception

    return usuario


def require_roles(*allowed_roles: str) -> Callable[..., User]:
    def dependency(
        usuario: User = Depends(get_current_user),
    ) -> User:
        if usuario.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Sem permissão",
            )
        return usuario

    return dependency


require_admin = require_roles(ADMIN)
require_planner = require_roles(PLANNER)
require_admin_or_planner = require_roles(ADMIN, PLANNER)
