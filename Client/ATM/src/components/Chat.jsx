import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const bottomRef = useRef(null);

  const send = () => {
    if (!msg.trim()) return;
    const newMsg = { text: msg, status: "sending" };
    setMessages(prev => [...prev, newMsg]);
    setTimeout(() => {
      setMessages(prev =>
        prev.map((m, i) => i === prev.length - 1 ? { ...m, status: "sent" } : m)
      );
    }, 1000);
    setMsg("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="card">
      <h2 className="card-title">💬 Chat</h2>

      <div className="chat-window" style={{ marginBottom:"var(--s4)" }}>
        {messages.length === 0 && (
          <div style={{ textAlign:"center", color:"var(--t3)", margin:"auto", fontSize:"var(--sm)" }}>
            No messages yet. Say hi! 👋
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.status === "sent" ? "msg-out" : "msg-out"}`}
            style={{ opacity: m.status === "sending" ? 0.6 : 1 }}>
            {m.text}
            <div className="msg-status">{m.status === "sending" ? "⏳ sending..." : "✓ sent"}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display:"flex", gap:"var(--s3)" }}>
        <input className="input" value={msg} placeholder="Type a message..."
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()} />
        <button className="btn btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  );
}
