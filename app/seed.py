from datetime import date

import app.models  # noqa: F401

from app.db import SessionLocal
from app.models import Activity, Obra, User

from app.core.security import gerar_hash
from app.core.roles import ADMIN, PLANNER, OPERADOR


db = SessionLocal()


def criar_usuarios():

    usuarios = [
        {
            "nome": "Administrador",
            "email": "admin@email.com",
            "senha": "123456",
            "role": ADMIN,
        },
        {
            "nome": "Ana Planner",
            "email": "planner@email.com",
            "senha": "123456",
            "role": PLANNER,
        },
        {
            "nome": "Carlos Operador",
            "email": "operador@email.com",
            "senha": "123456",
            "role": OPERADOR,
        },
    ]

    for usuario in usuarios:
        usuario_existente = db.query(User).filter(
            User.email == usuario["email"]
        ).first()

        if usuario_existente:
            usuario_existente.role = usuario["role"]
            continue

        db.add(
            User(
                nome=usuario["nome"],
                email=usuario["email"],
                senha=gerar_hash(usuario["senha"]),
                role=usuario["role"],
            )
        )

    db.commit()
    print("Usuários criados com sucesso")


def criar_obras():

    obras = [
        {
            "nome": "UTE GNA II",
            "cliente": "GNA",
            "local": "Macaé - RJ",
            "status": "em_andamento",
        },
        {
            "nome": "Refinaria X",
            "cliente": "Petro X",
            "local": "Paulínia - SP",
            "status": "planejada",
        },
        {
            "nome": "Terminal Sul",
            "cliente": "Logística Sul",
            "local": "Santos - SP",
            "status": "em_andamento",
        },
    ]

    for dados in obras:
        existe = db.query(Obra).filter(Obra.nome == dados["nome"]).first()
        if existe:
            continue

        db.add(Obra(**dados))

    db.commit()
    print("Obras criadas com sucesso")


def criar_atividades():

    if db.query(Activity).count() > 0:
        print("Atividades já existem, pulando seed de atividades")
        return

    planner = db.query(User).filter(User.email == "planner@email.com").first()
    operador = db.query(User).filter(User.email == "operador@email.com").first()

    obra_gna = db.query(Obra).filter(Obra.nome == "UTE GNA II").first()
    obra_refinaria = db.query(Obra).filter(Obra.nome == "Refinaria X").first()
    obra_terminal = db.query(Obra).filter(Obra.nome == "Terminal Sul").first()

    atividades = [
        {
            "titulo": "Capeamento Linha A",
            "descricao": "Linha principal da unidade",
            "status": "planejado",
            "prioridade": "alta",
            "data_inicio": date(2026, 5, 20),
            "data_fim": date(2026, 5, 30),
            "obra_id": obra_gna.id if obra_gna else None,
            "responsavel_id": planner.id if planner else None,
        },
        {
            "titulo": "Capeamento Linha B",
            "descricao": "Linha secundária",
            "status": "em_execucao",
            "prioridade": "media",
            "data_inicio": date(2026, 5, 10),
            "data_fim": date(2026, 5, 15),
            "obra_id": obra_refinaria.id if obra_refinaria else None,
            "responsavel_id": planner.id if planner else None,
        },
        {
            "titulo": "Inspeção térmica",
            "descricao": "Avaliação final",
            "status": "concluido",
            "prioridade": "alta",
            "data_inicio": date(2026, 5, 1),
            "data_fim": date(2026, 5, 5),
            "obra_id": obra_gna.id if obra_gna else None,
            "responsavel_id": operador.id if operador else None,
        },
        {
            "titulo": "Capeamento Emergencial",
            "descricao": "Linha crítica",
            "status": "em_execucao",
            "prioridade": "alta",
            "data_inicio": date(2026, 5, 1),
            "data_fim": date(2026, 5, 8),
            "obra_id": obra_terminal.id if obra_terminal else None,
            "responsavel_id": planner.id if planner else None,
        },
    ]

    for atividade in atividades:
        db.add(Activity(**atividade))

    db.commit()
    print("Atividades criadas com sucesso")


if __name__ == "__main__":
    criar_usuarios()
    criar_obras()
    criar_atividades()
    print("Seed executado com sucesso")
