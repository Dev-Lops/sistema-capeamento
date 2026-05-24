"""
Recria todas as tabelas usando DATABASE_URL do .env
(evita erro de peer auth do dropdb local).

Uso:
    python -m app.reset_db
    python -m app.seed
"""

import app.models  # noqa: F401

from app.db import Base, engine


def run():
    print("Removendo tabelas...")
    Base.metadata.drop_all(bind=engine)
    print("Criando tabelas...")
    Base.metadata.create_all(bind=engine)
    print("Banco resetado com sucesso")


if __name__ == "__main__":
    run()
