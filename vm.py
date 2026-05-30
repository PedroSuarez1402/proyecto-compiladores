UNIDADES_CONTEO = {"u", "und", "unidad", "pza", "pz"}


def _unidad_canonica(unidad):
    if unidad in UNIDADES_CONTEO:
        return "u"
    return unidad


def ejecutar_acciones(acciones):
    memoria = {"ingredientes": {}, "variables": {}}
    errores = []

    def agregar(ingrediente, unidad, cantidad):
        unidad = _unidad_canonica(unidad)
        if ingrediente not in memoria["ingredientes"]:
            memoria["ingredientes"][ingrediente] = {"unidad": unidad, "cantidad": 0}

        actual = memoria["ingredientes"][ingrediente]
        if actual["unidad"] != unidad:
            errores.append(
                {
                    "mensaje": f"Error de ejecución: unidad inconsistente para '{ingrediente}' ({actual['unidad']} vs {unidad})",
                    "ingrediente": ingrediente,
                    "unidad_anterior": actual["unidad"],
                    "unidad_nueva": unidad,
                }
            )
            return

        actual["cantidad"] += int(cantidad)

    for accion in acciones or []:
        op = accion.get("op")

        if op == "agregar":
            agregar(accion.get("ingrediente"), accion.get("unidad"), accion.get("cantidad"))
            continue

        if op == "asignar":
            memoria["variables"][accion.get("variable")] = accion.get("valor")
            continue

        if op == "repetir":
            veces = int(accion.get("veces") or 0)
            inner = accion.get("accion") or {}
            if inner.get("op") != "agregar":
                errores.append({"mensaje": "Error de ejecución: REPETIR solo soporta AGREGAR", "op": "repetir"})
                continue
            for _ in range(max(0, veces)):
                agregar(inner.get("ingrediente"), inner.get("unidad"), inner.get("cantidad"))
            continue

        errores.append({"mensaje": f"Error de ejecución: operación desconocida '{op}'", "op": op})

    return {"memoria": memoria, "errores": errores}

