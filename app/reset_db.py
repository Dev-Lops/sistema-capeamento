"""
Recria o banco via Alembic (schema limpo + migrações).

IMPORTANTE: pare o uvicorn antes (Ctrl+C), senão pode travar.

Uso:
    python -m app.reset_db
    python -m app.seed
"""

import app.models  # noqa: F401

from sqlalchemy import text

from alembic import command
from alembic.config import Config

from app.config import DATABASE_URL
from app.db import engine


def _encerrar_outras_conexoes(conn):
    print("Encerrando outras conexões no banco...")
    conn.execute(
        text(
            """
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = current_database()
              AND pid <> pg_backend_pid()
            """
        )
    )


def _recriar_schema(conn):
    print("Removendo schema public (CASCADE)...")
    conn.execute(text("DROP SCHEMA IF EXISTS public CASCADE"))
    conn.execute(text("CREATE SCHEMA public"))
    conn.execute(text("GRANT ALL ON SCHEMA public TO public"))


def run():
    print(f"Conectando em {DATABASE_URL.split('@')[-1]}...")

    with engine.connect() as conn:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
        _encerrar_outras_conexoes(conn)
        _recriar_schema(conn)

    print("Aplicando migrações Alembic...")
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    engine.dispose()

    print("Banco resetado com sucesso")


if __name__ == "__main__":
    run()
