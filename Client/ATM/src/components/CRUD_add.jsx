import { useState } from "react";

function CRUD_add() {
  const [task, setTask] = useState("");
  const [todoList, setTodoList] = useState([]);

  const addTask = () => {
    if (!task.trim()) return;
    setTodoList([...todoList, task]);
    setTask("");
  };

  return (
    <div className="card">
      <h2 className="card-title">✅ Todo List</h2>

      <div style={{ display: "flex", gap: "var(--s3)", marginBottom: "var(--s5)" }}>
        <input
          className="input"
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="btn btn-primary" onClick={addTask}>Add</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "var(--s2)" }}>
        {todoList.map((item, index) => (
          <li key={index} className="scroll-item" style={{ margin: 0 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CRUD_add;