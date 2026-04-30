import { useState } from "react";

const mailsData = [
  { id: 1, subject: "React Interview", read: false },
  { id: 2, subject: "Offer Letter", read: true },
  { id: 3, subject: "Meeting", read: false }
];

export default function GmailClone() {
  const [mails, setMails] = useState(mailsData);
  const [selected, setSelected] = useState([]);

  const toggleSelect = id => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const deleteSelected = () => {
    setMails(mails.filter(m => !selected.includes(m.id)));
    setSelected([]);
  };

  return (
    <div>
        <h1>Gmail Clone here</h1>
      <button onClick={deleteSelected}>Delete</button>

      {mails.map(mail => (
        <div key={mail.id}>
          <input
            type="checkbox"
            onChange={() => toggleSelect(mail.id)}
          />
          <span>{mail.subject}</span>
        </div>
      ))}
    </div>
  );
}