from app.db import Base, engine
from app.models.activity import Activity
from app.models.user import User

Base.metadata.create_all(bind=engine)

print("Tabelas criadas com sucesso")