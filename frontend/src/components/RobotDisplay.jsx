import { useMemo } from "react";
import { useTypewriter } from "../hooks/useTypewriter.js";

function RobotAvatar({ color }) {
  const glow =
    color === "green"
      ? "drop-shadow-[0_0_16px_rgba(34,197,94,0.35)]"
      : color === "red"
        ? "drop-shadow-[0_0_16px_rgba(239,68,68,0.35)]"
        : "drop-shadow-[0_0_16px_rgba(34,211,238,0.35)]";
  const stroke =
    color === "green" ? "#22c55e" : color === "red" ? "#ef4444" : "#22d3ee";

  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className={glow} aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={stroke} stopOpacity="0.95" />
          <stop offset="1" stopColor={stroke} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect x="10" y="14" width="52" height="44" rx="14" fill="rgba(0,0,0,0.45)" stroke="url(#g)" strokeWidth="2" />
      <circle cx="28" cy="36" r="4.5" fill={stroke} fillOpacity="0.85" />
      <circle cx="44" cy="36" r="4.5" fill={stroke} fillOpacity="0.85" />
      <path d="M24 48c4.8 4 18.2 4 23 0" fill="none" stroke={stroke} strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 10v6" stroke={stroke} strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="8" r="2" fill={stroke} fillOpacity="0.8" />
    </svg>
  );
}

export function RobotDisplay({ status }) {
  const state = status?.state ?? "idle";
  const title = status?.title ?? "Esperando receta...";
  const lines = Array.isArray(status?.lines) ? status.lines : [];

  const color = state === "success" ? "green" : state === "error" ? "red" : "blue";
  const titleTyped = useTypewriter(title, { speedMs: 10, enabled: state !== "running" });

  const panelTone =
    state === "success"
      ? "border-emerald-400/30 bg-emerald-500/10 shadow-neonGreen"
      : state === "error"
        ? "border-red-400/30 bg-red-500/10 shadow-neonRed"
        : "border-cyan-300/25 bg-black/45 shadow-neonCyan";

  const titleTone =
    state === "success" ? "text-emerald-200" : state === "error" ? "text-red-200" : "text-cyan-200";

  const dots = useMemo(() => {
    if (state !== "running") return null;
    return (
      <span className="inline-flex items-center gap-1 text-slate-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400/70" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400/50 [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400/35 [animation-delay:240ms]" />
      </span>
    );
  }, [state]);

  return (
    <section className={`rounded-2xl border p-5 backdrop-blur ${panelTone}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Robot Display</div>
          <div className="mt-2 flex items-center gap-3">
            <RobotAvatar color={color} />
            <div>
              <div className={`text-sm font-semibold ${titleTone}`}>{state === "running" ? title : titleTyped}</div>
              <div className="mt-2 text-xs text-slate-400">
                {state === "running" ? (
                  <span className="inline-flex items-center gap-2">
                    Analizando léxico, sintaxis, semántica y VM {dots}
                  </span>
                ) : (
                  "Inspección disponible para tokens/semántica/VM."
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 text-xs text-slate-400">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-neonCyan" />
            <span>{state === "success" ? "OK" : state === "error" ? "ERROR" : state === "running" ? "RUN" : "IDLE"}</span>
          </div>
          <div className="text-slate-500">Kitchen Unit #07</div>
        </div>
      </div>

      {lines.length > 0 ? (
        <div className="mt-4 rounded-xl border border-slate-800/70 bg-black/45 p-4">
          <ul className="space-y-2">
            {lines.slice(0, 8).map((l, idx) => (
              <li key={idx} className="text-xs text-slate-200">
                <span className="text-slate-500">{String(idx + 1).padStart(2, "0")} </span>
                <span className="whitespace-pre-wrap break-words">{l}</span>
              </li>
            ))}
          </ul>
          {lines.length > 8 ? (
            <div className="mt-3 text-xs text-slate-500">+{lines.length - 8} más… abre Inspección</div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

