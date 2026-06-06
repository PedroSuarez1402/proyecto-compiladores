export function CompletionModal({ open, onRestart, onClose }) {
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
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-400/25 bg-black/75 shadow-2xl shadow-black/60">
          <div className="border-b border-slate-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-500/10 text-2xl shadow-neonGreen">
                👨‍🍳
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Proceso Finalizado</div>
                <div className="mt-1 text-base font-semibold text-slate-100">Hamburguesa completada</div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
              felicitaciones has completado una hamburguesa, quieres volver a empezar?
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-700 bg-black/40 px-5 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:bg-black/55 sm:w-auto"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-emerald-400/35 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-200 shadow-neonGreen transition-all duration-300 hover:bg-emerald-500/20 hover:scale-[1.01] sm:w-auto"
              >
                Reiniciar
              </button>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Tip: Reiniciar vuelve al Nivel 1 y limpia el editor, métricas y paneles.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

