import { useReducer } from "react";

// ── State shape ──────────────────────────────────────────────
const initialState = {
  items: [],
  input: "",
  filter: "all",   // all | active | done
};

// ── Reducer ──────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload };

    case "ADD":
      if (!state.input.trim()) return state;
      return {
        ...state,
        items: [...state.items, { id: Date.now(), text: state.input.trim(), done: false }],
        input: "",
      };

    case "TOGGLE":
      return {
        ...state,
        items: state.items.map(i => i.id === action.payload ? { ...i, done: !i.done } : i),
      };

    case "DELETE":
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };

    case "SET_FILTER":
      return { ...state, filter: action.payload };

    default:
      return state;
  }
}

const filterColors = { all: "var(--a2)", active: "var(--warn)", done: "var(--ok)" };

export default function UseReducerDemo() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const visible = state.items.filter(i => {
    if (state.filter === "active") return !i.done;
    if (state.filter === "done")   return  i.done;
    return true;
  });

  return (
    <div className="card">
      <h2 className="card-title">⚙️ useReducer</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        <code>useReducer</code> manages complex state with a pure reducer function —
        great when next state depends on previous state or multiple sub-values change together.
      </p>

      {/* Input */}
      <div style={{ display: "flex", gap: "var(--s3)", marginBottom: "var(--s4)" }}>
        <input
          className="input"
          placeholder="Add a task..."
          value={state.input}
          onChange={e => dispatch({ type: "SET_INPUT", payload: e.target.value })}
          onKeyDown={e => e.key === "Enter" && dispatch({ type: "ADD" })}
        />
        <button className="btn btn-primary" onClick={() => dispatch({ type: "ADD" })}>Add</button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "var(--s2)", marginBottom: "var(--s4)" }}>
        {["all", "active", "done"].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${state.filter === f ? "btn-primary" : "btn-ghost"}`}
            onClick={() => dispatch({ type: "SET_FILTER", payload: f })}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "var(--xs)", color: "var(--t3)", alignSelf: "center" }}>
          {state.items.filter(i => !i.done).length} remaining
        </span>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s2)" }}>
        {visible.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--t3)", padding: "var(--s6)", fontSize: "var(--sm)" }}>
            No tasks here.
          </div>
        )}
        {visible.map(item => (
          <div key={item.id} style={{
            display: "flex", alignItems: "center", gap: "var(--s3)",
            padding: "10px 14px", borderRadius: "var(--r2)",
            background: "var(--glass2)", border: "1px solid var(--gb)",
            transition: "all var(--tr)"
          }}>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => dispatch({ type: "TOGGLE", payload: item.id })}
              style={{ accentColor: "var(--a2)", width: 16, height: 16, cursor: "pointer" }}
            />
            <span style={{
              flex: 1, color: item.done ? "var(--t3)" : "var(--t1)",
              textDecoration: item.done ? "line-through" : "none",
              fontSize: "var(--base)"
            }}>
              {item.text}
            </span>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => dispatch({ type: "DELETE", payload: item.id })}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
