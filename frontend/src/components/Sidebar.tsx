import { Link, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();


  /*
  ==========================
  LOGOUT
  ==========================
  */

  function logout() {

    localStorage.removeItem(
      "token"
    );

    navigate("/login");
  }

  return (

    <aside
      className="
        w-64
        bg-gray-900
        text-white
        min-h-screen
        p-6
      "
    >

      <h1
        className="
          text-2xl
          font-bold
          mb-10
        "
      >
        Capeamento
      </h1>

      <nav
        className="
          flex
          flex-col
          gap-4
        "
      >

        <Link
          to="/dashboard"
          className="
            hover:bg-gray-700
            p-3
            rounded
          "
        >
          Dashboard
        </Link>

        <Link
          to="/activities"
          className="
            hover:bg-gray-700
            p-3
            rounded
          "
        >
          Atividades
        </Link>


        {/* LOGOUT */}

        <button
          onClick={logout}
          className="
            bg-red-600
            hover:bg-red-700
            p-3
            rounded
            text-left
            mt-10
          "
        >
          Sair
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;