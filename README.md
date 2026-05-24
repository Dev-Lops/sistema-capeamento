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

alembic upgrade head
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

## Migrações com Alembic (Fase 4)

O schema do banco é versionado em `alembic/versions/`.

```bash
# aplicar migrações pendentes
alembic upgrade head

# nova migração após alterar models
alembic revision --autogenerate -m "descricao da mudanca"
alembic upgrade head

# banco já existe e está igual ao código (sem rodar SQL)
alembic stamp head
```

`python -m app.create_tables` é atalho para `alembic upgrade head`.

## Testes e CI (Fase 5)

```bash
pip install -r requirements-dev.txt
pytest -v
```

Cobertura principal: login, permissões por role, CRUD de atividades e dashboard do operador.

O workflow `.github/workflows/ci.yml` roda `pytest` no backend e `npm run build` no frontend a cada push/PR na `main`.

## Domínio unificado (Fase 3)

- **Obra** (`/obras`) — cadastro completo (nome, cliente, local). Substitui `/works`.
- **Atividade** — vinculada por FK: `obra_id`, `project_id`, `team_id`, `responsavel_id`.
- **Work** removido.

### Banco legado (antes da Fase 3)

```bash
python -m app.migrate_phase3
alembic stamp head
python -m app.seed
```

### Recriar do zero — **pare o uvicorn antes** (`Ctrl+C`):

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
> alembic upgrade head && python -m app.seed
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
