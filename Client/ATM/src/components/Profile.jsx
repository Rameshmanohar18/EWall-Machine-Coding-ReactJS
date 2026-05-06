function Profile({ setIsLoggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <h2 style={{ marginBottom: 4 }}>Welcome back, Admin 👋</h2>
        <p>You are logged in successfully.</p>
      </div>
      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;