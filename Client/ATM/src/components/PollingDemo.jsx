import { useState, useEffect, useRef, useCallback } from "react";

// ── usePolling hook ──────────────────────────────────────────
function usePolling(fn, interval, enabled = true) {
  const savedFn = useRef(fn);
  useEffect(() => { savedFn.current = fn; }, [fn]);

  useEffect(() => {
    if (!enabled) return;
    savedFn.current(); // fire immediately
    const id = setInterval(() => savedFn.current(), interval);
    return () => clearInterval(id);
  }, [interval, enabled]);
}

// Simulate a live price feed
function fetchPrices() {
  return {
    BTC:  (40000 + Math.random() * 5000).toFixed(2),
    ETH:  (2200  + Math.random() * 400).toFixed(2),
    SOL:  (90    + Math.random() * 30).toFixed(2),
    DOGE: (0.08  + Math.random() * 0.04).toFixed(4),
  };
}

export default function PollingDemo() {
  const [prices,    setPrices]    = useState(fetchPrices());
  const [prevPrices, setPrevPrices] = useState({});
  const [enabled,   setEnabled]   = useState(true);
  const [ticks,     setTicks]     = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const poll = useCallback(() => {
    setPrevPrices(prev => ({ ...prev, ...prices }));
    const next = fetchPrices();
    setPrices(next);
    setTicks(t => t + 1);
    setLastUpdate(new Date().toLocaleTimeString());
  }, [prices]);

  usePolling(poll, 2000, enabled);

  const getArrow = (coin) => {
    if (!prevPrices[coin]) return null;
    const diff = Number(prices[coin]) - Number(prevPrices[coin]);
    if (diff > 0) return { arrow: "▲", color: "var(--ok)" };
    if (diff < 0) return { arrow: "▼", color: "var(--err)" };
    return { arrow: "—", color: "var(--t3)" };
  };

  return (
    <div className="card">
      <h2 className="card-title">📡 Polling Hook</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        <code>usePolling</code> fires a function on a fixed interval using <code>setInterval</code>
        with proper cleanup. Simulates a live crypto price feed updating every 2 seconds.
      </p>

      <div style={{ display: "flex", gap: "var(--s3)", marginBottom: "var(--s5)", alignItems: "center", flexWrap: "wrap" }}>
        <button
          className={`btn btn-sm ${enabled ? "btn-danger" : "btn-success"}`}
          onClick={() => setEnabled(e => !e)}
        >
          {enabled ? "⏸ Pause" : "▶ Resume"}
        </button>
        <span style={{ fontSize: "var(--xs)", color: "var(--t3)" }}>
          {enabled
            ? <><span className="spinner" style={{ width:10, height:10, borderWidth:1.5 }} /> Polling every 2s</>
            : "⏸ Paused"
          }
        </span>
        <span style={{ marginLeft: "auto", fontSize: "var(--xs)", color: "var(--t2)" }}>
          {ticks} updates · last: {lastUpdate}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--s3)" }}>
        {Object.entries(prices).map(([coin, price]) => {
          const trend = getArrow(coin);
          return (
            <div key={coin} style={{
              background: "var(--glass2)", border: "1px solid var(--gb)",
              borderRadius: "var(--r2)", padding: "var(--s4)",
              transition: "border-color .3s"
            }}>
              <div style={{ fontSize: "var(--xs)", fontWeight: 800, color: "var(--t3)",
                textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "var(--s1)" }}>
                {coin}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "var(--s2)" }}>
                <span style={{ fontSize: "var(--lg)", fontWeight: 800, color: "var(--t1)" }}>
                  ${price}
                </span>
                {trend && (
                  <span style={{ fontSize: "var(--sm)", fontWeight: 700, color: trend.color }}>
                    {trend.arrow}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
