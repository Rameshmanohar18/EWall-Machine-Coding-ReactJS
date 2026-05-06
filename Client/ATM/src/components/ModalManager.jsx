import { useState } from "react";

export default function ModalManager() {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <h2 className="card-title">🪟 Modal Manager</h2>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>Open Modal</button>

      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">✨ Modal Content</h3>
            <p className="modal-body">
              This is a glassmorphism modal. Click outside or close to dismiss.
            </p>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setOpen(false)}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}