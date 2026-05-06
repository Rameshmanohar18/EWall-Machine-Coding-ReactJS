import { useState } from "react";

const mailsData = [
  { id: 1, subject: "React Interview", sender: "hr@company.com", read: false },
  { id: 2, subject: "Offer Letter",    sender: "ceo@startup.io",  read: true  },
  { id: 3, subject: "Team Meeting",    sender: "lead@team.dev",   read: false },
];

export default function GmailClone() {
  const [mails, setMails] = useState(mailsData);
  const [selected, setSelected] = useState([]);

  const toggle = id => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const deleteSelected = () => { setMails(mails.filter(m => !selected.includes(m.id))); setSelected([]); };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s5)" }}>
        <h2 style={{ margin: 0 }}>📧 Gmail Clone</h2>
        {selected.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={deleteSelected}>
            🗑 Delete ({selected.length})
          </button>
        )}
      </div>

      <div className="mail-list">
        {mails.map(mail => (
          <div key={mail.id} className={`mail-row ${mail.read ? "read" : "unread"}`}>
            <input type="checkbox" onChange={() => toggle(mail.id)}
              checked={selected.includes(mail.id)}
              style={{ accentColor: "var(--a2)", width: 16, height: 16, cursor: "pointer" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: mail.read ? 400 : 700, color: "var(--t1)" }}>{mail.subject}</div>
              <div style={{ fontSize: "var(--xs)", color: "var(--t2)" }}>{mail.sender}</div>
            </div>
            {!mail.read && <span className="badge badge-a">New</span>}
          </div>
        ))}
      </div>
    </div>
  );
}