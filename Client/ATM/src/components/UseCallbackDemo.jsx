import { useState, useCallback, memo } from "react";

// Child wrapped in React.memo — only re-renders if props change
const Button = memo(({ label, onClick, renderCount }) => {
  return (
    <div style={{
      background: "var(--glass2)", border: "1px solid var(--gb)",
      borderRadius: "var(--r2)", padding: "var(--s4)",
      display: "flex", justifyContent: "space-between", alignItems: "center"
    }}>
      <button className="btn btn-primary btn-sm" onClick={onClick}>{label}</button>
      <span style={{ fontSize: "var(--xs)", color: "var(--t3)" }}>
        rendered {renderCount} time(s)
      </span>
    </div>
  );
});

export default function UseCallbackDemo() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  // Tracks how many times each button child rendered
  const [stableRenders,   setStableRenders]   = useState(0);
  const [unstableRenders, setUnstableRenders] = useState(0);

  // ✅ useCallback — same function reference across renders
  const stableIncrement = useCallback(() => {
    setCount(c => c + 1);
    setStableRenders(r => r + 1);
  }, []); // no deps → never recreated

  // ❌ No useCallback — new function every render → memo child always re-renders
  const unstableIncrement = () => {
    setCount(c => c + 1);
    setUnstableRenders(r => r + 1);
  };

  return (
    <div className="card">
      <h2 className="card-title">📌 useCallback</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        <code>useCallback</code> returns a stable function reference.
        Both buttons do the same thing, but the <strong>stable</strong> child
        re-renders less because its prop reference never changes.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s3)", marginBottom: "var(--s5)" }}>
        <div>
          <div style={{ fontSize: "var(--xs)", color: "var(--ok)", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "var(--s2)" }}>
            ✅ With useCallback (stable ref)
          </div>
          <Button label="Stable Increment" onClick={stableIncrement} renderCount={stableRenders} />
        </div>

        <div>
          <div style={{ fontSize: "var(--xs)", color: "var(--err)", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "var(--s2)" }}>
            ❌ Without useCallback (new ref every render)
          </div>
          <Button label="Unstable Increment" onClick={unstableIncrement} renderCount={unstableRenders} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--s4)" }}>
        <div style={{ fontSize: "var(--xl)", fontWeight: 800, color: "var(--a2)" }}>
          Count: {count}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setOther(o => o + 1)}>
          Force re-render ({other})
        </button>
      </div>
    </div>
  );
}
