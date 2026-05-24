import type { ReactNode } from "react";

import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
};

function Layout({
  children
}: Props) {

  return (

    <div className="flex">

      <Sidebar />

      <main
        className="
          flex-1
          bg-gray-100
          min-h-screen
        "
      >
        {children}
      </main>

    </div>
  );
}

export default Layout;