import { useState } from "react";

export default function DynamicForm() {
  const [fields, setFields] = useState([]);

  const addField = (type) => setFields([...fields, { type, value: "" }]);

  const update = (i, val) => {
    const copy = [...fields];
    copy[i].value = val;
    setFields(copy);
  };

  const submit = () => alert(JSON.stringify(fields, null, 2));

  return (
    <div className="card">
      <h2 className="card-title">⚡ Dynamic Form</h2>

      <div style={{ display: "flex", gap: "var(--s3)", marginBottom: "var(--s5)" }}>
        <button className="btn btn-primary" onClick={() => addField("text")}>+ Text Field</button>
        <button className="btn btn-info"    onClick={() => addField("number")}>+ Number Field</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s3)", marginBottom: "var(--s5)" }}>
        {fields.map((f, i) => (
          <input key={i} className="input" type={f.type}
            placeholder={`${f.type} field ${i + 1}`}
            onChange={(e) => update(i, e.target.value)} />
        ))}
      </div>

      {fields.length > 0 && (
        <button className="btn btn-success" onClick={submit}>Submit</button>
      )}
    </div>
  );
}