import { useEffect, useState } from "react";

export default function PaginationTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then(res => res.json())
      .then(json => setData(json.products));
  }, []);

  const totalPages = Math.ceil(data.length / size);
  const current = data.slice((page - 1) * size, page * size);

  const handleSizeChange = (e) => { setSize(Number(e.target.value)); setPage(1); };

  return (
    <div className="card">
      <h2 className="card-title">📄 Pagination</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--s3)", marginBottom: "var(--s5)" }}>
        <label className="label" style={{ margin: 0 }}>Per page:</label>
        <select className="select" style={{ width: "auto" }} onChange={handleSizeChange} value={size}>
          {[5, 10, 15, 20, 25, 30].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s2)", marginBottom: "var(--s5)" }}>
        {current.map((item) => (
          <div key={item.id} className="scroll-item" style={{ margin: 0 }}>{item.title}</div>
        ))}
      </div>

      <div className="pg-wrap">
        <button className="pg-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
        <span className="pg-info">Page {page} of {totalPages}</span>
        <button className="pg-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next →</button>
      </div>
    </div>
  );
}