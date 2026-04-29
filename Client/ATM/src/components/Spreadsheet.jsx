import { useState } from "react";

const rows = 5;
const cols = 5;

const getCellName = (r, c) =>
  String.fromCharCode(65 + r) + (c + 1);

function Spreadsheet() {
  const [data, setData] = useState({});
  const [editing, setEditing] = useState(null);

  const evaluateFormula = (value) => {
    if (!value.startsWith("=")) return value;

    try {
      const expression = value
        .substring(1)
        .replace(/[A-Z][0-9]+/g, (cell) => data[cell] || 0);

      return eval(expression);
    } catch {
      return "ERROR";
    }
  };

  const handleChange = (cell, value) => {
    setData((prev) => ({
      ...prev,
      [cell]: value,
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mini Excel Spreadsheet</h2>

      <table border="1" cellPadding="10">
        <tbody>
          {[...Array(rows)].map((_, r) => (
            <tr key={r}>
              {[...Array(cols)].map((_, c) => {
                const cell = getCellName(r, c);
                const value = data[cell] || "";

                return (
                  <td
                    key={cell}
                    onClick={() => setEditing(cell)}
                    style={{
                      minWidth: 80,
                      background:
                        editing === cell ? "#e6f2ff" : "white",
                    }}
                  >
                    {editing === cell ? (
                      <input
                        autoFocus
                        value={value}
                        onChange={(e) =>
                          handleChange(cell, e.target.value)
                        }
                        onBlur={() => setEditing(null)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          setEditing(null)
                        }
                      />
                    ) : (
                      evaluateFormula(value)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Spreadsheet;