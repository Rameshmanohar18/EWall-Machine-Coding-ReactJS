import { useState } from "react";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      localStorage.setItem("user", "admin");
      setIsLoggedIn(true);
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2 className="card-title">🔐 Login</h2>

      <div className="form-row">
        <label className="label">Username</label>
        <input
          className="input"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;