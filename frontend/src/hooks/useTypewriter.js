import { useEffect, useState } from "react";

export function useTypewriter(text, { speedMs = 12, enabled = true } = {}) {
  const [out, setOut] = useState("");

  useEffect(() => {
    const full = String(text ?? "");
    if (!enabled) {
      setOut(full);
      return;
    }

    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, speedMs);

    return () => window.clearInterval(id);
  }, [text, speedMs, enabled]);

  return out;
}

