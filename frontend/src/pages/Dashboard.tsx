import {
  useEffect,
  useState,
} from "react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../services/api";

import type {
  Activity
} from "../types/activity";


function Dashboard() {

  /*
  ===================================
  ESTADOS
  ===================================
  */

  const [activities,
    setActivities] =
      useState<Activity[]>([]);

  const [loading,
    setLoading] =
      useState(true);


  /*
  ===================================
  BUSCAR DADOS
  ===================================
  */

  useEffect(() => {

    async function carregarDados() {

      try {

        const response =
          await api.get(
            "/activities"
          );

        setActivities(
          response.data
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    void carregarDados();

  }, []);


  /*
  ===================================
  KPIs
  ===================================
  */

  const total =
    activities.length;

  const planejadas =
    activities.filter(
      (activity) =>
        activity.status ===
        "planejado"
    ).length;

  const emExecucao =
    activities.filter(
      (activity) =>
        activity.status ===
        "em_execucao"
    ).length;

  const concluidas =
    activities.filter(
      (activity) =>
        activity.status ===
        "concluido"
    ).length;


  /*
  ===================================
  DADOS DOS GRÁFICOS
  ===================================
  */

  const statusData = [

    {
      name: "Planejado",
      value: planejadas,
    },

    {
      name: "Em execução",
      value: emExecucao,
    },

    {
      name: "Concluído",
      value: concluidas,
    },
  ];


  const prioridadeData = [

    {
      name: "Baixa",
      total: activities.filter(
        (activity) =>
          activity.prioridade ===
          "baixa"
      ).length,
    },

    {
      name: "Média",
      total: activities.filter(
        (activity) =>
          activity.prioridade ===
          "media"
      ).length,
    },

    {
      name: "Alta",
      total: activities.filter(
        (activity) =>
          activity.prioridade ===
          "alta"
      ).length,
    },
  ];


  /*
  ===================================
  CORES
  ===================================
  */

  const COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#10B981",
  ];


  /*
  ===================================
  LOADING
  ===================================
  */

  if (loading) {

    return (

      <div className="p-10">
        Carregando dashboard...
      </div>
    );
  }


  /*
  ===================================
  INTERFACE
  ===================================
  */

  return (

    <div className="p-10">

      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Dashboard Operacional
      </h1>


      {/* KPIs */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-4
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
          <p className="text-gray-500">
            Total
          </p>

          <h2
            className="
              text-4xl
              font-bold
            "
          >
            {total}
          </h2>
        </div>


        <div
          className="
            bg-white
            p-6
            rounded-xl
            shadow
          "
        >
          <p className="text-gray-500">
            Planejadas
          </p>

          <h2
            className="
              text-4xl
              font-bold
              text-blue-500
            "
          >
            {planejadas}
          </h2>
        </div>


        <div
          className="
            bg-white
            p-6
            rounded-xl
            shadow
          "
        >
          <p className="text-gray-500">
            Em execução
          </p>

          <h2
            className="
              text-4xl
              font-bold
              text-yellow-500
            "
          >
            {emExecucao}
          </h2>
        </div>


        <div
          className="
            bg-white
            p-6
            rounded-xl
            shadow
          "
        >
          <p className="text-gray-500">
            Concluídas
          </p>

          <h2
            className="
              text-4xl
              font-bold
              text-green-500
            "
          >
            {concluidas}
          </h2>
        </div>

      </div>


      {/* GRÁFICOS */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-8
        "
      >

        {/* STATUS */}

        <div
          className="
            bg-white
            p-6
            rounded-xl
            shadow
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-6
            "
          >
            Status das atividades
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={100}
                label
              >

                {
                  statusData.map(
                    (_, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[index]
                      }
                    />

                  ))
                }

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>


        {/* PRIORIDADE */}

        <div
          className="
            bg-white
            p-6
            rounded-xl
            shadow
          "
        >

          <h2
            className="
              text-xl
              font-bold
              mb-6
            "
          >
            Prioridades
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={prioridadeData}
            >

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="total" />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* RECENTES */}

      <div
        className="
          bg-white
          p-6
          rounded-xl
          shadow
          mt-10
        "
      >

        <h2
          className="
            text-xl
            font-bold
            mb-6
          "
        >
          Atividades recentes
        </h2>

        <div className="space-y-4">

          {
            activities
              .slice(0, 5)
              .map((activity) => (

              <div
                key={activity.id}
                className="
                  border
                  rounded-lg
                  p-4
                "
              >

                <h3 className="font-bold">
                  {activity.titulo}
                </h3>

                <p className="text-gray-500">
                  {activity.obra}
                </p>

                <p className="text-sm mt-2">
                  Status:
                  {" "}
                  {activity.status}
                </p>

              </div>

            ))
          }

        </div>

      </div>

    </div>
  );
}

export default Dashboard;