/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        neonCyan: "0 0 18px rgba(34,211,238,0.35)",
        neonFuchsia: "0 0 18px rgba(232,121,249,0.35)",
        neonGreen: "0 0 18px rgba(34,197,94,0.35)",
        neonRed: "0 0 18px rgba(239,68,68,0.35)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-30%)" },
          "100%": { transform: "translateY(130%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "5%": { opacity: "0.8" },
          "8%": { opacity: "0.95" },
          "20%": { opacity: "0.7" },
          "22%": { opacity: "1" },
          "55%": { opacity: "0.85" },
          "60%": { opacity: "1" },
        },
        holoIn: {
          "0%": { opacity: "0", transform: "translateY(14px) scale(0.985)", filter: "blur(6px)" },
          "55%": { opacity: "0.9", transform: "translateY(-2px) scale(1.01)", filter: "blur(1px)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)", filter: "blur(0px)" },
        },
        glitch: {
          "0%": { transform: "translateX(0) skewX(0deg)" },
          "2%": { transform: "translateX(-1px) skewX(-2deg)" },
          "4%": { transform: "translateX(1px) skewX(2deg)" },
          "6%": { transform: "translateX(0) skewX(0deg)" },
          "55%": { transform: "translateX(0) skewX(0deg)" },
          "58%": { transform: "translateX(1px) skewX(1.5deg)" },
          "62%": { transform: "translateX(-1px) skewX(-1.5deg)" },
          "66%": { transform: "translateX(0) skewX(0deg)" },
          "100%": { transform: "translateX(0) skewX(0deg)" },
        },
      },
      animation: {
        scan: "scan 3.8s linear infinite",
        flicker: "flicker 2.8s infinite",
        holoIn: "holoIn 900ms cubic-bezier(0.22, 1, 0.36, 1) both",
        glitch: "glitch 3.2s infinite",
      },
    },
  },
  plugins: [],
};
