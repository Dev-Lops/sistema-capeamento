"""
Migra banco existente para o schema da Fase 3.

Uso:
    python -m app.migrate_phase3

Em dev, também é válido recriar o banco:
    dropdb capeamento && createdb capeamento
    python -m app.create_tables
    python -m app.seed
"""

import app.models  # noqa: F401

from sqlalchemy import inspect, text

from app.db import SessionLocal, engine
from app.models import Obra, User


def _coluna_existe(tabela: str, coluna: str) -> bool:
    insp = inspect(engine)
    colunas = [c["name"] for c in insp.get_columns(tabela)]
    return coluna in colunas


def _tabela_existe(tabela: str) -> bool:
    return inspect(engine).has_table(tabela)


def run():
    db = SessionLocal()

    with engine.begin() as conn:
        if not _coluna_existe("activities", "obra_id"):
            conn.execute(
                text(
                    "ALTER TABLE activities "
                    "ADD COLUMN obra_id INTEGER REFERENCES obras(id)"
                )
            )
            print("Coluna obra_id adicionada")

        if _coluna_existe("activities", "obra"):
            linhas = conn.execute(
                text(
                    "SELECT id, obra FROM activities "
                    "WHERE obra IS NOT NULL AND obra != ''"
                )
            ).fetchall()

            for row in linhas:
                obra = db.query(Obra).filter(Obra.nome == row.obra).first()
                if not obra:
                    obra = Obra(
                        nome=row.obra,
                        cliente="A definir",
                        local="A definir",
                        status="planejada",
                    )
                    db.add(obra)
                    db.flush()

                conn.execute(
                    text(
                        "UPDATE activities SET obra_id = :obra_id "
                        "WHERE id = :id"
                    ),
                    {"obra_id": obra.id, "id": row.id},
                )

            db.commit()
            conn.execute(text("ALTER TABLE activities DROP COLUMN obra"))
            print("Coluna obra (texto) removida e dados migrados")

        if _coluna_existe("activities", "responsavel"):
            linhas = conn.execute(
                text(
                    "SELECT id, responsavel FROM activities "
                    "WHERE responsavel IS NOT NULL AND responsavel != ''"
                )
            ).fetchall()

            for row in linhas:
                usuario = db.query(User).filter(User.nome == row.responsavel).first()
                if usuario:
                    conn.execute(
                        text(
                            "UPDATE activities SET responsavel_id = :uid "
                            "WHERE id = :id"
                        ),
                        {"uid": usuario.id, "id": row.id},
                    )

            conn.execute(text("ALTER TABLE activities DROP COLUMN responsavel"))
            print("Coluna responsavel (texto) removida e dados migrados")

        if _tabela_existe("works"):
            conn.execute(text("DROP TABLE works"))
            print("Tabela works removida")

    db.close()
    print("Migração Fase 3 concluída")


if __name__ == "__main__":
    run()
