from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"]
)


@router.get("/")
def auth_home():
    return {
        "mensagem": "rota de autenticação"
    }