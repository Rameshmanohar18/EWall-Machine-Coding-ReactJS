import { useState, useEffect, useRef, useCallback } from "react";

const ALL_USERS = [
  "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince",
  "Edward Norton", "Fiona Green", "George Miller", "Hannah White",
  "Ivan Drago", "Julia Roberts", "Kevin Hart", "Laura Palmer",
  "Michael Scott", "Nancy Drew", "Oscar Wilde", "Priya Sharma",
  "Quincy Jones", "Rachel Green", "Steve Rogers", "Tina Turner",
];

export default function TypeaheadSearch() {
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selected,    setSelected]    = useState(null);
  const [open,        setOpen]        = useState(false);
  const inputRef = useRef(null);

  // Filter on query change
  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const filtered = ALL_USERS.filter(u =>
      u.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setOpen(filtered.length > 0);
    setActiveIndex(-1);
  }, [query]);

  const select = useCallback((name) => {
    setSelected(name);
    setQuery(name);
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      select(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Highlight matching text
  const highlight = (text, query) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{ background: "rgba(124,58,237,0.4)", color: "var(--a2)",
          borderRadius: 2, padding: "0 2px" }}>
          {text.slice(idx, idx + query.length)}
        </mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="card">
      <h2 className="card-title">⌨️ Typeahead with Keyboard Nav</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        Full keyboard navigation — <kbd style={{ background:"var(--glass2)", border:"1px solid var(--gb)",
          borderRadius:4, padding:"1px 6px", fontSize:"var(--xs)" }}>↑↓</kbd> to navigate,{" "}
        <kbd style={{ background:"var(--glass2)", border:"1px solid var(--gb)",
          borderRadius:4, padding:"1px 6px", fontSize:"var(--xs)" }}>Enter</kbd> to select,{" "}
        <kbd style={{ background:"var(--glass2)", border:"1px solid var(--gb)",
          borderRadius:4, padding:"1px 6px", fontSize:"var(--xs)" }}>Esc</kbd> to close.
        Matching text is highlighted.
      </p>

      <div style={{ position: "relative", maxWidth: 400 }}>
        <input
          ref={inputRef}
          className="input"
          placeholder="Search users..."
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(null); }}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          autoComplete="off"
        />

        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: "rgba(13,16,37,0.95)", backdropFilter: "blur(18px)",
            border: "1px solid var(--gb2)", borderRadius: "var(--r2)",
            boxShadow: "0 12px 40px rgba(0,0,0,.6)",
            zIndex: 100, overflow: "hidden",
            animation: "slideUp .15s ease"
          }}>
            {results.map((name, i) => (
              <div
                key={name}
                onMouseDown={() => select(name)}
                style={{
                  padding: "10px 14px", cursor: "pointer",
                  fontSize: "var(--sm)", color: "var(--t1)",
                  background: i === activeIndex ? "var(--abg)" : "transparent",
                  borderLeft: i === activeIndex ? "3px solid var(--a)" : "3px solid transparent",
                  transition: "background var(--tr)",
                  display: "flex", alignItems: "center", gap: "var(--s2)"
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span style={{ color: "var(--t3)", fontSize: "var(--xs)" }}>👤</span>
                {highlight(name, query)}
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div style={{
          marginTop: "var(--s4)", display: "flex", alignItems: "center", gap: "var(--s3)",
          background: "var(--ok-bg)", border: "1px solid rgba(16,185,129,.3)",
          borderRadius: "var(--r2)", padding: "var(--s3) var(--s4)"
        }}>
          <span style={{ color: "var(--ok)", fontWeight: 700 }}>✅ Selected:</span>
          <span style={{ color: "var(--t1)" }}>{selected}</span>
        </div>
      )}
    </div>
  );
}
