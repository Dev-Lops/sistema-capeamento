import { Link } from "react-router-dom";

function Sidebar() {

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
        Gerenciador de atividades
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

      </nav>

    </aside>
  );
}

export default Sidebar;