from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from lexer import analizar_lexico
from parser import analizar_sintaxis
from vm import ejecutar_acciones


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="frontend"), name="static")


@app.get("/")
def home():
    return FileResponse("frontend/index.html")


class CompilarRequest(BaseModel):
    receta: str


@app.post("/compilar")
def compilar(payload: CompilarRequest):
    lexico = analizar_lexico(payload.receta)
    sintaxis = analizar_sintaxis(payload.receta)

    ejecucion = {"memoria": {"ingredientes": {}, "variables": {}}, "errores": []}
    if sintaxis["valido"] and len(sintaxis["errores_semanticos"]) == 0 and len(lexico["errores"]) == 0:
        ejecucion = ejecutar_acciones(sintaxis["acciones"])

    return {
        "tokens": lexico["tokens"],
        "errores_lexicos": lexico["errores"],
        "sintaxis_correcta": sintaxis["valido"],
        "errores_sintacticos": sintaxis["errores"],
        "errores_semanticos": sintaxis["errores_semanticos"],
        "codigo_intermedio": sintaxis["codigo_intermedio"],
        "acciones": sintaxis["acciones"],
        "plato_final": ejecucion["memoria"]["ingredientes"],
        "errores_ejecucion": ejecucion["errores"],
    }
