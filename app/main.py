from fastapi import FastAPI

app = FastAPI(
    title="Sistema de Planejamento de Capeamento"
)

@app.get("/")
def home():
    return {
        "status": "ok",
        "mensagem": "Sistema funcionando"
    }