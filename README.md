# Sistema de Planejamento de Capeamento

API FastAPI + frontend React para gestão de atividades de capeamento em obras industriais.

## Pré-requisitos

- Python 3.11+
- Node.js 20+
- PostgreSQL

## Configuração

### 1. Variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com sua conexão PostgreSQL e uma `SECRET_KEY` forte.

### 2. Backend

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

python -m app.create_tables
python -m app.seed

uvicorn app.main:app --reload
```

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## Papéis (roles)

| Role      | Acesso                                              |
|-----------|-----------------------------------------------------|
| `admin`   | Tudo (inclui excluir atividades)                    |
| `planner` | Atividades, obras, empresas, equipes, projetos      |
| `operador`| Dashboard (somente leitura dos indicadores)         |

## Usuários de desenvolvimento (seed)

| Email               | Senha  | Role      |
|---------------------|--------|-----------|
| admin@email.com     | 123456 | admin     |
| planner@email.com   | 123456 | planner   |
| operador@email.com  | 123456 | operador  |

> Use apenas em ambiente local. Não use essas senhas em produção.

Se você já tinha usuários antigos (`encarregado`, `engenharia`), rode o seed de novo para criar os novos ou atualize o `role` manualmente no banco.

## Domínio unificado (Fase 3)

- **Obra** (`/obras`) — cadastro completo (nome, cliente, local). Substitui `/works`.
- **Atividade** — vinculada por FK: `obra_id`, `project_id`, `team_id`, `responsavel_id`.
- **Work** removido.

### Migrar banco existente

```bash
python -m app.migrate_phase3
python -m app.seed
```

Ou recrie o banco do zero — **pare o uvicorn antes** (`Ctrl+C` no terminal dele):

```bash
python -m app.reset_db
python -m app.seed
```

Se `reset_db` travar, outro processo ainda está usando o Postgres (uvicorn, seed antigo, DBeaver). Feche tudo e rode de novo.

> `dropdb`/`createdb` sem `-h localhost` costumam falhar com *peer authentication*
> no Linux. Use o `reset_db` acima ou:
>
> ```bash
> PGPASSWORD=sua_senha dropdb -h localhost -U postgres sistema_capeamento
> PGPASSWORD=sua_senha createdb -h localhost -U postgres sistema_capeamento
> python -m app.create_tables && python -m app.seed
> ```

## Segurança da API (Fase 2)

| Endpoint | Sem token | operador | planner | admin |
|----------|-----------|----------|---------|-------|
| `POST /auth/login` | ✅ | ✅ | ✅ | ✅ |
| `GET /auth/me`, `GET /dashboard` | ❌ 401 | ✅ | ✅ | ✅ |
| Atividades, obras, works, companies, teams, projects | ❌ 401 | ❌ 403 | ✅ | ✅ |
| `POST /users` | ❌ 401 | ❌ 403 | ❌ 403 | ✅ |

Rotas públicas: apenas `GET /` e `POST /auth/login`.

## Estrutura

```
app/           # API FastAPI
frontend/      # React + Vite
.env.example   # Modelo de variáveis de ambiente
```
