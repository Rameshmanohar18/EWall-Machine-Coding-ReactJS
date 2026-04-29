import{ useState } from "react";

function CRUD_add() {
  const [task, setTask] = useState("");
  const [todoList, setTodoList] = useState([]);

  const addTask = () => {
    if (!task.trim()) return;

    setTodoList([...todoList, task]);
    setTask("");
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>ToDo List</h2>

      <input
        type="text"
        placeholder="Enter Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button onClick={addTask}>Add</button>

      <ul>
        {todoList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default CRUD_add;