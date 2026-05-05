import { useEffect, useState } from "react";

export default function PaginationTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then(res => res.json())
      .then(json => setData(json.products)); // ✅ extract the array
  }, []);

  const totalPages = Math.ceil(data.length / size);
  const start = (page - 1) * size;
  const current = data.slice(start, start + size);

  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(1); // ✅ reset to page 1 when page size changes
  };

  return (
    <div>
      <h1>Pagination</h1>

      <select onChange={handleSizeChange} value={size}>
        {[5, 10, 15, 20, 25, 30, 35, 40].map(n => (
          <option key={n} value={n}>{n} per page</option>
        ))}
      </select>

      {current.map((item) => (
        <p key={item.id}>{item.title}</p>
      ))}

      <div>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Prev
        </button>
        <span> Page {page} of {totalPages} </span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
          {/* ✅ disable Next on last page */}
          Next
        </button>
      </div>
    </div>
  );
}