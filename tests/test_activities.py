from tests.conftest import auth_headers


def test_listar_atividades_sem_token(client):
    response = client.get("/activities/")
    assert response.status_code == 401


def test_operador_nao_lista_atividades(client, tokens):
    response = client.get(
        "/activities/",
        headers=auth_headers(tokens["operador"]),
    )
    assert response.status_code == 403


def test_planner_cria_e_lista_atividade(
    client,
    tokens,
    activity_payload,
):
    response = client.post(
        "/activities/",
        json=activity_payload,
        headers=auth_headers(tokens["planner"]),
    )
    assert response.status_code == 200
    assert response.json()["titulo"] == activity_payload["titulo"]

    response = client.get(
        "/activities/",
        headers=auth_headers(tokens["planner"]),
    )
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_apenas_admin_deleta_atividade(
    client,
    tokens,
    activity_payload,
):
    create = client.post(
        "/activities/",
        json=activity_payload,
        headers=auth_headers(tokens["planner"]),
    )
    activity_id = create.json()["id"]

    response = client.delete(
        f"/activities/{activity_id}",
        headers=auth_headers(tokens["planner"]),
    )
    assert response.status_code == 403

    response = client.delete(
        f"/activities/{activity_id}",
        headers=auth_headers(tokens["admin"]),
    )
    assert response.status_code == 200

    listagem = client.get(
        "/activities/",
        headers=auth_headers(tokens["planner"]),
    )
    assert listagem.json() == []


def test_data_fim_antes_de_inicio_rejeitada(client, tokens):
    response = client.post(
        "/activities/",
        json={
            "titulo": "Inválida",
            "status": "planejado",
            "prioridade": "media",
            "data_inicio": "2026-05-20",
            "data_fim": "2026-05-01",
        },
        headers=auth_headers(tokens["planner"]),
    )
    assert response.status_code == 422
