export function GameScreen({ children }) {
  return (
    <div className="relative h-dvh overflow-hidden bg-gray-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.16),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-size:56px_56px] [background-position:center] bg-grid" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:linear-gradient(to_bottom,transparent,rgba(255,255,255,0.10),transparent)] animate-scan" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.10)_0px,rgba(255,255,255,0.10)_1px,transparent_1px,transparent_4px)]" />

      <div className="relative mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col px-4 py-6 font-mono">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="animate-flicker">
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Robot Kitchen OS</div>
            <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">DLS-Recetas: Proyecto Compiladores</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-neonCyan" />
            <span>Enlace API: /compilar</span>
          </div>
        </header>

        <main className="mt-6 min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
