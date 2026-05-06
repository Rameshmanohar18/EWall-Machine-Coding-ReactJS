import { useState, useRef, useEffect } from "react";

export default function UseRefDemo() {
  const [value, setValue] = useState("");
  const inputRef    = useRef(null);   // DOM ref
  const renderCount = useRef(0);      // persists across renders WITHOUT causing re-render
  const prevValue   = useRef("");     // track previous state value

  // Increment render count on every render (no re-render triggered)
  useEffect(() => { renderCount.current += 1; });

  // Track previous value
  useEffect(() => { prevValue.current = value; }, [value]);

  return (
    <div className="card">
      <h2 className="card-title">📎 useRef</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        <code>useRef</code> has two uses: accessing DOM nodes directly,
        and persisting mutable values across renders without triggering a re-render.
      </p>

      <div className="form-row">
        <label className="label">Type something</label>
        <input
          ref={inputRef}
          className="input"
          placeholder="Type here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: "var(--s3)", marginBottom: "var(--s5)", flexWrap: "wrap" }}>
        <button className="btn btn-primary btn-sm" onClick={() => inputRef.current.focus()}>
          Focus Input (DOM ref)
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => inputRef.current.select()}>
          Select All
        </button>
      </div>

      <div style={{ display: "flex", gap: "var(--s4)", flexWrap: "wrap" }}>
        {[
          { label: "Current Value",  value: value || "—",           color: "var(--a2)" },
          { label: "Previous Value", value: prevValue.current || "—", color: "var(--warn)" },
          { label: "Render Count",   value: renderCount.current,    color: "var(--ok)" },
        ].map(({ label, value: v, color }) => (
          <div key={label} style={{
            background: "var(--glass2)", border: "1px solid var(--gb)",
            borderRadius: "var(--r2)", padding: "var(--s4)", flex: 1, minWidth: 140
          }}>
            <div className="label">{label}</div>
            <div style={{ fontSize: "var(--lg)", fontWeight: 700, color }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
