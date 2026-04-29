// import  { useState } from "react";

// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleLogin = () => {
//     if (username === "admin" && password === "admin") {
//       setIsLoggedIn(true);
//     } else {
//       alert("Invalid Credentials");
//     }
//   };

//   if (isLoggedIn) {
//     return <h2>Welcome Admin ✅</h2>;
//   }

//   return (
//     <div>
//       <h2>Login Page</h2>

//       <input
//         placeholder="Username"
//         onChange={(e) => setUsername(e.target.value)}
//       />

//       <br /><br />

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <br /><br />

//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }

// export default Login;
import { useState } from "react";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      localStorage.setItem("user", "admin"); // persist login
      setIsLoggedIn(true);
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div>
      <h2>Login Page</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;