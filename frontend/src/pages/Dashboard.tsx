import { useEffect, useState } from "react";

import api from "../services/api";

import type { DashboardData } from "../types/dashboard";

import type { Activity } from "../types/activity";


function Dashboard() {

  const [dashboard,
    setDashboard] =
      useState<DashboardData | null>(null);

  const [activities,
    setActivities] =
      useState<Activity[]>([]);

  async function carregarDashboard() {

    try {

      const response =
        await api.get("/dashboard");

      setDashboard(response.data);

    } catch (error) {

      console.error(error);
    }
  }

  async function carregarAtividades() {

    try {

      const response =
        await api.get("/activities");

      setActivities(response.data);

    } catch (error) {

      console.error(error);
    }
  }

  useEffect(() => {

    void carregarDashboard();

    void carregarAtividades();

  }, []);

  function logout() {

    localStorage.removeItem("token");

    window.location.href = "/";
  }

  return (

    <div className="flex min-h-screen">

      {/* CONTEÚDO */}

      <main className="flex-1 p-8">

        {/* HEADER */}

        <div
          className="
            flex
            justify-between
            items-center
            mb-8
          "
        >

          <div>

            <h2
              className="
                text-3xl
                font-bold
              "
            >
              Dashboard
            </h2>

            <p className="text-gray-500">
              Planejamento operacional
            </p>

          </div>

          <button
            onClick={logout}
            className="
              bg-red-500
              text-white
              px-4
              py-2
              rounded
              hover:bg-red-600
            "
          >
            Sair
          </button>

        </div>

        {/* CARDS */}

        <div
          className="
            grid
            grid-cols-4
            gap-6
            mb-10
          "
        >

          <div
            className="
              bg-white
              p-6
              rounded-xl
              shadow
            "
          >
            <h3 className="text-gray-500">
              Total
            </h3>

            <p
              className="
                text-3xl
                font-bold
              "
            >
              {dashboard?.total_atividades}
            </p>
          </div>

          <div
            className="
              bg-white
              p-6
              rounded-xl
              shadow
            "
          >
            <h3 className="text-gray-500">
              Planejadas
            </h3>

            <p
              className="
                text-3xl
                font-bold
              "
            >
              {dashboard?.planejadas}
            </p>
          </div>

          <div
            className="
              bg-white
              p-6
              rounded-xl
              shadow
            "
          >
            <h3 className="text-gray-500">
              Em execução
            </h3>

            <p
              className="
                text-3xl
                font-bold
              "
            >
              {dashboard?.em_execucao}
            </p>
          </div>

          <div
            className="
              bg-white
              p-6
              rounded-xl
              shadow
            "
          >
            <h3 className="text-gray-500">
              Concluídas
            </h3>

            <p
              className="
                text-3xl
                font-bold
              "
            >
              {dashboard?.concluidas}
            </p>
          </div>

        </div>

        {/* TABELA */}

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-6
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-6
            "
          >
            Atividades
          </h2>

          <table className="w-full">

            <thead>

              <tr
                className="
                  border-b
                  text-left
                "
              >
                <th className="pb-3">Título</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Prioridade</th>
                <th className="pb-3">Responsável</th>
                <th className="pb-3">Obra</th>
              </tr>

            </thead>

            <tbody>

              {activities.map((activity) => (

                <tr
                  key={activity.id}
                  className="border-b"
                >

                  <td className="py-4">
                    {activity.titulo}
                  </td>

                  <td className="py-4">
                    {activity.status}
                  </td>

                  <td className="py-4">
                    {activity.prioridade}
                  </td>

                  <td className="py-4">
                    {activity.responsavel}
                  </td>

                  <td className="py-4">
                    {activity.obra}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;