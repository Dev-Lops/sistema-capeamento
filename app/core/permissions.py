from fastapi import Depends, HTTPException

from app.core.deps import get_current_user

def admin_required(
    usuario=Depends(get_current_user),
):
    if usuario.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Sem permissão"
        )

    return usuario