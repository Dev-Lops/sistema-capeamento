"""
Aplica migrações Alembic (substitui create_all direto).

Uso:
    python -m app.create_tables
"""

from alembic.config import Config
from alembic import command


def run():
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    print("Migrações aplicadas com sucesso")


if __name__ == "__main__":
    run()
