import { useState, useRef, useCallback, useEffect } from "react";

export default function ResizablePanel() {
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newLeft = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftWidth(Math.min(80, Math.max(20, newLeft)));
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div className="card">
      <h2 className="card-title">↔ Resizable Split Panel</h2>
      <p style={{ marginBottom: "var(--s4)" }}>
        Drag the divider to resize the panels. Uses <code>mousedown/mousemove/mouseup</code> with
        a ref to track drag state without re-renders.
      </p>

      <div
        ref={containerRef}
        style={{
          display: "flex", height: 200,
          border: "1px solid var(--gb)", borderRadius: "var(--r2)",
          overflow: "hidden", position: "relative"
        }}
      >
        {/* Left panel */}
        <div style={{
          width: `${leftWidth}%`, background: "rgba(124,58,237,0.10)",
          padding: "var(--s4)", overflow: "auto", transition: "none"
        }}>
          <div style={{ color: "var(--a2)", fontWeight: 700, marginBottom: "var(--s2)" }}>
            Left Panel
          </div>
          <div style={{ color: "var(--t2)", fontSize: "var(--sm)" }}>
            Width: <strong style={{ color: "var(--a2)" }}>{leftWidth.toFixed(1)}%</strong>
          </div>
          <div style={{ color: "var(--t3)", fontSize: "var(--xs)", marginTop: "var(--s2)" }}>
            Drag the divider →
          </div>
        </div>

        {/* Drag handle */}
        <div
          onMouseDown={onMouseDown}
          style={{
            width: 6, background: "var(--gb2)",
            cursor: "col-resize", flexShrink: 0,
            transition: "background var(--tr)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--a)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--gb2)"}
        >
          <div style={{
            width: 2, height: 40, borderRadius: 2,
            background: "rgba(255,255,255,0.3)"
          }} />
        </div>

        {/* Right panel */}
        <div style={{
          flex: 1, background: "rgba(34,211,238,0.07)",
          padding: "var(--s4)", overflow: "auto"
        }}>
          <div style={{ color: "var(--a3)", fontWeight: 700, marginBottom: "var(--s2)" }}>
            Right Panel
          </div>
          <div style={{ color: "var(--t2)", fontSize: "var(--sm)" }}>
            Width: <strong style={{ color: "var(--a3)" }}>{(100 - leftWidth).toFixed(1)}%</strong>
          </div>
          <div style={{ color: "var(--t3)", fontSize: "var(--xs)", marginTop: "var(--s2)" }}>
            ← Drag the divider
          </div>
        </div>
      </div>
    </div>
  );
}
