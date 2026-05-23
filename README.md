# DLS-Recetas: Proyecto Compiladores (FastAPI + PLY)

API en FastAPI que recibe una receta (mini-lenguaje) y ejecuta:

1. **Análisis léxico** (PLY `lex`) para obtener tokens y errores léxicos.
2. **Análisis sintáctico** (PLY `yacc`) para validar la receta contra una GLC y reportar errores sintácticos.

El endpoint principal devuelve un JSON consolidado con los tokens, errores y validaciones.

## Idea general

Este proyecto implementa la base de un compilador/interprete para un lenguaje de “recetas” con tres tipos de instrucciones:

- **Agregar** un ingrediente con cantidad y unidad:
  - `AGREGAR NUMERO UNIDAD INGREDIENTE;`
- **Repetir** una instrucción de agregar N veces:
  - `REPETIR NUMERO VECES AGREGAR ... ;`
- **Asignación** de una variable (en mayúsculas con guiones bajos) a un ingrediente:
  - `VARIABLE = ingrediente;`

En esta fase:

- El **lexer** reconoce palabras reservadas, números, unidades, variables, ingredientes y símbolos.
- El **parser** valida que la secuencia de tokens respete la gramática (GLC).
- La **semántica** valida reglas de dominio (por ejemplo: unidad correcta según si el ingrediente es sólido o líquido).
- La API expone esto como un servicio HTTP para integrarlo con un frontend o pruebas automatizadas.

## Estructura

- `main.py`: aplicación FastAPI y endpoint `POST /compilar`.
- `lexer.py`: analizador léxico (tokens + errores léxicos con línea/columna).
- `parser.py`: analizador sintáctico (validación + errores sintácticos con línea/columna).
- `semantic.py`: reglas semánticas (tipo de ingrediente y validación unidad vs tipo).
- `index.html`: interfaz web (editor + consola + panel de inspección).
- `requirements.txt`: dependencias mínimas.

## Requisitos

- Python 3.10+ (recomendado 3.12)

## Guía de comandos (ejecución)

> Recomendado: usar **entorno virtual** para evitar problemas de instalación en el sistema (PEP 668).

### 1) Crear y activar entorno virtual

Desde la carpeta del proyecto:

```bash
python3 -m venv .venv
```

Activar:

```bash
source .venv/bin/activate
```

### 2) Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3) Ejecutar el servidor

```bash
uvicorn main:app --reload
```

Por defecto queda en:

- `http://127.0.0.1:8000`
- Docs Swagger: `http://127.0.0.1:8000/docs`
- UI: `http://127.0.0.1:8000/`

### 4) Probar el endpoint `/compilar`

Con `curl`:

```bash
curl -X POST "http://127.0.0.1:8000/compilar" \
  -H "Content-Type: application/json" \
  -d '{"receta":"AGREGAR 10 gr sal;\nREPETIR 2 VECES AGREGAR 1 pizca pimienta;\nMI_SALSA = tomate;\n"}'
```

Respuesta esperada (estructura):

```json
{
  "tokens": [],
  "errores_lexicos": [],
  "sintaxis_correcta": true,
  "errores_sintacticos": [],
  "errores_semanticos": []
}
```

## Paso a paso (flujo interno)

1. `POST /compilar` recibe `{"receta": "..."}`.
2. `main.py` llama a `analizar_lexico(receta)`:
   - Retorna `{"tokens": [...], "errores": [...]}`.
3. `main.py` llama a `analizar_sintaxis(receta)`:
   - Retorna `{"valido": bool, "errores": [...]}`.
4. `main.py` combina ambos resultados:
   - `tokens`
   - `errores_lexicos`
   - `sintaxis_correcta`
   - `errores_sintacticos`

## Tokens del Lexer

Definidos en `lexer.py`:

- Palabras reservadas: `REPETIR`, `VECES`, `AGREGAR`
- Símbolos: `=` (`IGUAL`), `;` (`PUNTO_COMA`)
- `NUMERO`: enteros
- `UNIDAD`: `gr | ml | pizca`
- `VARIABLE`: mayúsculas con guiones bajos (ej. `MI_SALSA`)
- `INGREDIENTE`: texto en minúsculas (soporta acentos) y opcionalmente `_`

Cada token incluye: `token`, `lexema`, `linea`, `columna`.

## Gramática (Parser)

Reglas implementadas en `parser.py`:

```
receta : instrucciones

instrucciones : instruccion
              | instrucciones instruccion

instruccion : instruccion_agregar
            | instruccion_repetir
            | asignacion

instruccion_agregar : AGREGAR NUMERO UNIDAD INGREDIENTE PUNTO_COMA

instruccion_repetir : REPETIR NUMERO VECES instruccion_agregar

asignacion : VARIABLE IGUAL INGREDIENTE PUNTO_COMA
```

## Ejemplos de entrada

Válido:

```
AGREGAR 10 gr sal;
REPETIR 2 VECES AGREGAR 1 pizca pimienta;
MI_SALSA = tomate;
```

Inválido (faltan `;` o ingredientes):

```
AGREGAR 10 gr sal
MI_SALSA = ;
```

## Próximos pasos (sugerencias)

- Construir un **AST** en el parser (en lugar de solo validar).
- Agregar **análisis semántico** (tabla de símbolos para variables, validación de unidades, etc.).
- Mejorar recuperación de errores (por ejemplo, sincronización por saltos de línea además de `;`).

## Despliegue (recomendado)

Para una demo simple (backend + frontend juntos) se recomienda desplegar como un solo servicio usando Docker:

- La UI se sirve desde `GET /` (FastAPI entrega `index.html`)
- La UI llama a la API con ruta relativa `POST /compilar`

### Opción A: Render (Docker)

1. Sube este repo a GitHub.
2. En Render: New → Web Service → conecta tu repo.
3. Environment: Docker.
4. Deploy.
5. URL final:
   - UI: `https://TU-SERVICIO.onrender.com/`
   - API: `https://TU-SERVICIO.onrender.com/compilar`

### Opción B: Railway (Docker)

1. Sube este repo a GitHub.
2. En Railway: New Project → Deploy from GitHub Repo.
3. Railway detecta `Dockerfile` y lo construye.
4. Abre el dominio generado y entra a `/`.

### Opción C: Fly.io (Docker)

1. Instala Fly CLI y autentícate.
2. Crea la app y despliega usando Docker (Fly detecta `Dockerfile`).
