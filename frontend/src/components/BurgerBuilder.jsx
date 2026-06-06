export function BurgerBuilder({ stage = 0 }) {
  const s = Math.max(0, Math.min(Number(stage) || 0, 4));
  const showBuns = s >= 1;
  const showPatty = s >= 2;
  const showSauces = s >= 3;
  const showAssembly = s >= 4;

  const tSauce = 28;
  const tAssembly = 56;
  const tPatty = 84;
  const tBottomBun = 140;

  const points = [
    [82, 52],
    [118, 36],
    [160, 46],
    [206, 34],
    [248, 56],
    [292, 38],
    [328, 58],
    [96, 102],
    [140, 92],
    [186, 108],
    [232, 94],
    [278, 110],
    [318, 96],
    [114, 154],
    [168, 142],
    [214, 154],
    [258, 144],
    [304, 154],
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-black/35 p-5 shadow-neonCyan backdrop-blur">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.22),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(232,121,249,0.18),transparent_60%)]" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Burger Hologram</div>
            <div className="mt-2 text-sm text-slate-300">Proyección holográfica tipo low-poly.</div>
          </div>
          <div className="rounded-full border border-cyan-300/20 bg-black/40 px-3 py-1 text-xs text-cyan-200/70">
            etapa {s}/4
          </div>
        </div>

        <div className="relative mt-5 h-[360px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-black/45">
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background:linear-gradient(to_bottom,transparent,rgba(255,255,255,0.12),transparent)] animate-scan" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.10)_0px,rgba(255,255,255,0.10)_1px,transparent_1px,transparent_4px)]" />

          <svg
            viewBox="0 0 400 360"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Holograma de hamburguesa"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="strokeGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#22d3ee" stopOpacity="0.95" />
                <stop offset="0.55" stopColor="#60a5fa" stopOpacity="0.80" />
                <stop offset="1" stopColor="#e879f9" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="beamGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#22d3ee" stopOpacity="0.0" />
                <stop offset="0.45" stopColor="#22d3ee" stopOpacity="0.18" />
                <stop offset="1" stopColor="#22d3ee" stopOpacity="0.0" />
              </linearGradient>
              <pattern id="triMesh" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M0 0L48 0L0 48Z" fill="rgba(34,211,238,0.08)" />
                <path d="M48 0L48 48L0 48Z" fill="rgba(232,121,249,0.06)" />
                <path d="M24 0L48 24L24 48L0 24Z" fill="rgba(96,165,250,0.05)" />
                <path d="M0 24L24 0" stroke="rgba(34,211,238,0.16)" strokeWidth="0.6" />
                <path d="M24 0L48 24" stroke="rgba(232,121,249,0.12)" strokeWidth="0.6" />
                <path d="M0 48L24 24" stroke="rgba(96,165,250,0.12)" strokeWidth="0.6" />
                <path d="M24 24L48 48" stroke="rgba(34,211,238,0.12)" strokeWidth="0.6" />
              </pattern>
              <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.3" result="b" />
                <feColorMatrix
                  in="b"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.85 0"
                  result="c"
                />
                <feMerge>
                  <feMergeNode in="c" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="distort" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>

            <g className="animate-flicker" opacity="0.95">
              <path d="M200 340 L120 110" stroke="rgba(34,211,238,0.35)" strokeWidth="2" />
              <path d="M200 340 L280 110" stroke="rgba(232,121,249,0.20)" strokeWidth="2" />
              <path d="M200 340 L200 106" stroke="rgba(96,165,250,0.28)" strokeWidth="2" />
              <ellipse cx="200" cy="340" rx="66" ry="10" fill="rgba(34,211,238,0.16)" />
              <ellipse cx="200" cy="340" rx="30" ry="6" fill="rgba(232,121,249,0.12)" />
              <rect x="40" y="92" width="320" height="244" fill="url(#beamGrad)" opacity="0.35" />
            </g>

            {showBuns ? (
              <>
                <g className="animate-holoIn animate-flicker animate-glitch" filter="url(#distort)" opacity="0.98">
                  <path
                    d="M92 118 C110 70 150 46 200 46 C250 46 290 70 308 118 C314 134 306 144 292 144 L108 144 C94 144 86 134 92 118 Z"
                    fill="url(#triMesh)"
                    stroke="url(#strokeGrad)"
                    strokeWidth="2.2"
                    filter="url(#glow)"
                  />
                  <path d="M114 96 C150 74 250 74 286 96" fill="none" stroke="rgba(34,211,238,0.55)" strokeWidth="1.6" />
                  <g opacity="0.85">
                    <circle cx="150" cy="72" r="3" fill="rgba(34,211,238,0.55)" />
                    <circle cx="176" cy="64" r="2.6" fill="rgba(96,165,250,0.55)" />
                    <circle cx="204" cy="62" r="2.3" fill="rgba(232,121,249,0.40)" />
                    <circle cx="232" cy="64" r="2.6" fill="rgba(96,165,250,0.55)" />
                    <circle cx="258" cy="72" r="3" fill="rgba(34,211,238,0.55)" />
                  </g>
                </g>

                <g className="animate-holoIn animate-flicker animate-glitch" filter="url(#distort)" opacity="0.92" transform={`translate(0 ${tBottomBun})`}>
                  <path
                    d="M92 184 C94 166 110 154 130 154 H270 C290 154 306 166 308 184 C310 200 298 212 280 212 H120 C102 212 90 200 92 184 Z"
                    fill="url(#triMesh)"
                    stroke="url(#strokeGrad)"
                    strokeWidth="2.2"
                    filter="url(#glow)"
                  />
                </g>
              </>
            ) : (
              <g opacity="0.55">
                <text x="200" y="170" textAnchor="middle" fill="rgba(148,163,184,0.55)" fontSize="12">
                  Ejecuta el paso para proyectar el pan
                </text>
              </g>
            )}

            {showPatty ? (
              <g
                className="animate-holoIn animate-flicker animate-glitch"
                style={{ animationDuration: "1500ms" }}
                filter="url(#distort)"
                transform={`translate(0 ${tPatty})`}
              >
                <path
                  d="M108 154 H292 C304 154 314 163 314 175 C314 187 304 196 292 196 H108 C96 196 86 187 86 175 C86 163 96 154 108 154 Z"
                  fill="url(#triMesh)"
                  stroke="rgba(232,121,249,0.85)"
                  strokeWidth="2"
                  filter="url(#glow)"
                  opacity="0.9"
                />
              </g>
            ) : null}

            {showSauces ? (
              <g
                className="animate-holoIn animate-flicker animate-glitch"
                filter="url(#distort)"
                opacity="0.78"
                transform={`translate(0 ${tSauce})`}
              >
                <path
                  d="M120 140 C150 132 180 146 200 140 C220 134 250 144 280 136"
                  stroke="rgba(34,211,238,0.55)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M122 154 C155 146 180 160 206 154 C232 148 260 162 282 150"
                  stroke="rgba(232,121,249,0.40)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M128 168 C150 180 190 160 210 172 C232 186 262 160 272 178"
                  stroke="rgba(96,165,250,0.40)"
                  strokeWidth="1.6"
                  fill="none"
                />
              </g>
            ) : null}

            {showAssembly ? (
              <g
                className="animate-holoIn animate-flicker animate-glitch"
                filter="url(#distort)"
                opacity="0.78"
                transform={`translate(0 ${tAssembly})`}
              >
                <path
                  d="M120 146 L140 156 L160 146 L180 156 L200 146 L220 156 L240 146 L260 156 L280 146"
                  fill="none"
                  stroke="rgba(34,197,94,0.35)"
                  strokeWidth="2.2"
                />
                <path
                  d="M118 150 C150 164 178 144 206 156 C234 168 258 144 292 160"
                  fill="none"
                  stroke="rgba(239,68,68,0.30)"
                  strokeWidth="2.2"
                />
              </g>
            ) : null}

            <g className="animate-flicker" opacity="0.85">
              {points.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="1.8" fill={i % 3 === 0 ? "rgba(232,121,249,0.7)" : "rgba(34,211,238,0.75)"} />
              ))}
              {points.slice(0, 10).map(([x1, y1], i) => {
                const [x2, y2] = points[(i * 2 + 5) % points.length];
                return (
                  <line
                    key={"l" + i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={i % 2 === 0 ? "rgba(34,211,238,0.16)" : "rgba(232,121,249,0.12)"}
                    strokeWidth="0.9"
                  />
                );
              })}
            </g>
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="rounded-xl border border-slate-800 bg-black/40 px-3 py-2">
            <div className="text-slate-500">Proyección</div>
            <div className="mt-1 text-slate-200">{showBuns ? "Activa" : "Inactiva"}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-black/40 px-3 py-2">
            <div className="text-slate-500">Capas</div>
            <div className="mt-1 text-slate-200">{s}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
