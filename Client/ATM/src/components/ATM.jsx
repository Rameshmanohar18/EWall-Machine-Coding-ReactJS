import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ATM() {
  const CORRECT_PIN = "1234";
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState(5000);
  const [amount, setAmount] = useState("");

  const handleLogin = () => {
    if (pin === CORRECT_PIN) { setIsAuthenticated(true); toast.success("ATM Unlocked ✅"); }
    else toast.error("Invalid PIN ❌");
  };

  const deposit = () => {
    const v = Number(amount);
    if (!v || v <= 0) { toast.warning("Enter valid amount"); return; }
    setBalance(p => p + v); setAmount(""); toast.success("Deposit successful 💵");
  };

  const withdraw = () => {
    const v = Number(amount);
    if (!v || v <= 0) { toast.warning("Enter valid amount"); return; }
    if (v > balance) { toast.error("Insufficient balance"); return; }
    setBalance(p => p - v); setAmount(""); toast.success("Withdraw successful 💸");
  };

  if (!isAuthenticated) {
    return (
      <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h2 className="card-title">🏧 ATM — Enter PIN</h2>
        <div className="form-row">
          <label className="label">PIN</label>
          <input className="input" type="password" placeholder="Enter 4-digit PIN"
            value={pin} onChange={(e) => setPin(e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleLogin}>Unlock ATM</button>
        <ToastContainer theme="dark" />
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">🏧 ATM Machine</h2>

      <div className="balance-card">
        <div className="balance-label">Account Balance</div>
        <div className="balance-amount">₹{balance.toLocaleString()}</div>
      </div>

      <div className="form-row">
        <label className="label">Amount</label>
        <input className="input" type="number" placeholder="Enter amount"
          value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: "var(--s3)", flexWrap: "wrap" }}>
        <button className="btn btn-success" onClick={deposit}>💵 Deposit</button>
        <button className="btn btn-danger"  onClick={withdraw}>💸 Withdraw</button>
        <button className="btn btn-info"    onClick={() => toast.info(`Balance: ₹${balance}`)}>👁 Balance</button>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
}

export default ATM;