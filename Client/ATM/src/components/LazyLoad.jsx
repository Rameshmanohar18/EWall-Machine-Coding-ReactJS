import { lazy, Suspense, useState } from "react";

// ── Lazy-loaded component (simulates a heavy module) ─────────
// React.lazy takes a function that returns a dynamic import()
const HeavyChart = lazy(() =>
  // Simulate network delay so you can see the Suspense fallback
  new Promise(resolve =>
    setTimeout(() =>
      resolve({
        default: function HeavyChart() {
          const bars = [65, 40, 80, 55, 90, 35, 70, 50, 85, 45];
          return (
            <div>
              <div style={{ fontSize: "var(--sm)", color: "var(--t2)", marginBottom: "var(--s4)" }}>
                ✅ HeavyChart loaded! (was lazy-loaded on demand)
              </div>
              {/* Mini bar chart */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
                {bars.map((h, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: `${h}%`,
                    background: `linear-gradient(180deg, var(--a2), var(--a))`,
                    borderRadius: "4px 4px 0 0",
                    opacity: 0.7 + i * 0.03,
                    transition: "height .3s ease"
                  }} />
                ))}
              </div>
            </div>
          );
        }
      }),
    1500)  // 1.5s artificial delay
  )
);

// ── Suspense fallback ────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${30 + Math.random() * 40}%`,
          background: "var(--glass2)",
          borderRadius: "4px 4px 0 0",
          animation: "pulse 1.4s ease infinite",
          animationDelay: `${i * 0.1}s`
        }} />
      ))}
    </div>
  );
}

export default function LazyLoad() {
  const [show, setShow] = useState(false);

  return (
    <div className="card">
      <h2 className="card-title">⚡ React.lazy + Suspense</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        <code>React.lazy</code> lets you code-split components so they only load
        when needed. <code>Suspense</code> shows a fallback while the lazy component loads.
        Click the button to trigger the lazy load (1.5s delay simulated).
      </p>

      <button
        className="btn btn-primary"
        style={{ marginBottom: "var(--s5)" }}
        onClick={() => setShow(true)}
        disabled={show}
      >
        {show ? "Chart Loaded ✅" : "Load Heavy Chart"}
      </button>

      {show && (
        <div style={{
          background: "var(--glass2)", border: "1px solid var(--gb)",
          borderRadius: "var(--r2)", padding: "var(--s5)"
        }}>
          <Suspense fallback={
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s2)",
                color: "var(--t2)", fontSize: "var(--sm)", marginBottom: "var(--s4)" }}>
                <span className="spinner" /> Loading HeavyChart...
              </div>
              <ChartSkeleton />
            </div>
          }>
            <HeavyChart />
          </Suspense>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: .4; }
          50%       { opacity: .8; }
        }
      `}</style>
    </div>
  );
}
