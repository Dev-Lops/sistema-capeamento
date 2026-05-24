import { Link, useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";

function Sidebar() {

  const navigate = useNavigate();
const {
  user,
} = useAuth();

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
        <div
  className="
    mb-10
    border-b
    border-gray-700
    pb-4
  "
>

  <p className="font-bold">
    {user?.nome}
  </p>

  <p
    className="
      text-sm
      text-gray-400
    "
  >
    {user?.role}
  </p>

</div>

      <h1
        className="
          text-2xl
          font-bold
          mb-10
        "
      >
        Gerenciador
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