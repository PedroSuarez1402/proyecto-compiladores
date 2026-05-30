import { levels } from "./levels.js";

const API_URL = "/compilar";

const $ = (id) => document.getElementById(id);

const elNivelTitulo = $("nivelTitulo");
const elPapel = $("papelReceta");
const elEditor = $("editor");
const elBtnEjecutar = $("btnEjecutar");
const elBtnSiguiente = $("btnSiguiente");
const elRobotPanel = $("robotPanel");
const elMetricTokens = $("metricTokens");
const elMetricErrores = $("metricErrores");
const elApiStatus = $("apiStatus");
const elLedEstado = $("ledEstado");

const elBtnInspector = $("btnInspector");
const elModal = $("modal");
const elModalBackdrop = $("modalBackdrop");
const elBtnCerrarModal = $("btnCerrarModal");
const elTokensTbody = $("tokensTbody");
const elListaSolidos = $("listaSolidos");
const elListaLiquidos = $("listaLiquidos");
const elCodigoIntermedio = $("codigoIntermedio");
const elJsonRaw = $("jsonRaw");
const elBtnCopiarJson = $("btnCopiarJson");

let nivelActual = 0;
let lastResponse = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setLed(color) {
  elLedEstado.classList.remove("bg-blue-500", "bg-green-500", "bg-red-500");
  elLedEstado.classList.remove("shadow-blue-500/30", "shadow-green-500/30", "shadow-red-500/30");
  if (color === "green") {
    elLedEstado.classList.add("bg-green-500", "shadow-green-500/30");
    return;
  }
  if (color === "red") {
    elLedEstado.classList.add("bg-red-500", "shadow-red-500/30");
    return;
  }
  elLedEstado.classList.add("bg-blue-500", "shadow-blue-500/30");
}

function openModal() {
  elModal.classList.remove("hidden");
  elModal.classList.add("flex");
  elModalBackdrop.classList.remove("hidden");
}

function closeModal() {
  elModal.classList.add("hidden");
  elModal.classList.remove("flex");
  elModalBackdrop.classList.add("hidden");
}

function setTab(tabName) {
  document.querySelectorAll(".tabPane").forEach((el) => el.classList.add("hidden"));
  $("tab_" + tabName).classList.remove("hidden");

  document.querySelectorAll(".tabBtn").forEach((btn) => {
    const active = btn.dataset.tab === tabName;
    btn.classList.toggle("bg-indigo-600", active);
    btn.classList.toggle("text-white", active);
    btn.classList.toggle("bg-slate-950", !active);
    btn.classList.toggle("text-slate-200", !active);
    btn.classList.toggle("hover:bg-slate-900", !active);
  });
}

function renderTokens(tokens) {
  const arr = Array.isArray(tokens) ? tokens : [];
  elTokensTbody.innerHTML = arr
    .map((t) => {
      const token = escapeHtml(t.token);
      const lexema = escapeHtml(t.lexema);
      const linea = escapeHtml(t.linea);
      return `<tr class="text-slate-200">
        <td class="px-4 py-3 font-mono">${token}</td>
        <td class="px-4 py-3 font-mono text-slate-300">${lexema}</td>
        <td class="px-4 py-3 font-mono">${linea}</td>
      </tr>`;
    })
    .join("");
}

function renderCodigoIntermedio(lines) {
  const arr = Array.isArray(lines) ? lines : [];
  elCodigoIntermedio.textContent = arr.join("\n");
}

function renderJson(resp) {
  elJsonRaw.textContent = JSON.stringify(resp ?? {}, null, 2);
}

