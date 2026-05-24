import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Building2,
  FolderKanban,
  Users,
  Factory,
  LogOut,
  HardHat,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/cn";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "planner", "operador"] },
  { to: "/activities", label: "Atividades", icon: ListTodo, roles: ["admin", "planner"] },
  { to: "/obras", label: "Obras", icon: Building2, roles: ["admin", "planner"] },
  { to: "/projects", label: "Projetos", icon: FolderKanban, roles: ["admin", "planner"] },
  { to: "/teams", label: "Equipes", icon: Users, roles: ["admin", "planner"] },
  { to: "/companies", label: "Empresas", icon: Factory, roles: ["admin", "planner"] },
];

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  planner: "Planejador",
  operador: "Operador",
};

function Sidebar() {
  const { user, logout } = useAuth();

  const visibleLinks = links.filter(
    (link) => user && link.roles.includes(user.role),
  );

  return (
    <div className="flex h-full flex-col bg-sidebar text-white">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-lg shadow-brand-600/30">
            <HardHat className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Capeamento</p>
            <p className="text-xs text-slate-400">Gestão operacional</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="mx-4 mt-4 rounded-xl bg-white/5 px-4 py-3">
          <p className="truncate text-sm font-semibold">{user.nome}</p>
          <p className="text-xs text-slate-400">
            {roleLabels[user.role] ?? user.role}
          </p>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {visibleLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25"
                  : "text-slate-400 hover:bg-sidebar-hover hover:text-white",
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
