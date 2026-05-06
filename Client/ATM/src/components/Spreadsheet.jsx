import { useState } from "react";

const ROWS = 5, COLS = 5;
const cellName = (r, c) => String.fromCharCode(65 + r) + (c + 1);

function Spreadsheet() {
  const [data, setData] = useState({});
  const [editing, setEditing] = useState(null);

  const evaluate = (val) => {
    if (!val?.startsWith("=")) return val;
    try {
      return eval(val.substring(1).replace(/[A-Z][0-9]+/g, (c) => data[c] || 0));
    } catch { return "ERR"; }
  };

  return (
    <div className="card">
      <h2 className="card-title">📊 Mini Spreadsheet</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="sheet">
          <tbody>
            {[...Array(ROWS)].map((_, r) => (
              <tr key={r}>
                {[...Array(COLS)].map((_, c) => {
                  const cell = cellName(r, c);
                  const val = data[cell] || "";
                  return (
                    <td key={cell} className={editing === cell ? "active" : ""}
                      onClick={() => setEditing(cell)}>
                      {editing === cell
                        ? <input autoFocus value={val}
                            onChange={(e) => setData(p => ({ ...p, [cell]: e.target.value }))}
                            onBlur={() => setEditing(null)}
                            onKeyDown={(e) => e.key === "Enter" && setEditing(null)} />
                        : evaluate(val)
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Spreadsheet;