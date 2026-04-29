
import  { useEffect, useState } from "react";

export default function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`
    )
      .then(res => res.json())
      .then(data => setItems(prev => [...prev, ...data]));
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        setPage(p => p + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {items.map(i => (
        <p key={i.id}>{i.title}</p>
      ))}
      <p>Loading more...</p>
    </div>
  );
}