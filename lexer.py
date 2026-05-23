import ply.lex as lex

# Tokens
tokens = (
    "REPETIR",
    "VECES",
    "AGREGAR",
    "IGUAL",
    "NUMERO",
    "UNIDAD",
    "INGREDIENTE",
    "VARIABLE",
    "PUNTO_COMA",
)

# Reservadas
_RESERVADAS = {
    "REPETIR": "REPETIR",
    "VECES": "VECES",
    "AGREGAR": "AGREGAR",
}


t_IGUAL = r"="
t_PUNTO_COMA = r";"

# Expresiones regulares
def t_NUMERO(t):
    r"\d+"
    t.value = int(t.value)
    return t


def t_UNIDAD(t):
    r"(gr|ml|pizca|u|und|unidad|pza|pz)"
    return t


def t_VARIABLE(t):
    r"[A-Z]+(?:_[A-Z]+)*"
    t.type = _RESERVADAS.get(t.value, "VARIABLE")
    return t


def t_INGREDIENTE(t):
    r"[a-záéíóúñ]+(?:_[a-záéíóúñ]+)*"
    return t


def t_newline(t):
    r"\n+"
    t.lexer.lineno += len(t.value)


t_ignore = " \t\r"


def _find_column(texto, lexpos):
    last_cr = texto.rfind("\n", 0, lexpos)
    if last_cr < 0:
        last_cr = -1
    return lexpos - last_cr

# Analizador lexico principal
def analizar_lexico(texto):
    lexer = lex.lex()
    lexer.errores = []
    lexer.input(texto)

    tokens_encontrados = []

    while True:
        tok = lexer.token()
        if not tok:
            break

        tokens_encontrados.append(
            {
                "token": tok.type,
                "lexema": tok.value,
                "linea": tok.lineno,
                "columna": _find_column(texto, tok.lexpos),
            }
        )

    return {"tokens": tokens_encontrados, "errores": lexer.errores}


def t_error(t):
    col = _find_column(t.lexer.lexdata, t.lexpos)
    err = {
        "lexema": t.value[0],
        "linea": t.lineno,
        "columna": col,
    }

    t.lexer.errores.append(err)
    t.lexer.skip(1)
