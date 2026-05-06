import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

// ── Toast Context ────────────────────────────────────────────
const ToastCtx = createContext(null);

const ICONS = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
const COLORS = {
  success: { bg: "var(--ok-bg)",   border: "rgba(16,185,129,.35)",  text: "var(--ok)"  },
  error:   { bg: "var(--err-bg)",  border: "rgba(239,68,68,.35)",   text: "var(--err)" },
  warning: { bg: "var(--warn-bg)", border: "rgba(245,158,11,.35)",  text: "var(--warn)"},
  info:    { bg: "var(--info-bg)", border: "rgba(34,211,238,.35)",  text: "var(--info)"},
};

// ── Individual Toast ─────────────────────────────────────────
function Toast({ id, message, type, onRemove }) {
  const [visible, setVisible] = useState(false);
  const c = COLORS[type];

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after 3s
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, 3000);
    return () => clearTimeout(t);
  }, [id, onRemove]);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "var(--s3)",
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: "var(--r2)", padding: "12px 16px",
      backdropFilter: "blur(16px)",
      boxShadow: "0 8px 28px rgba(0,0,0,.5)",
      minWidth: 280, maxWidth: 360,
      transform: visible ? "translateX(0)" : "translateX(120%)",
      opacity: visible ? 1 : 0,
      transition: "transform .3s ease, opacity .3s ease",
    }}>
      <span style={{ fontSize: 18 }}>{ICONS[type]}</span>
      <span style={{ flex: 1, color: "var(--t1)", fontSize: "var(--sm)", fontWeight: 500 }}>
        {message}
      </span>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(id), 300); }}
        style={{ background: "none", border: "none", color: c.text, cursor: "pointer",
          fontSize: 16, lineHeight: 1, padding: 2 }}
      >
        ✕
      </button>
    </div>
  );
}

// ── Toast Container (portal) ─────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  return createPortal(
    <div style={{
      position: "fixed", top: 20, right: 20,
      display: "flex", flexDirection: "column", gap: "var(--s2)",
      zIndex: 9999, pointerEvents: "none"
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: "all" }}>
          <Toast {...t} onRemove={onRemove} />
        </div>
      ))}
    </div>,
    document.body
  );
}

// ── Provider ─────────────────────────────────────────────────
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastCtx.Provider value={addToast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastCtx.Provider>
  );
}

const useToast = () => useContext(ToastCtx);

// ── Demo ─────────────────────────────────────────────────────
function ToastButtons() {
  const toast = useToast();

  const actions = [
    { label: "✅ Success", type: "success", msg: "Operation completed successfully!" },
    { label: "❌ Error",   type: "error",   msg: "Something went wrong. Please retry." },
    { label: "⚠️ Warning", type: "warning", msg: "This action cannot be undone." },
    { label: "ℹ️ Info",    type: "info",    msg: "New update available. Refresh to apply." },
  ];

  return (
    <div style={{ display: "flex", gap: "var(--s3)", flexWrap: "wrap" }}>
      {actions.map(a => (
        <button
          key={a.type}
          className={`btn btn-sm btn-${a.type === "success" ? "success" : a.type === "error" ? "danger" : a.type === "warning" ? "warn" : "info"}`}
          onClick={() => toast(a.msg, a.type)}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}

export default function ToastSystem() {
  return (
    <div className="card">
      <h2 className="card-title">🔔 Toast / Notification System</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        Global toast queue using <code>Context</code> + <code>createPortal</code>.
        Toasts auto-dismiss after 3s with slide-in animation.
      </p>
      <ToastProvider>
        <ToastButtons />
      </ToastProvider>
    </div>
  );
}
