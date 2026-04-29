// // import React from "react";

// function Profile({ setIsLoggedIn }) {

//   const logout = () => {
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: 100 }}>
//       <h2>Profile Page</h2>

//       <h3>✅ Login Successful</h3>

//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }

// export default Profile;
function Profile({ setIsLoggedIn }) {

  const handleLogout = () => {
    localStorage.removeItem("user"); // remove session
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h2>Login Successful ✅</h2>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;