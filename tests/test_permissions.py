from tests.conftest import auth_headers


def test_obras_exige_autenticacao(client):
    response = client.get("/obras/")
    assert response.status_code == 401


def test_criar_usuario_apenas_admin(client, tokens):
    payload = {
        "nome": "Novo",
        "email": "novo@test.com",
        "senha": "123456",
        "role": "operador",
    }

    response = client.post(
        "/users/",
        json=payload,
        headers=auth_headers(tokens["planner"]),
    )
    assert response.status_code == 403

    response = client.post(
        "/users/",
        json=payload,
        headers=auth_headers(tokens["admin"]),
    )
    assert response.status_code == 200
    assert response.json()["email"] == "novo@test.com"


def test_dashboard_operador(client, tokens, activity_payload):
    client.post(
        "/activities/",
        json=activity_payload,
        headers=auth_headers(tokens["planner"]),
    )

    response = client.get(
        "/dashboard/",
        headers=auth_headers(tokens["operador"]),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_atividades"] == 1
    assert len(data["atividades_recentes"]) == 1
