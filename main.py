from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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


class CompilarRequest(BaseModel):
    receta: str


def _compilar_impl(payload: CompilarRequest):
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


@app.post("/")
@app.post("/compilar")
@app.post("/api")
@app.post("/api/compilar")
def compilar(payload: CompilarRequest):
    return _compilar_impl(payload)
