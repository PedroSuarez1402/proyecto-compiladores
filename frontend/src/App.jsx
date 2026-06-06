import { useCallback, useEffect, useMemo, useState } from "react";
import { GameScreen } from "./components/GameScreen.jsx";
import { RecipeScroll } from "./components/RecipeScroll.jsx";
import { CodeTerminal } from "./components/CodeTerminal.jsx";
import { RobotDisplay } from "./components/RobotDisplay.jsx";
import { DebugModal } from "./components/DebugModal.jsx";
import { CompletionModal } from "./components/CompletionModal.jsx";
import { BurgerBuilder } from "./components/BurgerBuilder.jsx";
import { levels } from "./data/levels.js";

function ingredientesDesdeTokens(tokens) {
  const set = new Set();
  const arr = Array.isArray(tokens) ? tokens : [];
  for (const t of arr) {
    if (t?.token === "INGREDIENTE" && typeof t?.lexema === "string") set.add(t.lexema.toLowerCase());
  }
  return set;
}

function contieneIngredientesRequeridos(tokens, ingredientes) {
  const encontrados = ingredientesDesdeTokens(tokens);
  return (ingredientes ?? []).filter((ing) => !encontrados.has(String(ing).toLowerCase()));
}

function unidadCanonica(unidad) {
  const u = String(unidad ?? "").toLowerCase();
  if (["u", "und", "unidad", "pza", "pz"].includes(u)) return "u";
  return u;
}

function compararPlato(platoFinal, platoObjetivo) {
  const errores = [];
  const actual = platoFinal ?? {};
  const esperado = platoObjetivo ?? {};

  for (const [ing, exp] of Object.entries(esperado)) {
    const a = actual[ing];
    if (!a) {
      errores.push(`Falta: ${ing} (esperado ${exp.cantidad} ${exp.unidad})`);
      continue;
    }
    const unidadAct = unidadCanonica(a.unidad);
    const unidadExp = unidadCanonica(exp.unidad);
    const cantAct = Number(a.cantidad);
    const cantExp = Number(exp.cantidad);

    if (unidadAct !== unidadExp) {
      errores.push(`Unidad incorrecta en ${ing}: esperado ${unidadExp}, recibido ${unidadAct}`);
      continue;
    }
    if (!Number.isFinite(cantAct) || cantAct !== cantExp) {
      errores.push(`Cantidad incorrecta en ${ing}: esperado ${cantExp} ${unidadExp}, recibido ${cantAct} ${unidadAct}`);
    }
  }

  return { ok: errores.length === 0, errores };
}

function accionesAgregarDesdeIR(acciones) {
  const result = [];
  const arr = Array.isArray(acciones) ? acciones : [];
  for (const a of arr) {
    if (!a || typeof a !== "object") continue;
    if (a.op === "agregar") {
      result.push(String(a.ingrediente ?? "").toLowerCase());
      continue;
    }
    if (a.op === "repetir" && a.accion && a.accion.op === "agregar") {
      result.push(String(a.accion.ingrediente ?? "").toLowerCase());
    }
  }
  return result;
}

function validarOrden(acciones, ordenRequerido) {
  const esperado = Array.isArray(ordenRequerido) ? ordenRequerido.map((x) => String(x).toLowerCase()) : [];
  const actual = accionesAgregarDesdeIR(acciones);

  if (esperado.length === 0) return { ok: true, errores: [] };
  if (actual.length < esperado.length) {
    return {
      ok: false,
      errores: [`Orden incompleto: se esperaban ${esperado.length} pasos, pero se encontraron ${actual.length}`],
    };
  }

  const errores = [];
  for (let i = 0; i < esperado.length; i++) {
    if (actual[i] !== esperado[i]) {
      errores.push(`Paso ${i + 1}: esperado '${esperado[i]}', recibido '${actual[i] || "(vacío)"}'`);
    }
  }

  return { ok: errores.length === 0, errores };
}

