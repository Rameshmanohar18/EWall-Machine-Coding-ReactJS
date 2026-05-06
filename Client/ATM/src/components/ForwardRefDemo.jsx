import { forwardRef, useImperativeHandle, useRef, useState } from "react";

// ── Custom Input with forwardRef + useImperativeHandle ───────
const FancyInput = forwardRef(function FancyInput({ label, placeholder }, ref) {
  const inputRef = useRef(null);

  // Expose custom methods to parent via ref
  useImperativeHandle(ref, () => ({
    focus:     () => inputRef.current.focus(),
    clear:     () => { inputRef.current.value = ""; inputRef.current.focus(); },
    highlight: () => inputRef.current.select(),
    getValue:  () => inputRef.current.value,
  }));

  return (
    <div className="form-row" style={{ marginBottom: 0 }}>
      {label && <label className="label">{label}</label>}
      <input ref={inputRef} className="input" placeholder={placeholder} />
    </div>
  );
});

// ── Parent controls the child input via ref ──────────────────
export default function ForwardRefDemo() {
  const inputRef = useRef(null);
  const [log, setLog] = useState([]);

  const addLog = (msg) => setLog(prev => [`→ ${msg}`, ...prev].slice(0, 5));

  const handleFocus = () => {
    inputRef.current.focus();
    addLog("focus() called on child input");
  };

  const handleClear = () => {
    inputRef.current.clear();
    addLog("clear() called — input cleared");
  };

  const handleHighlight = () => {
    inputRef.current.highlight();
    addLog("highlight() called — text selected");
  };

  const handleRead = () => {
    const val = inputRef.current.getValue();
    addLog(`getValue() → "${val}"`);
  };

  return (
    <div className="card">
      <h2 className="card-title">🔗 forwardRef + useImperativeHandle</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        <code>forwardRef</code> lets a parent pass a ref into a child component.
        <code>useImperativeHandle</code> customises what the parent can do with that ref —
        exposing only specific methods instead of the raw DOM node.
      </p>

      <div style={{ marginBottom: "var(--s5)" }}>
        <FancyInput ref={inputRef} label="Controlled by parent ref" placeholder="Type something..." />
      </div>

      <div style={{ display: "flex", gap: "var(--s2)", flexWrap: "wrap", marginBottom: "var(--s5)" }}>
        <button className="btn btn-primary  btn-sm" onClick={handleFocus}>Focus</button>
        <button className="btn btn-danger   btn-sm" onClick={handleClear}>Clear</button>
        <button className="btn btn-info     btn-sm" onClick={handleHighlight}>Highlight</button>
        <button className="btn btn-ghost    btn-sm" onClick={handleRead}>Read Value</button>
      </div>

      {log.length > 0 && (
        <div style={{
          background: "var(--glass2)", border: "1px solid var(--gb)",
          borderRadius: "var(--r2)", padding: "var(--s4)",
          fontFamily: "var(--mono)", fontSize: "var(--xs)"
        }}>
          {log.map((entry, i) => (
            <div key={i} style={{ color: i === 0 ? "var(--a2)" : "var(--t3)", padding: "2px 0" }}>
              {entry}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
