import ply.lex as lex
import ply.yacc as yacc

import lexer as lexer_mod
from lexer import tokens
from semantic import SemanticError, verificar_semantica


errores_sintacticos = []
errores_semanticos = []

_texto_actual = ""


def _find_column(texto, lexpos):
    last_cr = texto.rfind("\n", 0, lexpos)
    if last_cr < 0:
        last_cr = -1
    return lexpos - last_cr


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


def p_instruccion_agregar(p):
    "instruccion_agregar : AGREGAR NUMERO UNIDAD INGREDIENTE PUNTO_COMA"
    unidad = p[3]
    ingrediente = p[4]

    try:
        ok, mensaje = verificar_semantica(ingrediente, unidad)
        if not ok:
            tok_ingrediente = p.slice[4]
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
        tok_ingrediente = p.slice[4]
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


def p_asignacion(p):
    "asignacion : VARIABLE IGUAL INGREDIENTE PUNTO_COMA"


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


parser = yacc.yacc(start="receta", write_tables=False, debug=False, errorlog=yacc.NullLogger())


def analizar_sintaxis(texto):
    global _texto_actual
    _texto_actual = texto

    errores_sintacticos.clear()
    errores_semanticos.clear()

    lexer_inst = lex.lex(module=lexer_mod)
    lexer_inst.errores = []
    parser.parse(texto, lexer=lexer_inst)

    return {
        "valido": len(errores_sintacticos) == 0,
        "errores": errores_sintacticos,
        "errores_semanticos": errores_semanticos,
    }
