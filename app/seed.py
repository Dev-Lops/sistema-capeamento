from datetime import date

from app.db import SessionLocal

from app.models.user import User
from app.models.activity import Activity

from app.core.security import gerar_hash


db = SessionLocal()


def criar_usuarios():

    usuarios = [
        {
            "nome": "Administrador",
            "email": "admin@email.com",
            "senha": "123456",
            "role": "admin"
        },
        {
            "nome": "Carlos",
            "email": "carlos@email.com",
            "senha": "123456",
            "role": "encarregado"
        },
        {
            "nome": "Fernanda",
            "email": "fernanda@email.com",
            "senha": "123456",
            "role": "engenharia"
        }
    ]

    for usuario in usuarios:

        usuario_existente = db.query(User).filter(
            User.email == usuario["email"]
        ).first()

        if not usuario_existente:

            novo_usuario = User(
                nome=usuario["nome"],
                email=usuario["email"],
                senha=gerar_hash(usuario["senha"]),
                role=usuario["role"]
            )

            db.add(novo_usuario)

    db.commit()

    print("Usuários criados com sucesso")


def criar_atividades():

    atividades = [
        {
            "titulo": "Capeamento Linha A",
            "descricao": "Linha principal da unidade",
            "status": "planejado",
            "prioridade": "alta",
            "data_inicio": date(2026, 5, 20),
            "data_fim": date(2026, 5, 30),
            "responsavel": "Carlos",
            "obra": "UTE GNA II"
        },
        {
            "titulo": "Capeamento Linha B",
            "descricao": "Linha secundária",
            "status": "em_execucao",
            "prioridade": "media",
            "data_inicio": date(2026, 5, 10),
            "data_fim": date(2026, 5, 15),
            "responsavel": "Fernanda",
            "obra": "Refinaria X"
        },
        {
            "titulo": "Inspeção térmica",
            "descricao": "Avaliação final",
            "status": "concluido",
            "prioridade": "alta",
            "data_inicio": date(2026, 5, 1),
            "data_fim": date(2026, 5, 5),
            "responsavel": "Carlos",
            "obra": "UTE GNA II"
        },
        {
            "titulo": "Capeamento Emergencial",
            "descricao": "Linha crítica",
            "status": "em_execucao",
            "prioridade": "alta",
            "data_inicio": date(2026, 5, 1),
            "data_fim": date(2026, 5, 8),
            "responsavel": "Fernanda",
            "obra": "Terminal Sul"
        }
    ]

    for atividade in atividades:

        nova_atividade = Activity(
            titulo=atividade["titulo"],
            descricao=atividade["descricao"],
            status=atividade["status"],
            prioridade=atividade["prioridade"],
            data_inicio=atividade["data_inicio"],
            data_fim=atividade["data_fim"],
            responsavel=atividade["responsavel"],
            obra=atividade["obra"]
        )

        db.add(nova_atividade)

    db.commit()

    print("Atividades criadas com sucesso")


if __name__ == "__main__":

    criar_usuarios()

    criar_atividades()

    print("Seed executado com sucesso")