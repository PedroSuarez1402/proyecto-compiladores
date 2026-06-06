import { useMemo, useState } from "react";

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300",
        active
          ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200 shadow-neonFuchsia"
          : "border-slate-700 bg-black/40 text-slate-200 hover:bg-black/55",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function DebugModal({ open, onClose, data }) {
  const [tab, setTab] = useState("tokens");

  const tokens = Array.isArray(data?.tokens) ? data.tokens : [];
  const sem = Array.isArray(data?.errores_semanticos) ? data.errores_semanticos : [];
  const exec = Array.isArray(data?.errores_ejecucion) ? data.errores_ejecucion : [];
  const plato = data?.plato_final ?? {};

  const json = useMemo(() => JSON.stringify(data ?? {}, null, 2), [data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={-1}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-700 bg-black/70 shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Debug Console</div>
              <div className="mt-1 text-sm font-semibold text-slate-100">Tokens / Semántica / VM</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-black/40 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-black/55"
            >
              Cerrar
            </button>
          </div>

          <div className="px-5 pt-4">
            <div className="flex flex-wrap gap-2">
              <TabButton active={tab === "tokens"} onClick={() => setTab("tokens")}>
                Tokens
              </TabButton>
              <TabButton active={tab === "semantica"} onClick={() => setTab("semantica")}>
                Semántica
              </TabButton>
              <TabButton active={tab === "vm"} onClick={() => setTab("vm")}>
                VM
              </TabButton>
              <TabButton active={tab === "json"} onClick={() => setTab("json")}>
                JSON
              </TabButton>
            </div>
          </div>

          <div className="px-5 pb-5 pt-4">
            {tab === "tokens" ? (
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-black/40">
                <div className="max-h-[420px] overflow-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-black/80 text-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Token</th>
                        <th className="px-4 py-3 font-semibold">Lexema</th>
                        <th className="px-4 py-3 font-semibold">Línea</th>
                        <th className="px-4 py-3 font-semibold">Col</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {tokens.map((t, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-mono text-cyan-200">{String(t?.token ?? "")}</td>
                          <td className="px-4 py-3 font-mono text-slate-200">{String(t?.lexema ?? "")}</td>
                          <td className="px-4 py-3 font-mono text-slate-300">{String(t?.linea ?? "")}</td>
                          <td className="px-4 py-3 font-mono text-slate-300">{String(t?.columna ?? "")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {tab === "semantica" ? (
              <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Errores semánticos</div>
                <ul className="mt-3 space-y-2">
                  {sem.length === 0 ? (
                    <li className="text-sm text-emerald-200">Sin errores semánticos.</li>
                  ) : (
                    sem.map((e, idx) => (
                      <li key={idx} className="text-xs text-red-200">
                        {e?.mensaje ?? "Error semántico"}{" "}
                        {e?.linea != null ? `(línea ${e.linea}${e?.columna != null ? `, col ${e.columna}` : ""})` : ""}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ) : null}

            {tab === "vm" ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Plato final</div>
                  <pre className="mt-3 max-h-[380px] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-800 bg-black/50 p-3 text-xs text-slate-200">
                    {JSON.stringify(plato ?? {}, null, 2)}
                  </pre>
                </div>
                <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Errores de ejecución</div>
                  <ul className="mt-3 space-y-2">
                    {exec.length === 0 ? (
                      <li className="text-sm text-emerald-200">Sin errores de ejecución.</li>
                    ) : (
                      exec.map((e, idx) => (
                        <li key={idx} className="text-xs text-red-200">
                          {e?.mensaje ?? "Error de ejecución"}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            ) : null}

            {tab === "json" ? (
              <div className="rounded-xl border border-slate-800 bg-black/40 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Respuesta cruda</div>
                <pre className="mt-3 max-h-[420px] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-800 bg-black/50 p-3 text-xs text-slate-200">
                  {json}
                </pre>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

