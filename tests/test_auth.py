from tests.conftest import auth_headers, login


def test_home(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_login_valido(client, users):
    token = login(client, "planner@test.com")
    assert token

    response = client.get(
        "/auth/me",
        headers=auth_headers(token),
    )
    assert response.status_code == 200
    assert response.json()["email"] == "planner@test.com"
    assert response.json()["role"] == "planner"


def test_login_invalido(client, users):
    response = client.post(
        "/auth/login",
        data={"username": "planner@test.com", "password": "errada"},
    )
    assert response.status_code == 401


def test_me_sem_token(client):
    response = client.get("/auth/me")
    assert response.status_code == 401


def test_rota_admin_apenas_admin(client, tokens):
    response = client.get(
        "/auth/admin",
        headers=auth_headers(tokens["admin"]),
    )
    assert response.status_code == 200

    response = client.get(
        "/auth/admin",
        headers=auth_headers(tokens["planner"]),
    )
    assert response.status_code == 403
