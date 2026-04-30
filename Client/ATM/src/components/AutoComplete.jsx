import {useState,useEffect} from "react";

export default function AutoComplete(){
 const[q,setQ]=useState("");
 const[result,setResult]=useState([]);

 useEffect(()=>{
  const timer=setTimeout(()=>{
   fetch("https://jsonplaceholder.typicode.com/users")
   .then(r=>r.json())
   .then(data=>{
     setResult(
      data.filter(u=>u.name.toLowerCase()
      .includes(q.toLowerCase()))
     );
   });
  },500);

  return()=>clearTimeout(timer);
 },[q]);

 return(
  <>
   <input onChange={e=>setQ(e.target.value)}/>
   {result.map(r=><p key={r.id}>{r.name}</p>)}
  </>
 );
}