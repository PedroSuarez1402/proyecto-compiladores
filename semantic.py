class SemanticError(Exception):
    pass

# Tablas de simbolos para analisis semantico
TIPOS_INGREDIENTES = {
    "harina": "solido",
    "sal": "solido",
    "pimienta": "solido",
    "carne_molida": "solido",
    "queso_derretido": "solido",
    "tocineta": "solido",
    "agua": "liquido",
    "leche": "liquido",
    "mayonesa": "liquido",
    "ketchup": "liquido",
    "mostaza": "liquido",
    "huevo": "unidad",
    "pan": "unidad",
}

# Tablas de variables
variables = {}

# Funcion para verificar la consistencia de las unidades
def verificar_semantica(ingrediente, unidad):
    tipo = TIPOS_INGREDIENTES.get(ingrediente)
    if tipo is None:
        raise SemanticError(f"Error: Ingrediente desconocido '{ingrediente}'")

    if unidad in {"u", "und", "unidad", "pza", "pz"}:
        if tipo != "unidad":
            if unidad in {"pz", "pza"}:
                return False, "Error: Este ingrediente no se mide por unidades. Si querías una pizca, usa 'pizca'"
            return False, "Error: Este ingrediente no se mide por unidades"
        return True, None

    if tipo == "unidad":
        return False, "Error: Este ingrediente se mide por unidades"

    if unidad == "gr" and tipo == "liquido":
        return False, "Error: No se pueden medir líquidos en gramos"

    if unidad == "ml" and tipo == "solido":
        return False, "Error: No se pueden medir sólidos en mililitros"

    return True, None
