import { useState, useEffect } from "react";

const routes = [
  { path: "/",       label: "🏠 Home",  content: "Welcome to the Home page!" },
  { path: "/about",  label: "👤 About", content: "This is the About page." },
  { path: "/contact",label: "📬 Contact",content: "Reach us at hello@example.com" },
];

export default function MiniReactRouter() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    window.onpopstate = () => setPath(window.location.pathname);
  }, []);

  const navigate = (p) => {
    window.history.pushState({}, "", p);
    setPath(p);
  };

  const current = routes.find(r => r.path === path) || routes[0];

  return (
    <div className="card">
      <h2 className="card-title">🧭 Mini React Router</h2>

      <div style={{ display:"flex", gap:"var(--s2)", marginBottom:"var(--s6)", flexWrap:"wrap" }}>
        {routes.map(r => (
          <button
            key={r.path}
            className={`btn ${path === r.path ? "btn-primary" : "btn-ghost"}`}
            onClick={() => navigate(r.path)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div style={{
        background:"var(--glass2)", border:"1px solid var(--gb)",
        borderRadius:"var(--r2)", padding:"var(--s5)"
      }}>
        <p style={{ color:"var(--t1)", fontSize:"var(--lg)", fontWeight:600 }}>{current.content}</p>
      </div>
    </div>
  );
}
