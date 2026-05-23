from dns.dnssecalgs import algorithms
from fastapi import Depends, HTTPException

from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, jwt

from sqlalchemy.orm import Session

from app.config import SECRET_KEY, ALGORITHM

from app.db import get_db

from app.models.user import User

oauth2_schema = OAuth2PasswordBearer(
    tokenUrl='/auth/login'
)

def get_current_user(
        token: str = Depends(oauth2_schema),
        db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Credentials invalid"
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        email = payload.get("sub")

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