class SemanticError(Exception):
    pass

# Diccionario de tipos de ingredientes
TIPOS_INGREDIENTES = {
    "harina": "solido",
    "sal": "solido",
    "agua": "liquido",
    "leche": "liquido",
    "huevo": "unidad",
}


variables = {}

# Funcion para verificar la semantica de una instruccion de agregar
def verificar_semantica(ingrediente, unidad):
    tipo = TIPOS_INGREDIENTES.get(ingrediente)
    if tipo is None:
        raise SemanticError(f"Error: Ingrediente desconocido '{ingrediente}'")

    if unidad in {"u", "und", "unidad", "pza", "pz"}:
        if tipo != "unidad":
            return False, "Error: Este ingrediente no se mide por unidades"
        return True, None

    if tipo == "unidad":
        return False, "Error: Este ingrediente se mide por unidades"

    if unidad == "gr" and tipo == "liquido":
        return False, "Error: No se pueden medir líquidos en gramos"

    if unidad == "ml" and tipo == "solido":
        return False, "Error: No se pueden medir sólidos en mililitros"

    return True, None
