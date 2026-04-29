import  { useEffect, useState } from "react";

export default function PaginationTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(setData);
  }, []);

  const start = (page - 1) * size;
  const current = data.slice(start, start + size);

  return (
    <div>
      <select onChange={(e) => setSize(Number(e.target.value))}>
        <option>5</option>
        <option>10</option>
      </select>

      {current.map((item) => (
        <p key={item.id}>{item.title}</p>
      ))}

      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
        Prev
      </button>
      <button onClick={() => setPage(p => p + 1)}>
        Next
      </button>
    </div>
  );
}