import { useState } from "react";

const users = [
  { id:1, name:"Ramesh",           age:24 },
  { id:2, name:"Arun",             age:30 },
  { id:3, name:"Aarthy",           age:22 },
  { id:4, name:"AR",               age:21 },
  { id:5, name:"Abraham",          age:20 },
  { id:6, name:"Jacob Bethel",     age:28 },
  { id:7, name:"Devdutt Padikkal", age:25 },
];

export default function DataTable() {
  const [data, setData] = useState(users);
  const [asc, setAsc] = useState(true);

  const sortAge = () => {
    setData([...data].sort((a, b) => asc ? a.age - b.age : b.age - a.age));
    setAsc(!asc);
  };

  return (
    <div className="card">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"var(--s5)" }}>
        <h2 style={{ margin:0 }}>📊 Data Table</h2>
        <button className="btn btn-primary btn-sm" onClick={sortAge}>
          Sort Age {asc ? "↑" : "↓"}
        </button>
      </div>

      <div style={{ overflowX:"auto" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u, i) => (
              <tr key={u.id}>
                <td style={{ color:"var(--t3)" }}>{i + 1}</td>
                <td>{u.name}</td>
                <td><span className="badge badge-a">{u.age}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
