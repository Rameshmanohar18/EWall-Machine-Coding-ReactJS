import { useState } from "react";

export default function UndoRedo() {
  const [history, setHistory] = useState({ past: [], present: "", future: [] });

  const update = (val) => setHistory({
    past: [...history.past, history.present],
    present: val,
    future: [],
  });

  const undo = () => {
    if (!history.past.length) return;
    const prev = history.past.at(-1);
    setHistory({
      past: history.past.slice(0, -1),
      present: prev,
      future: [history.present, ...history.future],
    });
  };

  const redo = () => {
    if (!history.future.length) return;
    const next = history.future[0];
    setHistory({
      past: [...history.past, history.present],
      present: next,
      future: history.future.slice(1),
    });
  };

  return (
    <div className="card">
      <h2 className="card-title">↩ Undo / Redo</h2>

      <div className="form-row">
        <label className="label">Type something</label>
        <input className="input" value={history.present}
          placeholder="Start typing..."
          onChange={e => update(e.target.value)} />
      </div>

      <div style={{ display:"flex", gap:"var(--s3)" }}>
        <button className="btn btn-ghost" onClick={undo} disabled={!history.past.length}>
          ↩ Undo
        </button>
        <button className="btn btn-ghost" onClick={redo} disabled={!history.future.length}>
          ↪ Redo
        </button>
        <span style={{ fontSize:"var(--xs)", color:"var(--t3)", alignSelf:"center" }}>
          {history.past.length} past · {history.future.length} future
        </span>
      </div>
    </div>
  );
}
