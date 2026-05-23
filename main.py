from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from lexer import analizar_lexico
from parser import analizar_sintaxis


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return FileResponse("index.html")


class CompilarRequest(BaseModel):
    receta: str


@app.post("/compilar")
def compilar(payload: CompilarRequest):
    lexico = analizar_lexico(payload.receta)
    sintaxis = analizar_sintaxis(payload.receta)

    return {
        "tokens": lexico["tokens"],
        "errores_lexicos": lexico["errores"],
        "sintaxis_correcta": sintaxis["valido"],
        "errores_sintacticos": sintaxis["errores"],
        "errores_semanticos": sintaxis["errores_semanticos"],
        "codigo_intermedio": sintaxis["codigo_intermedio"],
    }
