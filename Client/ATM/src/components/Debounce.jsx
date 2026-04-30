

import { useEffect, useState } from "react";

export default function DebounceSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      if (!query) return;

      setLoading(true);

      fetch(`https://jsonplaceholder.typicode.com/users`, {
        signal: controller.signal
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(
            data.filter((u) =>
              u.name.toLowerCase().includes(query.toLowerCase())
            )
          );
          setLoading(false);
        });
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div>
      <h1>Debounce Search</h1>
      <input
        placeholder="Search user..."
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {users.map((u) => (
        <p key={u.id}>{u.name}</p>
      ))}
    </div>
  );
}