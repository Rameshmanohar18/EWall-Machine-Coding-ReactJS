import { useState, useRef, useCallback } from "react";

const ITEM_HEIGHT = 48;
const VISIBLE_COUNT = 10;
const TOTAL_ITEMS = 10000;

// Generate 10k items once
const ALL_ITEMS = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: i + 1,
  text: `Item #${i + 1} — row data ${Math.random().toFixed(4)}`,
}));

export default function VirtualList() {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const totalHeight = TOTAL_ITEMS * ITEM_HEIGHT;

  // Which items are currently in the viewport
  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  const endIndex   = Math.min(TOTAL_ITEMS - 1, startIndex + VISIBLE_COUNT + 2);
  const visibleItems = ALL_ITEMS.slice(startIndex, endIndex + 1);

  const onScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div className="card">
      <h2 className="card-title">⚡ Virtual List (Windowing)</h2>
      <p style={{ marginBottom: "var(--s4)" }}>
        Rendering <strong style={{ color: "var(--a2)" }}>10,000 rows</strong> — only{" "}
        <strong style={{ color: "var(--ok)" }}>{VISIBLE_COUNT} DOM nodes</strong> exist at any time.
        Scroll to see windowing in action.
      </p>

      <div style={{ display: "flex", gap: "var(--s4)", marginBottom: "var(--s4)" }}>
        {[
          { label: "Total Items",   value: TOTAL_ITEMS.toLocaleString(), color: "var(--a2)" },
          { label: "DOM Nodes",     value: VISIBLE_COUNT,                color: "var(--ok)" },
          { label: "Current Index", value: startIndex + 1,               color: "var(--warn)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            flex: 1, background: "var(--glass2)", border: "1px solid var(--gb)",
            borderRadius: "var(--r2)", padding: "var(--s3) var(--s4)"
          }}>
            <div className="label">{label}</div>
            <div style={{ fontSize: "var(--lg)", fontWeight: 800, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Scrollable container — fixed height */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        style={{
          height: ITEM_HEIGHT * VISIBLE_COUNT,
          overflowY: "auto",
          border: "1px solid var(--gb)",
          borderRadius: "var(--r2)",
          position: "relative",
        }}
      >
        {/* Full-height spacer so scrollbar is correct */}
        <div style={{ height: totalHeight, position: "relative" }}>
          {visibleItems.map((item) => (
            <div
              key={item.id}
              style={{
                position: "absolute",
                top: (item.id - 1) * ITEM_HEIGHT,
                left: 0, right: 0,
                height: ITEM_HEIGHT,
                display: "flex", alignItems: "center",
                padding: "0 var(--s4)",
                borderBottom: "1px solid var(--gb)",
                background: item.id % 2 === 0 ? "var(--glass)" : "transparent",
                fontSize: "var(--sm)", color: "var(--t1)",
              }}
            >
              <span style={{ color: "var(--t3)", width: 60, fontFamily: "var(--mono)", fontSize: "var(--xs)" }}>
                #{item.id}
              </span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
