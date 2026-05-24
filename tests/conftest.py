import os

# Variáveis de teste antes de importar app (load_dotenv não sobrescreve)
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["SECRET_KEY"] = "test-secret-key-pytest"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "60"

from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.db as db_module
import app.models  # noqa: F401
from app.core.roles import ADMIN, OPERADOR, PLANNER
from app.core.security import gerar_hash
from app.db import Base, get_db
from app.main import app
from app.models.company import Company
from app.models.user import User


@pytest.fixture()
def db_engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    db_module.engine = engine
    db_module.SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db(db_engine):
    session = db_module.SessionLocal()
    yield session
    session.close()


@pytest.fixture()
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def users(db):
    registros = [
        User(
            nome="Admin",
            email="admin@test.com",
            senha=gerar_hash("123456"),
            role=ADMIN,
        ),
        User(
            nome="Planner",
            email="planner@test.com",
            senha=gerar_hash("123456"),
            role=PLANNER,
        ),
        User(
            nome="Operador",
            email="operador@test.com",
            senha=gerar_hash("123456"),
            role=OPERADOR,
        ),
    ]
    for usuario in registros:
        db.add(usuario)
    db.commit()
    return {
        "admin": registros[0],
        "planner": registros[1],
        "operador": registros[2],
    }


@pytest.fixture()
def company(db):
    empresa = Company(nome="Empresa Teste", tipo="propria")
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa


def login(client: TestClient, email: str, senha: str = "123456") -> str:
    response = client.post(
        "/auth/login",
        data={"username": email, "password": senha},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def tokens(client, users):
    return {
        "admin": login(client, "admin@test.com"),
        "planner": login(client, "planner@test.com"),
        "operador": login(client, "operador@test.com"),
    }


@pytest.fixture()
def activity_payload():
    return {
        "titulo": "Atividade teste",
        "descricao": "Descrição",
        "status": "planejado",
        "prioridade": "media",
        "data_inicio": date(2026, 5, 1).isoformat(),
        "data_fim": date(2026, 5, 10).isoformat(),
    }
