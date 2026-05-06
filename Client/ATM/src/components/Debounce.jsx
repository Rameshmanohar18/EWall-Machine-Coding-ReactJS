import { useEffect, useState } from "react";

export default function DebounceSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      if (!query) { setUsers([]); return; }
      setLoading(true);
      fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal })
        .then(r => r.json())
        .then(data => {
          setUsers(data.filter(u => u.name.toLowerCase().includes(query.toLowerCase())));
          setLoading(false);
        })
        .catch(() => {});
    }, 500);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  return (
    <div className="card">
      <h2 className="card-title">🔍 Debounce Search</h2>

      <div className="form-row">
        <input className="input" placeholder="Search users..." onChange={(e) => setQuery(e.target.value)} />
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--s2)", color: "var(--t2)", padding: "var(--s3) 0" }}>
          <span className="spinner" /> Searching...
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s1)" }}>
        {users.map(u => (
          <div key={u.id} className="result-item">{u.name}</div>
        ))}
      </div>
    </div>
  );
}