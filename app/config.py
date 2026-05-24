from dotenv import load_dotenv
import os

load_dotenv()


def _obrigatorio(nome: str) -> str:
    valor = os.getenv(nome)
    if not valor:
        raise RuntimeError(
            f"Variável de ambiente obrigatória não definida: {nome}. "
            f"Copie .env.example para .env e preencha os valores."
        )
    return valor


DATABASE_URL = _obrigatorio("DATABASE_URL")
SECRET_KEY = _obrigatorio("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)
