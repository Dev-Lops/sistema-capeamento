from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {
        "mensagem": "Sistema de Planejamento de Capeamento"
    }