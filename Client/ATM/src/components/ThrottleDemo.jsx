import { useState, useRef, useCallback } from "react";

// ── useThrottle hook ─────────────────────────────────────────
function useThrottle(fn, delay) {
  const lastCall = useRef(0);
  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      fn(...args);
    }
  }, [fn, delay]);
}

export default function ThrottleDemo() {
  const [rawCount,      setRawCount]      = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);
  const [lastFired,     setLastFired]     = useState("—");
  const [events,        setEvents]        = useState([]);

  const addEvent = (type, color) => {
    const time = new Date().toLocaleTimeString("en", { hour12: false });
    setEvents(prev => [`[${time}] ${type}`, ...prev].slice(0, 8));
  };

  const throttledHandler = useThrottle(() => {
    setThrottledCount(c => c + 1);
    setLastFired(new Date().toLocaleTimeString("en", { hour12: false }));
    addEvent("✅ Throttled fired", "var(--ok)");
  }, 1000);

  const handleMouseMove = (e) => {
    setRawCount(c => c + 1);
    throttledHandler();
  };

  const reset = () => {
    setRawCount(0); setThrottledCount(0);
    setLastFired("—"); setEvents([]);
  };

  return (
    <div className="card">
      <h2 className="card-title">🚦 Throttle</h2>
      <p style={{ marginBottom: "var(--s4)" }}>
        <strong>Throttle</strong> limits a function to fire at most once per interval —
        unlike debounce which waits for silence. Move your mouse over the box below.
      </p>

      {/* Mouse move zone */}
      <div
        onMouseMove={handleMouseMove}
        style={{
          height: 120, borderRadius: "var(--r2)",
          border: "2px dashed var(--gb2)",
          background: "var(--glass2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "crosshair", marginBottom: "var(--s5)",
          userSelect: "none", fontSize: "var(--sm)", color: "var(--t2)"
        }}
      >
        🖱 Move mouse here
      </div>

      <div style={{ display: "flex", gap: "var(--s4)", marginBottom: "var(--s5)", flexWrap: "wrap" }}>
        {[
          { label: "Raw Events",       value: rawCount,       color: "var(--err)" },
          { label: "Throttled Fires",  value: throttledCount, color: "var(--ok)"  },
          { label: "Last Fired",       value: lastFired,      color: "var(--a2)"  },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            flex: 1, minWidth: 120,
            background: "var(--glass2)", border: "1px solid var(--gb)",
            borderRadius: "var(--r2)", padding: "var(--s3) var(--s4)"
          }}>
            <div className="label">{label}</div>
            <div style={{ fontSize: "var(--lg)", fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {events.length > 0 && (
        <div style={{
          background: "var(--glass)", border: "1px solid var(--gb)",
          borderRadius: "var(--r2)", padding: "var(--s4)",
          fontFamily: "var(--mono)", fontSize: "var(--xs)",
          display: "flex", flexDirection: "column", gap: 4,
          marginBottom: "var(--s4)"
        }}>
          {events.map((e, i) => (
            <div key={i} style={{ color: i === 0 ? "var(--ok)" : "var(--t3)" }}>{e}</div>
          ))}
        </div>
      )}

      <button className="btn btn-ghost btn-sm" onClick={reset}>↺ Reset</button>
    </div>
  );
}
