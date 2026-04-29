// import  { useState } from "react";

// function ATM() {
//   const [balance, setBalance] = useState(1000);
//   const [amount, setAmount] = useState("");

//   const deposit = () => {
//     const value = Number(amount);
//     if (value <= 0) return;

//     setBalance(balance + value);
//     setAmount("");
//   };

//   const withdraw = () => {
//     const value = Number(amount);

//     if (value > balance) {
//       alert("Insufficient Balance");
//       return;
//     }

//     setBalance(balance - value);
//     setAmount("");
//   };

//   return (
//     <div style={{ padding: 30 }}>
//       <h2>Bank Account</h2>

//       <h3>Balance: ₹{balance}</h3>

//       <input
//         type="number"
//         placeholder="Enter Amount"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />

//       <br /><br />

//       <button onClick={deposit}>Deposit</button>
//       <button onClick={withdraw}>Withdraw</button>
//     </div>
//   );
// }

// export default ATM;
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ATM() {
  const CORRECT_PIN = "1234";

  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [balance, setBalance] = useState(5000);
  const [amount, setAmount] = useState("");

  // 🔐 PIN LOGIN
  const handleLogin = () => {
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      toast.success("ATM Unlocked ✅");
    } else {
      toast.error("Invalid PIN ❌");
    }
  };

  // 💰 Deposit
  const deposit = () => {
    const value = Number(amount);

    if (value <= 0 || !value) {
      toast.warning("Enter valid amount");
      return;
    }

    setBalance(prev => prev + value);
    setAmount("");
    toast.success("Deposit successful 💵");
  };

  // 💸 Withdraw
  const withdraw = () => {
    const value = Number(amount);

    if (value <= 0 || !value) {
      toast.warning("Enter valid amount");
      return;
    }

    if (value > balance) {
      toast.error("Insufficient balance");
      return;
    }

    setBalance(prev => prev - value);
    setAmount("");
    toast.success("Withdraw successful 💸");
  };

  // 🏦 Show Balance
  const showBalance = () => {
    toast.info(`Current balance is ₹${balance}`);
  };

  // 🔐 PIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Enter ATM PIN</h2>

        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <br /><br />

        <button onClick={handleLogin}>Login</button>

        <ToastContainer />
      </div>
    );
  }

  // 🏧 ATM DASHBOARD
  return (
    <div style={{ padding: 30 }}>
      <h2>ATM Machine</h2>

      {/* Balance Card */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: 20,
          width: 250,
          borderRadius: 10,
          marginBottom: 20,
          boxShadow: "0 0 10px #ddd"
        }}
      >
        <h3>Account Balance</h3>
        <h2>₹{balance}</h2>
      </div>

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={deposit}>Deposit</button>
      <button onClick={withdraw}>Withdraw</button>
      <button onClick={showBalance}>Show Balance</button>

      <ToastContainer />
    </div>
  );
}

export default ATM;