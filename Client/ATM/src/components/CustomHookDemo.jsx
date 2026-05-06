import { useState, useEffect, useCallback } from "react";

// ── Custom Hook: useFetch ────────────────────────────────────
// Encapsulates fetch logic — loading, data, error, refetch
function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// ── Component using the custom hook ─────────────────────────
export default function CustomHookDemo() {
  const [userId, setUserId] = useState(1);

  const { data: user, loading, error, refetch } = useFetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  return (
    <div className="card">
      <h2 className="card-title">🪝 Custom Hook — useFetch</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        Custom hooks extract reusable stateful logic into a function starting with <code>use</code>.
        Here <code>useFetch</code> handles loading, error, and data for any URL.
      </p>

      <div style={{ display: "flex", gap: "var(--s3)", marginBottom: "var(--s5)", flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5].map(id => (
          <button
            key={id}
            className={`btn btn-sm ${userId === id ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setUserId(id)}
          >
            User {id}
          </button>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={refetch}>↺ Refetch</button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--s2)", color: "var(--t2)" }}>
          <span className="spinner" /> Fetching user {userId}...
        </div>
      )}

      {error && (
        <div style={{ background: "var(--err-bg)", border: "1px solid rgba(239,68,68,.3)",
          borderRadius: "var(--r2)", padding: "var(--s4)", color: "var(--err)" }}>
          Error: {error}
        </div>
      )}

      {user && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s2)" }}>
          {[
            ["Name",    user.name],
            ["Email",   user.email],
            ["Phone",   user.phone],
            ["Company", user.company?.name],
            ["City",    user.address?.city],
          ].map(([label, val]) => (
            <div key={label} style={{
              display: "flex", gap: "var(--s4)",
              padding: "10px 14px", borderRadius: "var(--r2)",
              background: "var(--glass2)", border: "1px solid var(--gb)"
            }}>
              <span style={{ color: "var(--t3)", width: 70, fontSize: "var(--sm)", fontWeight: 600 }}>{label}</span>
              <span style={{ color: "var(--t1)", fontSize: "var(--sm)" }}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
