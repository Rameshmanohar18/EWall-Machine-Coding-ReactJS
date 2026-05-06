import { useState, useEffect } from "react";

export default function GoogleDocs() {
  const [text, setText] = useState(localStorage.getItem("doc") || "");
  const [status, setStatus] = useState("Saved ✅");

  useEffect(() => {
    setStatus("Saving...");
    const timer = setTimeout(() => {
      localStorage.setItem("doc", text);
      setStatus("Saved ✅");
    }, 1000);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="card">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"var(--s5)" }}>
        <h2 style={{ margin:0 }}>📝 Google Docs Clone</h2>
        <span style={{
          fontSize:"var(--sm)", color: status.includes("Saving") ? "var(--warn)" : "var(--ok)",
          fontWeight:600
        }}>{status}</span>
      </div>
      <textarea
        className="textarea"
        style={{ minHeight:180, fontFamily:"var(--font)", fontSize:"var(--base)", lineHeight:1.7 }}
        placeholder="Start typing... auto-saves after 1 second"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
