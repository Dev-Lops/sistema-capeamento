function Dashboard() {

  function logout() {

    localStorage.removeItem("token");

    window.location.href = "/";
  }

  return (
    <div>

      <h1>Dashboard</h1>

      <button onClick={logout}>
        Sair
      </button>

    </div>
  );
}

export default Dashboard;