import { useState, useMemo } from "react";

// Simulates a slow/expensive computation
function slowFactorial(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) result *= i;
  return result;
}

export default function UseMemoDemo() {
  const [num, setNum] = useState(10);
  const [count, setCount] = useState(0);

  // ✅ useMemo — only recomputes when `num` changes, not on every render
  const factorial = useMemo(() => {
    return slowFactorial(num);
  }, [num]);

  return (
    <div className="card">
      <h2 className="card-title">🧠 useMemo</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        <code>useMemo</code> caches the result of an expensive function.
        The factorial only recomputes when <strong>num</strong> changes —
        not when the unrelated counter updates.
      </p>

      <div style={{ display: "flex", gap: "var(--s8)", flexWrap: "wrap", marginBottom: "var(--s6)" }}>
        <div className="form-row" style={{ flex: 1, minWidth: 180 }}>
          <label className="label">Number (0–15)</label>
          <input
            className="input"
            type="number"
            min={0} max={15}
            value={num}
            onChange={(e) => setNum(Number(e.target.value))}
          />
        </div>

        <div style={{
          background: "var(--glass2)", border: "1px solid var(--gb)",
          borderRadius: "var(--r2)", padding: "var(--s4)", flex: 1, minWidth: 180
        }}>
          <div className="label">Factorial Result (memoized)</div>
          <div style={{ fontSize: "var(--xl)", fontWeight: 800, color: "var(--a2)" }}>
            {num}! = {factorial}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--s4)" }}>
        <button className="btn btn-ghost" onClick={() => setCount(c => c + 1)}>
          Unrelated Counter: {count}
        </button>
        <span style={{ fontSize: "var(--sm)", color: "var(--t3)" }}>
          ← clicking this re-renders but does NOT recompute factorial
        </span>
      </div>
    </div>
  );
}
