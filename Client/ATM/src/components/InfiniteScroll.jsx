import { useEffect, useState, useRef } from "react";

export default function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/photos?_limit=8&_page=${page}`)
      .then(res => res.json())
      .then(data => {
        setItems(prev => [...prev, ...data]);
        setLoading(false);
      });
  }, [page]);

  // IntersectionObserver — load more when loader div is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setPage(p => p + 1); },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="card">
      <h2 className="card-title">♾ Infinite Scroll</h2>

      <div style={{ display:"flex", flexDirection:"column", gap:"var(--s2)" }}>
        {items.map(item => (
          <div key={item.id} className="scroll-item" style={{ margin:0 }}>
            <span style={{ color:"var(--t3)", fontSize:"var(--xs)", marginRight:"var(--s3)" }}>#{item.id}</span>
            {item.title}
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="loading-more">
        {loading && <><span className="spinner" /> Loading more...</>}
      </div>
    </div>
  );
}
