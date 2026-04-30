import { useState, useEffect } from "react";

export default function Router() {
  const [path,setPath]=useState(window.location.pathname);

  useEffect(()=>{
    window.onpopstate=()=>setPath(window.location.pathname);
  },[]);

  const navigate=(p)=>{
    window.history.pushState({}, "", p);
    setPath(p);
  };

  return(
    <>
    <h2>Mini React router here</h2>
      <button onClick={()=>navigate("/about")}>About</button>

      {path==="/" && <h1>Home</h1>}
      {path==="/about" && <h1>About</h1>}
    </>
  );
}