import { useState } from "react";

const users = [
  { id:1,name:"Ramesh",age:24 },
  { id:2,name:"Arun",age:30 },
  { id:3,name:"Aarthy",age:22 },
  { id:4,name:"AR",age:21 },
  { id:5,name:"Abraham",age:20 },
  { id:6,name:"Jacob bethel",age:28 },
  { id:7,name:"Devdutt padikkal",age:25 }
];

export default function DataTable() {
  const [data,setData]=useState(users);

  const sortAge=()=>{
    setData([...data].sort((a,b)=>a.age-b.age));
  };

  return(

<div>
    <h1>DataTable Here</h1>
      <button onClick={sortAge}>Sort Age</button>

      {data.map(u=>(
        <p key={u.id}>{u.name} - {u.age}</p>
      ))}
    </div>
  );
}