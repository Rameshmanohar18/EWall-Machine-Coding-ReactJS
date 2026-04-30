import { useState } from "react";

export default function UndoRedo() {
  const [history, setHistory] = useState({
    past: [],
    present: "",
    future: []
  });

  const update = (val) => {
    setHistory({
      past: [...history.past, history.present],
      present: val,
      future: []
    });
  };

  const undo = () => {
    const prev = history.past.at(-1);
    setHistory({
      past: history.past.slice(0, -1),
      present: prev,
      future: [history.present, ...history.future]
    });
  };

  return (
    <>
      <input
        value={history.present}
        onChange={(e)=>update(e.target.value)}
      />
      <button onClick={undo}>Undo</button>
    </>
  );
}