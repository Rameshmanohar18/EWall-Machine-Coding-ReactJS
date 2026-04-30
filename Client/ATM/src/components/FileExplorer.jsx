import { useState } from "react";

const data={
 name:"src",
 children:[
  {name:"App.js"},
  {name:"components",
   children:[{name:"Login.js"}]},
   {name:"index.html"}
 ]
};

function Node({node}){
 const[open,setOpen]=useState(false);

 return(
  <div style={{marginLeft:20}}>
    <h1>FileExplorer Here</h1>
   <p onClick={()=>setOpen(!open)}>{node.name}</p>
   {open && node.children?.map((c,i)=>
     <Node key={i} node={c}/>
   )}
  </div>
 );
}

export default function FileExplorer(){
 return <Node node={data}/>
}