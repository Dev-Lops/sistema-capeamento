"""schema inicial

Revision ID: 5247b0fe6c67
Revises:
Create Date: 2026-05-24 13:51:51.737948

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "5247b0fe6c67"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "companies",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(), nullable=False),
        sa.Column("tipo", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_companies_id"), "companies", ["id"], unique=False)

    op.create_table(
        "user",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("senha", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("ativo", sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index(op.f("ix_user_id"), "user", ["id"], unique=False)

    op.create_table(
        "obras",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(), nullable=False),
        sa.Column("cliente", sa.String(), nullable=False),
        sa.Column("local", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("data_inicio", sa.Date(), nullable=True),
        sa.Column("data_fim", sa.Date(), nullable=True),
        sa.Column("ativo", sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_obras_id"), "obras", ["id"], unique=False)

    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(), nullable=False),
        sa.Column("descricao", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_projects_id"), "projects", ["id"], unique=False)

    op.create_table(
        "teams",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("nome", sa.String(), nullable=False),
        sa.Column("tipo", sa.String(), nullable=False),
        sa.Column("company_id", sa.Integer(), nullable=False),
        sa.Column("ativo", sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_teams_id"), "teams", ["id"], unique=False)

    op.create_table(
        "activities",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("titulo", sa.String(), nullable=False),
        sa.Column("descricao", sa.Text(), nullable=True),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("prioridade", sa.String(), nullable=True),
        sa.Column("data_inicio", sa.Date(), nullable=True),
        sa.Column("data_fim", sa.Date(), nullable=True),
        sa.Column("ativo", sa.Boolean(), nullable=True),
        sa.Column("obra_id", sa.Integer(), nullable=True),
        sa.Column("project_id", sa.Integer(), nullable=True),
        sa.Column("team_id", sa.Integer(), nullable=True),
        sa.Column("responsavel_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["obra_id"], ["obras.id"]),
        sa.ForeignKeyConstraint(["project_id"], ["projects.id"]),
        sa.ForeignKeyConstraint(["responsavel_id"], ["user.id"]),
        sa.ForeignKeyConstraint(["team_id"], ["teams.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_activities_id"), "activities", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_activities_id"), table_name="activities")
    op.drop_table("activities")
    op.drop_index(op.f("ix_teams_id"), table_name="teams")
    op.drop_table("teams")
    op.drop_index(op.f("ix_projects_id"), table_name="projects")
    op.drop_table("projects")
    op.drop_index(op.f("ix_obras_id"), table_name="obras")
    op.drop_table("obras")
    op.drop_index(op.f("ix_user_id"), table_name="user")
    op.drop_table("user")
    op.drop_index(op.f("ix_companies_id"), table_name="companies")
    op.drop_table("companies")
