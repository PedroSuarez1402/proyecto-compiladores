export function RecipeScroll({ level }) {
  const titulo = level?.titulo ?? "";
  const instrucciones = level?.instrucciones ?? "";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-fuchsia-400/30 bg-black/35 p-5 shadow-neonFuchsia backdrop-blur">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,rgba(232,121,249,0.25),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.18),transparent_55%)]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-fuchsia-200/70">Mission Brief</div>
            <h2 className="mt-2 text-lg font-semibold text-slate-100">{titulo}</h2>
          </div>
          <div className="rounded-full border border-fuchsia-400/30 bg-black/40 px-3 py-1 text-xs text-fuchsia-200/70">
            v3.0
          </div>
        </div>

        <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-slate-800 bg-black/45 p-4 text-sm leading-6 text-slate-200">
          {instrucciones}
        </pre>
      </div>
    </section>
  );
}
