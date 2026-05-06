import { useState, useEffect, useCallback } from "react";

// ── Custom Hook: useLocalStorage ─────────────────────────────
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback((newValue) => {
    setValue(prev => {
      const resolved = typeof newValue === "function" ? newValue(prev) : newValue;
      try { localStorage.setItem(key, JSON.stringify(resolved)); } catch {}
      return resolved;
    });
  }, [key]);

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(initialValue);
  }, [key, initialValue]);

  // Sync across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key) {
        try { setValue(e.newValue ? JSON.parse(e.newValue) : initialValue); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, initialValue]);

  return [value, set, remove];
}

// ── Demo ─────────────────────────────────────────────────────
export default function UseLocalStorageDemo() {
  const [name,  setName,  removeName]  = useLocalStorage("ls_name",  "");
  const [theme, setTheme, removeTheme] = useLocalStorage("ls_theme", "dark");
  const [count, setCount, removeCount] = useLocalStorage("ls_count", 0);

  return (
    <div className="card">
      <h2 className="card-title">💾 useLocalStorage Hook</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        Custom hook that syncs state with <code>localStorage</code> — persists across
        page refreshes and syncs across browser tabs via the <code>storage</code> event.
        Try refreshing the page — values are preserved.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s5)" }}>

        {/* Name */}
        <div style={{ background: "var(--glass2)", border: "1px solid var(--gb)", borderRadius: "var(--r2)", padding: "var(--s4)" }}>
          <div className="label" style={{ marginBottom: "var(--s2)" }}>Persisted Name (key: ls_name)</div>
          <div style={{ display: "flex", gap: "var(--s2)" }}>
            <input className="input" placeholder="Enter your name..."
              value={name} onChange={e => setName(e.target.value)} />
            <button className="btn btn-danger btn-sm" onClick={removeName}>Clear</button>
          </div>
          {name && <div style={{ marginTop: "var(--s2)", color: "var(--ok)", fontSize: "var(--sm)" }}>
            Saved: <strong>{name}</strong>
          </div>}
        </div>

        {/* Theme toggle */}
        <div style={{ background: "var(--glass2)", border: "1px solid var(--gb)", borderRadius: "var(--r2)", padding: "var(--s4)" }}>
          <div className="label" style={{ marginBottom: "var(--s2)" }}>Persisted Theme (key: ls_theme)</div>
          <div style={{ display: "flex", gap: "var(--s2)", alignItems: "center" }}>
            {["dark", "light", "system"].map(t => (
              <button key={t}
                className={`btn btn-sm ${theme === t ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTheme(t)}>
                {t === "dark" ? "🌙" : t === "light" ? "☀️" : "💻"} {t}
              </button>
            ))}
            <button className="btn btn-danger btn-sm" onClick={removeTheme}>Clear</button>
          </div>
        </div>

        {/* Counter */}
        <div style={{ background: "var(--glass2)", border: "1px solid var(--gb)", borderRadius: "var(--r2)", padding: "var(--s4)" }}>
          <div className="label" style={{ marginBottom: "var(--s2)" }}>Persisted Counter (key: ls_count)</div>
          <div style={{ display: "flex", gap: "var(--s2)", alignItems: "center" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setCount(c => c - 1)}>−</button>
            <span style={{ fontSize: "var(--xl)", fontWeight: 800, color: "var(--a2)", minWidth: 40, textAlign: "center" }}>
              {count}
            </span>
            <button className="btn btn-primary btn-sm" onClick={() => setCount(c => c + 1)}>+</button>
            <button className="btn btn-danger btn-sm" onClick={removeCount}>Reset</button>
          </div>
          <div style={{ marginTop: "var(--s2)", color: "var(--t3)", fontSize: "var(--xs)" }}>
            Refresh the page — counter stays at {count}
          </div>
        </div>

      </div>
    </div>
  );
}
