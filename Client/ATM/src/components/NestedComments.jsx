import { useState } from "react";

const initialComments = [
  {
    id: 1, author: "Alice", text: "Great post! Really helpful.",
    replies: [
      {
        id: 2, author: "Bob", text: "Totally agree with Alice!",
        replies: [
          { id: 3, author: "Charlie", text: "Same here 👍", replies: [] }
        ]
      }
    ]
  },
  {
    id: 4, author: "Diana", text: "Could you elaborate on point 3?",
    replies: []
  }
];

let nextId = 10;

// ── Recursive add helper ─────────────────────────────────────
function addReply(comments, parentId, newComment) {
  return comments.map(c => {
    if (c.id === parentId) return { ...c, replies: [...c.replies, newComment] };
    return { ...c, replies: addReply(c.replies, parentId, newComment) };
  });
}

// ── Single comment node (recursive) ─────────────────────────
function Comment({ comment, onReply, depth = 0 }) {
  const [open,    setOpen]    = useState(true);
  const [replying, setReplying] = useState(false);
  const [text,    setText]    = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onReply(comment.id, text.trim());
    setText(""); setReplying(false);
  };

  const colors = ["var(--a)", "var(--ok)", "var(--warn)", "var(--info)", "var(--err)"];
  const borderColor = colors[depth % colors.length];

  return (
    <div style={{ marginLeft: depth > 0 ? 20 : 0, marginTop: "var(--s3)" }}>
      <div style={{
        background: "var(--glass2)", border: "1px solid var(--gb)",
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: "var(--r2)", padding: "var(--s3) var(--s4)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s2)" }}>
          <span style={{ fontWeight: 700, color: borderColor, fontSize: "var(--sm)" }}>
            {comment.author}
          </span>
          <div style={{ display: "flex", gap: "var(--s2)" }}>
            {comment.replies.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={() => setOpen(o => !o)}>
                {open ? "▲ Hide" : `▼ ${comment.replies.length} replies`}
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => setReplying(r => !r)}>
              💬 Reply
            </button>
          </div>
        </div>

        <p style={{ color: "var(--t1)", fontSize: "var(--sm)", margin: 0 }}>{comment.text}</p>

        {/* Reply input */}
        {replying && (
          <div style={{ display: "flex", gap: "var(--s2)", marginTop: "var(--s3)" }}>
            <input
              className="input"
              placeholder="Write a reply..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              autoFocus
            />
            <button className="btn btn-primary btn-sm" onClick={submit}>Post</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setReplying(false)}>✕</button>
          </div>
        )}
      </div>

      {/* Recursive replies */}
      {open && comment.replies.map(reply => (
        <Comment key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function NestedComments() {
  const [comments, setComments] = useState(initialComments);
  const [rootText, setRootText] = useState("");

  const handleReply = (parentId, text) => {
    const newComment = { id: nextId++, author: "You", text, replies: [] };
    setComments(prev => addReply(prev, parentId, newComment));
  };

  const addRoot = () => {
    if (!rootText.trim()) return;
    setComments(prev => [...prev, { id: nextId++, author: "You", text: rootText.trim(), replies: [] }]);
    setRootText("");
  };

  return (
    <div className="card">
      <h2 className="card-title">💬 Nested Comments</h2>
      <p style={{ marginBottom: "var(--s4)" }}>
        Recursive tree rendering — each comment can have infinite nested replies.
        Uses a recursive <code>addReply</code> helper to immutably update deep state.
      </p>

      {/* Root comment input */}
      <div style={{ display: "flex", gap: "var(--s3)", marginBottom: "var(--s4)" }}>
        <input className="input" placeholder="Add a top-level comment..."
          value={rootText} onChange={e => setRootText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addRoot()} />
        <button className="btn btn-primary" onClick={addRoot}>Post</button>
      </div>

      {comments.map(c => (
        <Comment key={c.id} comment={c} onReply={handleReply} />
      ))}
    </div>
  );
}
