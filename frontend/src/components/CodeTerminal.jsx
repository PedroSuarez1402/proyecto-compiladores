export function CodeTerminal({ value, onChange, onRun, disabled, isRunning }) {
  return (
    <section className="rounded-2xl border border-cyan-300/25 bg-black/45 p-5 shadow-neonCyan backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Code Terminal</div>
          <div className="mt-2 text-sm text-slate-300">Escribe el DSL y ejecuta el paso para compilar.</div>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={disabled || isRunning}
          className={[
            "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300",
            "border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 shadow-neonGreen",
            "hover:bg-emerald-500/20 active:bg-emerald-500/30",
            disabled || isRunning ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]",
          ].join(" ")}
        >
          {isRunning ? "COMPILANDO..." : "EJECUTAR"}
        </button>
      </div>

      <div className="mt-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          spellCheck={false}
          placeholder="AGREGAR 500 gr harina;\nAGREGAR 200 ml agua;\nAGREGAR 1 huevo;"
          className={[
            "h-[420px] w-full resize-none rounded-2xl border px-4 py-3 text-sm leading-6 outline-none transition-all duration-300",
            "border-emerald-400/25 bg-black text-emerald-200 placeholder:text-emerald-300/30",
            "focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20",
            disabled ? "opacity-60" : "",
          ].join(" ")}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <div>
          Atajo: <span className="rounded-md border border-slate-700 bg-black/50 px-2 py-1">Ctrl</span> +{" "}
          <span className="rounded-md border border-slate-700 bg-black/50 px-2 py-1">Enter</span>
        </div>
        <div className="text-slate-500">{(value ?? "").length} chars</div>
      </div>
    </section>
  );
}