function renderSimbolos() {
  const solidos = ["harina", "sal", "pimienta", "carne_molida", "queso_derretido", "tocineta"].sort();
  const liquidos = ["agua", "leche", "mayonesa", "ketchup", "mostaza"].sort();
  const unidades = ["huevo", "pan"].sort();

  const li = (x, tag) =>
    `<li class="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"><span>${escapeHtml(
      x
    )}</span><span class="text-xs text-slate-500">${tag}</span></li>`;

  elListaSolidos.innerHTML = solidos.map((x) => li(x, "solido")).concat(unidades.map((x) => li(x, "unidad"))).join("");
  elListaLiquidos.innerHTML = liquidos.map((x) => li(x, "liquido")).join("");
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

function renderRobotConsole({ ok, message, errors, style }) {
  elMetricTokens.textContent = String(Array.isArray(lastResponse?.tokens) ? lastResponse.tokens.length : 0);
  elMetricErrores.textContent = String(Array.isArray(errors) ? errors.length : 0);

  if (ok) {
    elRobotPanel.innerHTML = `
      <div class="rounded-xl border border-emerald-900/60 bg-emerald-950/40 px-4 py-4 transition-all duration-300">
        <div class="text-sm font-semibold text-emerald-300">${escapeHtml(message)}</div>
        <div class="mt-2 text-xs text-emerald-200/70">Puedes avanzar al siguiente nivel.</div>
      </div>
    `;
    return;
  }

  const items = (errors ?? [])
    .slice(0, 8)
    .map((e) => `<li class="font-mono text-xs ${style?.itemText ?? "text-red-200"}">${escapeHtml(e)}</li>`)
    .join("");

  const extra =
    (errors ?? []).length > 8
      ? `<div class="mt-3 text-xs ${style?.extraText ?? "text-red-200/70"}">+${errors.length - 8} más… revisa Inspección</div>`
      : "";

  elRobotPanel.innerHTML = `
    <div class="rounded-xl border ${style?.border ?? "border-red-900/60"} ${style?.bg ?? "bg-red-950/40"} px-4 py-4 transition-all duration-300">
      <div class="text-sm font-semibold ${style?.titleText ?? "text-red-300"}">${escapeHtml(message)}</div>
      <ul class="mt-3 space-y-2">${items}</ul>
      ${extra}
    </div>
  `;
}

function ingredientesDesdeTokens(tokens) {
  const set = new Set();
  const arr = Array.isArray(tokens) ? tokens : [];
  for (const t of arr) {
    if (t?.token === "INGREDIENTE" && typeof t?.lexema === "string") {
      set.add(t.lexema.toLowerCase());
    }
  }
  return set;
}

function contieneIngredientesRequeridos(tokens, ingredientes) {
  const encontrados = ingredientesDesdeTokens(tokens);
  return (ingredientes ?? []).filter((ing) => !encontrados.has(String(ing).toLowerCase()));
}

function cargarNivel(indice) {
  nivelActual = Math.max(0, Math.min(indice, levels.length - 1));
  const lvl = levels[nivelActual];
  elNivelTitulo.textContent = lvl ? lvl.titulo : "";
  elPapel.textContent = lvl ? lvl.instrucciones : "";
  elEditor.value = "";
  elBtnSiguiente.classList.add("hidden");
  setLed("blue");
  elApiStatus.textContent = "idle";
  lastResponse = null;
  renderTokens([]);
  renderCodigoIntermedio([]);
  renderJson({});
  renderRobotConsole({
    ok: false,
    message: "Esperando receta...",
    errors: [],
    style: { border: "border-slate-800", bg: "bg-slate-950/60", titleText: "text-slate-300", itemText: "text-slate-500" },
  });
}

async function compilar(receta) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receta }),
  });
  const data = await res.json();
  return { res, data };
}

