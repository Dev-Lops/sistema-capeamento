import {
  useEffect,
  useState,
} from "react";

import {
  Activity,
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import api from "../services/api";

import type {
  Activity as ActivityType
} from "../types/activity";

import KPICard
from "../components/dashboard/KPICard";


function Dashboard() {

  /*
  ===================================
  ESTADOS
  ===================================
  */

  const [activities,
    setActivities] =
      useState<ActivityType[]>([]);

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
  LOADING
  ===================================
  */

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-[#0f172a]
          text-white
          p-10
        "
      >
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

    <div
      className="
        min-h-screen
        bg-[#0f172a]
        text-white
        p-10
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-10
        "
      >

        <div>

          <p className="text-gray-400">
            Sistema operacional
          </p>

          <h1
            className="
              text-5xl
              font-bold
              mt-2
            "
          >
            Dashboard
          </h1>

        </div>


        <div
          className="
            flex
            items-center
            gap-3
            bg-emerald-500/10
            border
            border-emerald-500/20
            px-5
            py-3
            rounded-2xl
          "
        >

          <div
            className="
              w-3
              h-3
              rounded-full
              bg-emerald-400
            "
          />

          <span
            className="
              text-emerald-300
              font-medium
            "
          >
            Sistema operacional ativo
          </span>

        </div>

      </div>


      {/* KPI GRID */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          mb-10
        "
      >

        <KPICard
          title="Total de atividades"
          value={total}
          subtitle="Atividades registradas"
          glow="hover:shadow-blue-500/20"
          icon={
            <Activity size={28} />
          }
        />


        <KPICard
          title="Planejadas"
          value={planejadas}
          subtitle="Aguardando execução"
          glow="hover:shadow-yellow-500/20"
          icon={
            <Clock3 size={28} />
          }
        />


        <KPICard
          title="Em execução"
          value={emExecucao}
          subtitle="Operações em andamento"
          glow="hover:shadow-orange-500/20"
          icon={
            <AlertTriangle size={28} />
          }
        />


        <KPICard
          title="Concluídas"
          value={concluidas}
          subtitle="Execuções finalizadas"
          glow="hover:shadow-emerald-500/20"
          icon={
            <CheckCircle2 size={28} />
          }
        />

      </div>


      {/* GRID INFERIOR */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        {/* FEED */}

        <div
          className="
            xl:col-span-2
            rounded-2xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            p-8
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-8
            "
          >

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Atividades recentes
            </h2>

            <span
              className="
                text-sm
                text-gray-400
              "
            >
              Últimas operações
            </span>

          </div>


          <div className="space-y-4">

            {
              activities
                .slice(0, 5)
                .map((activity) => (

                <div
                  key={activity.id}
                  className="
                    p-5
                    rounded-xl
                    border
                    border-white/5
                    bg-white/5
                    hover:bg-white/10
                    transition-all
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <h3
                        className="
                          font-semibold
                          text-lg
                        "
                      >
                        {activity.titulo}
                      </h3>

                      <p
                        className="
                          text-gray-400
                          mt-1
                        "
                      >
                        {activity.obra}
                      </p>

                    </div>


                    <div
                      className="
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        bg-white/10
                      "
                    >
                      {activity.status}
                    </div>

                  </div>

                </div>

              ))
            }

          </div>

        </div>


        {/* PAINEL LATERAL */}

        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            p-8
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-8
            "
          >
            Resumo operacional
          </h2>


          <div className="space-y-6">

            <div>

              <p className="text-gray-400">
                Taxa de conclusão
              </p>

              <h3
                className="
                  text-4xl
                  font-bold
                  mt-2
                "
              >
                {
                  total > 0
                    ? Math.round(
                        (
                          concluidas
                          /
                          total
                        ) * 100
                      )
                    : 0
                }%
              </h3>

            </div>


            <div>

              <p className="text-gray-400">
                Operações ativas
              </p>

              <h3
                className="
                  text-4xl
                  font-bold
                  mt-2
                "
              >
                {emExecucao}
              </h3>

            </div>


            <div>

              <p className="text-gray-400">
                Atividades críticas
              </p>

              <h3
                className="
                  text-4xl
                  font-bold
                  mt-2
                "
              >
                {
                  activities.filter(
                    (activity) =>
                      activity.prioridade
                      === "alta"
                  ).length
                }
              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;