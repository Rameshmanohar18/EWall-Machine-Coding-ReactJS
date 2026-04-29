import React, { useState } from "react";

export default function ModalManager() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>

      {open && (
        <div style={{
          position:"fixed",
          top:0,left:0,right:0,bottom:0,
          background:"rgba(0,0,0,0.5)"
        }}>
          <div style={{
            background:"white",
            padding:20,
            margin:"100px auto",
            width:300
          }}>
            <h3>Modal Content</h3>
            <button onClick={()=>setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}