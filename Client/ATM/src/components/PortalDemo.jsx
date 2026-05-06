import { useState } from "react";
import { createPortal } from "react-dom";

// ── Portal Modal — renders outside the normal DOM tree ───────
function PortalModal({ onClose }) {
  return createPortal(
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(7,9,26,0.80)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999,
        animation: "fadeIn .2s ease"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "rgba(13,16,37,0.92)",
          backdropFilter: "blur(28px)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: "var(--r4)",
          padding: "var(--s8)",
          width: "100%", maxWidth: 440,
          boxShadow: "0 20px 60px rgba(0,0,0,.65), 0 0 32px rgba(124,58,237,.5)",
          position: "relative", overflow: "hidden",
          animation: "slideUp .25s ease"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* top shimmer */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, var(--a2), transparent)"
        }} />

        <h3 style={{ marginBottom: "var(--s3)" }}>🌀 Portal Modal</h3>
        <p style={{ marginBottom: "var(--s6)" }}>
          This modal is rendered via <code>ReactDOM.createPortal</code> directly into{" "}
          <code>document.body</code> — completely outside the React component tree in the DOM.
          This avoids CSS overflow/z-index issues from parent containers.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--s3)" }}>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onClose}>Got it!</button>
        </div>
      </div>
    </div>,
    document.body   // ← renders here, not inside the component's DOM node
  );
}

export default function PortalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <h2 className="card-title">🌀 ReactDOM.createPortal</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        <code>createPortal(child, container)</code> renders a component into a different
        DOM node than its parent. Commonly used for modals, tooltips, and dropdowns
        to escape parent overflow/z-index constraints.
      </p>

      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        Open Portal Modal
      </button>

      {open && <PortalModal onClose={() => setOpen(false)} />}
    </div>
  );
}
