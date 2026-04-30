import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  const send = () => {
    const newMsg = {
      text: msg,
      status: "sending"
    };

    setMessages([...messages, newMsg]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, status: "sent" }
            : m
        )
      );
    }, 1000);

    setMsg("");
  };

  return (
    <>
      {messages.map((m, i) => (
        <p key={i}>
          {m.text} ({m.status})
        </p>
      ))}
      <input value={msg} onChange={(e)=>setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
    </>
  );
}