from app.db import Base, engine
from app.models.activity import Activity
from app.models.user import User
from app.models.obras import Obra
from app.models.work import Work
from app.models.company import Company
from app.models.team import Team

Base.metadata.create_all(bind=engine)

print("Tabelas criadas com sucesso")