async function ejecutarPaso() {
  const receta = elEditor.value ?? "";
  elBtnEjecutar.disabled = true;
  elBtnEjecutar.classList.add("opacity-70");
  elApiStatus.textContent = "ejecutando";
  setLed("blue");
  elBtnSiguiente.classList.add("hidden");

  try {
    const { res, data } = await compilar(receta);
    lastResponse = data;

    renderTokens(data?.tokens);
    renderCodigoIntermedio(data?.codigo_intermedio);
    renderJson(data);

    const errores = formatErrorBlocks(data);
    elMetricTokens.textContent = String(Array.isArray(data?.tokens) ? data.tokens.length : 0);
    elMetricErrores.textContent = String(errores.length);
    elApiStatus.textContent = res.ok ? "ok" : `http ${res.status}`;

    if (!res.ok) {
      setLed("red");
      renderRobotConsole({ ok: false, message: "Error HTTP", errors: errores });
      return;
    }

    const sintaxisOk = data?.sintaxis_correcta === true;
    const semOk = Array.isArray(data?.errores_semanticos) ? data.errores_semanticos.length === 0 : true;
    const lexOk = Array.isArray(data?.errores_lexicos) ? data.errores_lexicos.length === 0 : true;
    const sintErrOk = Array.isArray(data?.errores_sintacticos) ? data.errores_sintacticos.length === 0 : true;

    if (!sintaxisOk || !semOk || !lexOk || !sintErrOk) {
      const hasSem = Array.isArray(data?.errores_semanticos) && data.errores_semanticos.length > 0;
      setLed("red");
      renderRobotConsole({
        ok: false,
        message: hasSem ? "Errores semánticos" : "Se detectaron errores",
        errors: errores,
        style: hasSem
          ? { border: "border-red-900/40", bg: "bg-red-900/20", titleText: "text-red-300", itemText: "text-red-200", extraText: "text-red-200/70" }
          : undefined,
      });
      return;
    }

    const lvl = levels[nivelActual];
    const faltantes = contieneIngredientesRequeridos(data?.tokens, lvl?.ingredientes_requeridos);
    if (faltantes.length > 0) {
      setLed("red");
      renderRobotConsole({
        ok: false,
        message: "Faltan ingredientes requeridos",
        errors: faltantes.map((x) => `Falta: ${x}`),
      });
      return;
    }

    setLed("green");
    renderRobotConsole({ ok: true, message: "¡Perfecto! Has completado esta fase.", errors: [] });
    elBtnSiguiente.classList.remove("hidden");
  } catch (e) {
    setLed("red");
    const msg = e?.message ? String(e.message) : "Error de red";
    elApiStatus.textContent = "error";
    renderRobotConsole({ ok: false, message: "No se pudo conectar con la API", errors: [msg] });
    renderTokens([]);
    renderCodigoIntermedio([]);
    renderJson({ error: msg });
  } finally {
    elBtnEjecutar.disabled = false;
    elBtnEjecutar.classList.remove("opacity-70");
  }
}

function siguienteNivel() {
  if (nivelActual >= levels.length - 1) {
    setLed("green");
    renderRobotConsole({ ok: true, message: "¡Hamburguesa completada! 🎉", errors: [] });
    elBtnSiguiente.classList.add("hidden");
    return;
  }
  cargarNivel(nivelActual + 1);
}

elBtnEjecutar.addEventListener("click", ejecutarPaso);
elBtnSiguiente.addEventListener("click", siguienteNivel);

elEditor.addEventListener("keydown", (ev) => {
  if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
    ev.preventDefault();
    ejecutarPaso();
  }
});

elBtnInspector.addEventListener("click", () => {
  openModal();
  setTab("tokens");
});
elBtnCerrarModal.addEventListener("click", closeModal);
elModalBackdrop.addEventListener("click", closeModal);
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") closeModal();
});
document.querySelectorAll(".tabBtn").forEach((btn) => {
  btn.addEventListener("click", () => setTab(btn.dataset.tab));
});

elBtnCopiarJson.addEventListener("click", async () => {
  const text = elJsonRaw.textContent ?? "";
  try {
    await navigator.clipboard.writeText(text);
    elBtnCopiarJson.textContent = "Copiado";
    setTimeout(() => (elBtnCopiarJson.textContent = "Copiar"), 900);
  } catch {
    elBtnCopiarJson.textContent = "No disponible";
    setTimeout(() => (elBtnCopiarJson.textContent = "Copiar"), 900);
  }
});

renderSimbolos();
cargarNivel(0);
