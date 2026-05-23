class SemanticError(Exception):
    pass


TIPOS_INGREDIENTES = {
    "harina": "solido",
    "sal": "solido",
    "agua": "liquido",
    "leche": "liquido",
}


variables = {}


def verificar_semantica(ingrediente, unidad):
    tipo = TIPOS_INGREDIENTES.get(ingrediente)
    if tipo is None:
        raise SemanticError(f"Error: Ingrediente desconocido '{ingrediente}'")

    if unidad == "gr" and tipo == "liquido":
        return False, "Error: No se pueden medir líquidos en gramos"

    if unidad == "ml" and tipo == "solido":
        return False, "Error: No se pueden medir sólidos en mililitros"

    return True, None

