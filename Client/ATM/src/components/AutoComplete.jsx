import { useState, useEffect } from "react";

export default function AutoComplete() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!q) { setResults([]); return; }
      setLoading(true);
      fetch("https://jsonplaceholder.typicode.com/users")
        .then(r => r.json())
        .then(data => {
          setResults(data.filter(u => u.name.toLowerCase().includes(q.toLowerCase())));
          setLoading(false);
        });
    }, 500);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="card">
      <h2 className="card-title">🔎 AutoComplete</h2>

      <div className="form-row">
        <input className="input" placeholder="Type a name..." onChange={e => setQ(e.target.value)} />
      </div>

      {loading && (
        <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)", color:"var(--t2)", padding:"var(--s2) 0" }}>
          <span className="spinner" /> Searching...
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:"var(--s1)" }}>
        {results.map(r => (
          <div key={r.id} className="result-item">{r.name}</div>
        ))}
      </div>
    </div>
  );
}
