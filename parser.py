import ply.lex as lex
import ply.yacc as yacc

import lexer as lexer_mod
from lexer import tokens
from semantic import SemanticError, verificar_semantica

# Variables globales
errores_sintacticos = []
errores_semanticos = []
codigo_intermedio = []

temp_counter = 0
label_counter = 0

_texto_actual = ""

# Funciones auxiliares
def _find_column(texto, lexpos):
    last_cr = texto.rfind("\n", 0, lexpos)
    if last_cr < 0:
        last_cr = -1
    return lexpos - last_cr


def new_temp():
    global temp_counter
    temp_counter += 1
    return f"t{temp_counter}"


def new_label():
    global label_counter
    label_counter += 1
    return f"L{label_counter}"

# Reglas sintacticas
def p_receta(p):
    "receta : instrucciones"


def p_instrucciones_una(p):
    "instrucciones : instruccion"


def p_instrucciones_muchas(p):
    "instrucciones : instrucciones instruccion"


def p_instruccion(p):
    """
    instruccion : instruccion_agregar
                | instruccion_repetir
                | asignacion
    """
    if p[1] is not None:
        codigo_intermedio.append(p[1])


def p_instruccion_agregar(p):
    """
    instruccion_agregar : AGREGAR NUMERO UNIDAD INGREDIENTE PUNTO_COMA
                       | AGREGAR NUMERO INGREDIENTE PUNTO_COMA
    """
    if len(p) == 6:
        unidad = p[3]
        ingrediente = p[4]
        tok_ingrediente = p.slice[4]
        p[0] = f"AGREGAR {p[2]} {unidad} {ingrediente}"
    else:
        unidad = "u"
        ingrediente = p[3]
        tok_ingrediente = p.slice[3]
        p[0] = f"AGREGAR {p[2]} {ingrediente}"

    try:
        ok, mensaje = verificar_semantica(ingrediente, unidad)
        if not ok:
            errores_semanticos.append(
                {
                    "mensaje": mensaje,
                    "linea": tok_ingrediente.lineno,
                    "columna": _find_column(_texto_actual, tok_ingrediente.lexpos),
                    "ingrediente": ingrediente,
                    "unidad": unidad,
                }
            )
    except SemanticError as e:
        errores_semanticos.append(
            {
                "mensaje": str(e),
                "linea": tok_ingrediente.lineno,
                "columna": _find_column(_texto_actual, tok_ingrediente.lexpos),
                "ingrediente": ingrediente,
                "unidad": unidad,
            }
        )


def p_instruccion_repetir(p):
    "instruccion_repetir : REPETIR NUMERO VECES instruccion_agregar"
    t = new_temp()
    l_start = new_label()
    l_end = new_label()

    codigo_intermedio.append(f"{t} = {p[2]}")
    codigo_intermedio.append(f"{l_start}:")
    codigo_intermedio.append(f"IF {t} <= 0 GOTO {l_end}")
    codigo_intermedio.append(p[4])
    codigo_intermedio.append(f"{t} = {t} - 1")
    codigo_intermedio.append(f"GOTO {l_start}")
    codigo_intermedio.append(f"{l_end}:")
    p[0] = None


def p_asignacion(p):
    "asignacion : VARIABLE IGUAL INGREDIENTE PUNTO_COMA"
    p[0] = f"{p[1]} = {p[3]}"

# Error handler
def p_error(p):
    if not p:
        errores_sintacticos.append(
            {
                "mensaje": "Error de sintaxis: fin de entrada inesperado",
                "linea": None,
                "columna": None,
                "lexema": None,
            }
        )
        return

    errores_sintacticos.append(
        {
            "mensaje": f"Error de sintaxis cerca de '{p.value}' en la línea {p.lineno}",
            "linea": p.lineno,
            "columna": _find_column(_texto_actual, p.lexpos),
            "lexema": p.value,
        }
    )

    while True:
        tok = parser.token()
        if not tok or tok.type == "PUNTO_COMA":
            break
    parser.errok()
    return tok

# Parser
parser = yacc.yacc(start="receta", write_tables=False, debug=False, errorlog=yacc.NullLogger())

# Funcion principal
def analizar_sintaxis(texto):
    global _texto_actual, temp_counter, label_counter
    _texto_actual = texto

    errores_sintacticos.clear()
    errores_semanticos.clear()
    codigo_intermedio.clear()
    temp_counter = 0
    label_counter = 0

    lexer_inst = lex.lex(module=lexer_mod)
    lexer_inst.errores = []
    parser.parse(texto, lexer=lexer_inst)

    return {
        "valido": len(errores_sintacticos) == 0,
        "errores": errores_sintacticos,
        "errores_semanticos": errores_semanticos,
        "codigo_intermedio": codigo_intermedio,
    }
