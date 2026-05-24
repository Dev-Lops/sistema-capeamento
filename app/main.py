from fastapi import FastAPI


from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.routes.activity import router as activity_router
from app.routes.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.obra import router as obra_router
from app.routes.work import router as work_router
app = FastAPI(
    title="Sistema de Planejamento de Capeamento"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(activity_router)
app.include_router(dashboard_router)
app.include_router(obra_router)
app.include_router(work_router)


@app.get("/")
def home():
    return {
        "status": "ok"
    }