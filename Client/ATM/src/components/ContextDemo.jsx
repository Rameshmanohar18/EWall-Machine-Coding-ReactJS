import { createContext, useContext, useState } from "react";

// ── 1. Create context ────────────────────────────────────────
const ThemeContext = createContext(null);

// ── 2. Provider component ────────────────────────────────────
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark");
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── 3. Deep child — consumes context without prop drilling ───
function DeepChild() {
  const { theme, toggle } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div style={{
      background: isDark ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.15)",
      border: `1px solid ${isDark ? "var(--a)" : "rgba(255,255,255,0.4)"}`,
      borderRadius: "var(--r2)", padding: "var(--s5)",
      display: "flex", justifyContent: "space-between", alignItems: "center"
    }}>
      <div>
        <div style={{ fontWeight: 700, color: "var(--t1)", marginBottom: 4 }}>
          DeepChild (3 levels deep)
        </div>
        <div style={{ fontSize: "var(--sm)", color: "var(--t2)" }}>
          Current theme: <strong style={{ color: isDark ? "var(--a2)" : "var(--warn)" }}>{theme}</strong>
        </div>
      </div>
      <button className={`btn btn-sm ${isDark ? "btn-warn" : "btn-primary"}`} onClick={toggle}>
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>
  );
}

function Middle() {
  return (
    <div style={{ padding: "var(--s3)", border: "1px dashed var(--gb)", borderRadius: "var(--r2)" }}>
      <div style={{ fontSize: "var(--xs)", color: "var(--t3)", marginBottom: "var(--s3)",
        textTransform: "uppercase", letterSpacing: ".08em" }}>
        Middle component (passes NO props)
      </div>
      <DeepChild />
    </div>
  );
}

export default function ContextDemo() {
  return (
    <div className="card">
      <h2 className="card-title">🌐 useContext</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        <code>createContext</code> + <code>useContext</code> lets any component
        consume shared state without prop drilling through every level.
      </p>

      <ThemeProvider>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s3)" }}>
          <div style={{ fontSize: "var(--xs)", color: "var(--t3)", textTransform: "uppercase",
            letterSpacing: ".08em" }}>
            Provider (root)
          </div>
          <Middle />
        </div>
      </ThemeProvider>
    </div>
  );
}
