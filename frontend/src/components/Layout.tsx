import type {
  ReactNode
} from "react";

import Sidebar
from "./Sidebar";


type Props = {
  children: ReactNode;
};


function Layout({
  children
}: Props) {

  return (

    <div className="flex">

      {/* SIDEBAR FIXA */}

      <div
        className="
          fixed
          left-0
          top-0
          w-64
          h-screen
        "
      >

        <Sidebar />

      </div>


      {/* CONTEÚDO */}

      <main
        className="
          ml-64
          flex-1
          h-screen
          overflow-y-auto
          bg-gray-100
        "
      >

        {children}

      </main>

    </div>
  );
}

export default Layout;