import { useState, useEffect } from "react";

export default function AutoSave() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Saved");

  useEffect(() => {
    setStatus("Saving...");
    const timer = setTimeout(() => {
      localStorage.setItem("doc", text);
      setStatus("Saved ✅");
    }, 1000);

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <>
    <h1>GoogleDocs Here</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p>{status}</p>
    </>
  );
}