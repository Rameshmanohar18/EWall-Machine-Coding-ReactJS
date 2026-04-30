import { useState } from "react";

export default function DynamicForm() {
  const [fields, setFields] = useState([]);

  const addField = (type) => {
    setFields([...fields, { type, value: "" }]);
  };

  const update = (i, val) => {
    const copy = [...fields];
    copy[i].value = val;
    setFields(copy);
  };

  const submit = () => {
    console.log(fields);
    alert(JSON.stringify(fields));
  };

  return (
    <div>
      <h1>DynamicForm Here</h1>
      <button onClick={() => addField("text")}>Text</button>
      <button onClick={() => addField("number")}>Number</button>

      {fields.map((f, i) => (
        <input
          key={i}
          type={f.type}
          onChange={(e) => update(i, e.target.value)}
        />
      ))}

      <button onClick={submit}>Submit</button>
    </div>
  );
}