function formatErrorBlocks(resp) {
  const bloques = [];
  const lex = Array.isArray(resp?.errores_lexicos) ? resp.errores_lexicos : [];
  const sint = Array.isArray(resp?.errores_sintacticos) ? resp.errores_sintacticos : [];
  const sem = Array.isArray(resp?.errores_semanticos) ? resp.errores_semanticos : [];

  for (const e of lex) {
    bloques.push(`Error léxico: '${e.lexema}' (línea ${e.linea}, col ${e.columna})`);
  }
  for (const e of sint) {
    const base = e.mensaje ?? "Error sintáctico";
    const loc = e.linea != null && e.columna != null ? ` (línea ${e.linea}, col ${e.columna})` : "";
    bloques.push(`${base}${loc}`);
  }
  for (const e of sem) {
    const base = e.mensaje ?? "Error semántico";
    const loc = e.linea != null && e.columna != null ? ` (línea ${e.linea}, col ${e.columna})` : "";
    bloques.push(`${base}${loc}`);
  }

  return bloques;
}

function getCompilarUrl() {
  const base = String(import.meta.env.VITE_API_URL ?? "").trim().replace(/\/$/, "");
  if (base) return `${base}/compilar`;
  return "/compilar";
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completedMap, setCompletedMap] = useState({});

  const [currentLevel, setCurrentLevel] = useState(0);
  const level = levels[currentLevel] ?? null;

  const [userInput, setUserInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const [robotStatus, setRobotStatus] = useState({
    state: "idle",
    title: "Esperando receta...",
    lines: [],
  });
  const [debugData, setDebugData] = useState(null);

  const compilarUrl = useMemo(() => getCompilarUrl(), []);

  const resetToLevel = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(idx, levels.length - 1));
    setCurrentLevel(clamped);
    setUserInput("");
    setCanNext(false);
    setRobotStatus({ state: "idle", title: "Esperando receta...", lines: [] });
    setDebugData(null);
    if (clamped === 0) setCompletedMap({});
  }, []);

  const restartGame = useCallback(() => {
    setCompletionOpen(false);
    setDebugOpen(false);
    setCompletedMap({});
    setCurrentLevel(0);
    setUserInput("");
    setCanNext(false);
    setRobotStatus({ state: "idle", title: "Esperando receta...", lines: [] });
    setDebugData(null);
  }, []);

  const stage = useMemo(() => {
    let s = 0;
    for (const lvl of levels) {
      if (completedMap?.[lvl.id] === true) s += 1;
    }
    return s;
  }, [completedMap]);

  const run = useCallback(async () => {
    if (!started || !level || isRunning) return;
    setIsRunning(true);
    setCanNext(false);
    setRobotStatus({ state: "running", title: "Compilando...", lines: [] });

    try {
      const res = await fetch(compilarUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receta: userInput ?? "" }),
      });
      const data = await res.json();
      setDebugData(data);

      const errores = formatErrorBlocks(data);
      if (!res.ok) {
        setRobotStatus({ state: "error", title: `Error HTTP (${res.status})`, lines: errores.length ? errores : ["Respuesta inválida"] });
        return;
      }

      const sintaxisOk = data?.sintaxis_correcta === true;
      const semOk = Array.isArray(data?.errores_semanticos) ? data.errores_semanticos.length === 0 : true;
      const lexOk = Array.isArray(data?.errores_lexicos) ? data.errores_lexicos.length === 0 : true;
      const sintErrOk = Array.isArray(data?.errores_sintacticos) ? data.errores_sintacticos.length === 0 : true;

      if (!sintaxisOk || !semOk || !lexOk || !sintErrOk) {
        const hasSem = Array.isArray(data?.errores_semanticos) && data.errores_semanticos.length > 0;
        setRobotStatus({
          state: "error",
          title: hasSem ? "Errores semánticos" : "Se detectaron errores",
          lines: errores,
        });
        return;
      }

      const faltantes = contieneIngredientesRequeridos(data?.tokens, level?.ingredientes_requeridos);
      if (faltantes.length > 0) {
        setRobotStatus({
          state: "error",
          title: "Faltan ingredientes requeridos",
          lines: faltantes.map((x) => `Falta: ${x}`),
        });
        return;
      }

      const execErrors = Array.isArray(data?.errores_ejecucion) ? data.errores_ejecucion : [];
      if (execErrors.length > 0) {
        setRobotStatus({
          state: "error",
          title: "Errores de ejecución",
          lines: execErrors.map((e) => e?.mensaje ?? "Error de ejecución"),
        });
        return;
      }

      const { ok: platoOk, errores: platoErrores } = compararPlato(data?.plato_final, level?.plato_objetivo);
      if (!platoOk) {
        setRobotStatus({
          state: "error",
          title: "Receta válida, pero cantidades incorrectas",
          lines: platoErrores,
        });
        return;
      }

      const { ok: ordenOk, errores: ordenErrores } = validarOrden(data?.acciones, level?.orden_requerido);
      if (!ordenOk) {
        setRobotStatus({
          state: "error",
          title: "Orden de pasos incorrecto",
          lines: ordenErrores,
        });
        return;
      }

      if (currentLevel >= levels.length - 1) {
        setRobotStatus({ state: "success", title: "¡Hamburguesa completada! 🎉", lines: [] });
        setCanNext(false);
        setCompletedMap((prev) => ({ ...(prev ?? {}), [level.id]: true }));
        const prevOk = levels.slice(0, -1).every((lvl) => completedMap?.[lvl.id] === true);
        if (prevOk) setCompletionOpen(true);
        return;
      }

      setRobotStatus({ state: "success", title: "¡Perfecto! Has completado esta fase.", lines: [] });
      setCompletedMap((prev) => ({ ...(prev ?? {}), [level.id]: true }));
      setCanNext(true);
    } catch (e) {
      const msg = e?.message ? String(e.message) : "Error de red";
      setRobotStatus({ state: "error", title: "No se pudo conectar con la API", lines: [msg] });
      setDebugData({ error: msg });
    } finally {
      setIsRunning(false);
    }
  }, [compilarUrl, completedMap, currentLevel, isRunning, level, started, userInput]);

  useEffect(() => {
    if (!started) return;
    resetToLevel(0);
  }, [resetToLevel, started]);

  useEffect(() => {
    const onKeyDown = (ev) => {
      if (!started) return;
      if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault();
        run();
      }
      if (ev.key === "Escape") {
        setDebugOpen(false);
        setCompletionOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [run, started]);

  return (
    <GameScreen>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <RecipeScroll level={level} />

        <div className="flex flex-col gap-5 lg:col-span-1">
          <CodeTerminal value={userInput} onChange={setUserInput} onRun={run} disabled={!started} isRunning={isRunning} />

          {canNext ? (
            <button
              type="button"
              onClick={() => resetToLevel(currentLevel + 1)}
              className="animate-pulse rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-4 text-center text-sm font-semibold text-emerald-200 shadow-neonGreen transition-all duration-300 hover:bg-emerald-500/20 hover:scale-[1.01]"
            >
              SIGUIENTE NIVEL
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          <BurgerBuilder stage={stage} />
          <RobotDisplay status={robotStatus} />

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-black/40 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Tokens</div>
              <div className="mt-2 text-2xl font-semibold text-slate-200">{Array.isArray(debugData?.tokens) ? debugData.tokens.length : 0}</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-black/40 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Errores</div>
              <div className="mt-2 text-2xl font-semibold text-slate-200">{robotStatus?.state === "error" ? robotStatus.lines.length : 0}</div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDebugOpen(true)}
        disabled={!started}
        className={[
          "fixed bottom-6 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full border text-base font-bold shadow-xl backdrop-blur transition-all duration-300",
          "border-slate-700 bg-black/60 text-slate-200 hover:scale-110 hover:bg-black/75",
          !started ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
        aria-label="Abrir panel de depuración"
      >
        ⛭
      </button>

      <DebugModal open={debugOpen} onClose={() => setDebugOpen(false)} data={debugData} />
      <CompletionModal open={completionOpen} onRestart={restartGame} onClose={() => setCompletionOpen(false)} />

      {!started ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-300/25 bg-black/70 p-8 shadow-neonCyan backdrop-blur">
            <div className="text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-500/10 text-2xl shadow-neonCyan">
                🤖
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-100 sm:text-3xl">Iniciar Juego: Compilación de Hamburguesa</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                4 niveles. Validación de tokens, semántica, ejecución (VM) y orden de pasos.
              </p>
              <div className="mt-7">
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500/15 px-6 py-4 text-base font-semibold text-cyan-100 shadow-neonCyan transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-500/25 active:bg-cyan-500/30 sm:w-auto"
                >
                  🍔 INICIAR COMPILACIÓN
                </button>
              </div>
              <div className="mt-5 text-xs text-slate-500">Tip: Ctrl + Enter para ejecutar.</div>
              <div className="mt-3 text-xs text-slate-600">
                {String(import.meta.env.PROD) === "true" && !String(import.meta.env.VITE_API_URL ?? "").trim()
                  ? "Falta configurar VITE_API_URL para producción."
                  : ""}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </GameScreen>
  );
}
