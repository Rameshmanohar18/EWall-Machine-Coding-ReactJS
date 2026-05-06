import { useState } from "react";

// ── Reusable StarRating component ────────────────────────────
function Stars({ value, onChange, readonly = false, size = 28 }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            fontSize: size,
            cursor: readonly ? "default" : "pointer",
            color: star <= display ? "#f59e0b" : "var(--t3)",
            transition: "color .12s ease, transform .12s ease",
            transform: star <= display && !readonly ? "scale(1.15)" : "scale(1)",
            display: "inline-block",
            filter: star <= display ? "drop-shadow(0 0 6px rgba(245,158,11,0.6))" : "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const LABELS = ["", "Terrible", "Poor", "Average", "Good", "Excellent"];
const labelColors = ["", "var(--err)", "var(--warn)", "var(--info)", "var(--ok)", "var(--a2)"];

const products = [
  { id: 1, name: "MacBook Pro",   rating: 0 },
  { id: 2, name: "iPhone 15",     rating: 0 },
  { id: 3, name: "AirPods Pro",   rating: 0 },
];

export default function StarRating() {
  const [ratings, setRatings] = useState(
    Object.fromEntries(products.map(p => [p.id, 0]))
  );

  const setRating = (id, val) => setRatings(r => ({ ...r, [id]: val }));

  const avg = Object.values(ratings).filter(Boolean);
  const avgScore = avg.length ? (avg.reduce((a, b) => a + b, 0) / avg.length).toFixed(1) : "—";

  return (
    <div className="card">
      <h2 className="card-title">⭐ Star Rating</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        Controlled rating with hover state, glow effect, and label feedback.
        Classic UI machine coding question.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s4)", marginBottom: "var(--s6)" }}>
        {products.map(p => (
          <div key={p.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--glass2)", border: "1px solid var(--gb)",
            borderRadius: "var(--r2)", padding: "var(--s4) var(--s5)", flexWrap: "wrap", gap: "var(--s3)"
          }}>
            <span style={{ fontWeight: 600, color: "var(--t1)", minWidth: 120 }}>{p.name}</span>
            <Stars value={ratings[p.id]} onChange={val => setRating(p.id, val)} />
            <span style={{
              minWidth: 80, fontWeight: 700, fontSize: "var(--sm)",
              color: labelColors[ratings[p.id]] || "var(--t3)"
            }}>
              {LABELS[ratings[p.id]] || "Not rated"}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{
        display: "flex", alignItems: "center", gap: "var(--s5)",
        background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.25)",
        borderRadius: "var(--r2)", padding: "var(--s4) var(--s5)"
      }}>
        <div>
          <div className="label">Average Rating</div>
          <div style={{ fontSize: "var(--2xl)", fontWeight: 800, color: "#f59e0b" }}>
            {avgScore} <span style={{ fontSize: "var(--lg)" }}>★</span>
          </div>
        </div>
        <Stars value={Math.round(Number(avgScore))} readonly size={22} onChange={() => {}} />
      </div>
    </div>
  );
}
