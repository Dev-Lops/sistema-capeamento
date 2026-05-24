import app.models  # noqa: F401 — registra todos os models no metadata

from app.db import Base, engine

Base.metadata.create_all(bind=engine)

print("Tabelas criadas com sucesso")
