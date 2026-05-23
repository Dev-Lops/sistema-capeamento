from fastapi import FastAPI


from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.routes.activity import router as activity_router
from app.routes.dashboard import router as dashboard_router

app = FastAPI(
    title="Sistema de Planejamento de Capeamento"
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(activity_router)
app.include_router(dashboard_router)


@app.get("/")
def home():
    return {
        "status": "ok"
    }