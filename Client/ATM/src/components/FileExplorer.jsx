import { useState } from "react";

const tree = {
  name: "src",
  children: [
    { name: "App.jsx" },
    { name: "components", children: [
      { name: "Login.jsx" },
      { name: "ATM.jsx" },
    ]},
    { name: "index.css" },
  ],
};

function Node({ node, depth = 0 }) {
  const [open, setOpen] = useState(false);
  const isFolder = !!node.children;

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <div
        className={`file-node ${isFolder ? "is-folder" : ""}`}
        onClick={() => isFolder && setOpen(!open)}
      >
        <span>{isFolder ? (open ? "📂" : "📁") : "📄"}</span>
        {node.name}
        {isFolder && (
          <span style={{ marginLeft:"auto", fontSize:"var(--xs)", color:"var(--t3)" }}>
            {open ? "▲" : "▼"}
          </span>
        )}
      </div>
      {open && node.children?.map((c, i) => (
        <Node key={i} node={c} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function FileExplorer() {
  return (
    <div className="card">
      <h2 className="card-title">🗂 File Explorer</h2>
      <div className="file-tree">
        <Node node={tree} />
      </div>
    </div>
  );
}
