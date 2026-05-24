import type { ReactNode } from "react";

import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 w-64">
        <Sidebar />
      </aside>

      <main className="ml-64 min-h-screen flex-1">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
