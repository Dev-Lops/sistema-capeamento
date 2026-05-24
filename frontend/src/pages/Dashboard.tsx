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

import type { Activity as ActivityType } from "../types/activity";
import type { DashboardData } from "../types/dashboard";

import KPICard from "../components/dashboard/KPICard";


function Dashboard() {

  const [stats, setStats] = useState<DashboardData | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function carregarDados() {

      try {

        const response =
          await api.get<DashboardData>(
            "/dashboard"
          );

        setStats(response.data);

        setActivities(
          response.data.atividades_recentes ?? []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    void carregarDados();

  }, []);


  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-[#0f172a]
          flex
          items-center
          justify-center
          text-white
        "
      >
        Carregando dashboard...
      </div>

    );
  }

  const total = stats?.total_atividades ?? 0;
  const planejadas = stats?.planejadas ?? 0;
  const emExecucao = stats?.em_execucao ?? 0;
  const concluidas = stats?.concluidas ?? 0;
  const atrasadas = stats?.atrasadas ?? 0;

  return (

    <div className="p-10">

      <div className="mb-10">

        <h1 className="text-4xl font-bold text-white">
          Dashboard Operacional
        </h1>

        <p className="text-gray-400 mt-2">
          Visão geral das atividades de capeamento
        </p>

      </div>


      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-5
          gap-6
          mb-10
        "
      >

        <KPICard
          title="Total"
          value={total}
          icon={<Activity />}
          subtitle="Atividades ativas"
          glow="hover:shadow-blue-500/20"
        />

        <KPICard
          title="Planejadas"
          value={planejadas}
          icon={<Clock3 />}
          subtitle="Aguardando início"
          glow="hover:shadow-yellow-500/20"
        />

        <KPICard
          title="Em execução"
          value={emExecucao}
          icon={<Activity />}
          subtitle="Em andamento"
          glow="hover:shadow-cyan-500/20"
        />

        <KPICard
          title="Concluídas"
          value={concluidas}
          icon={<CheckCircle2 />}
          subtitle="Finalizadas"
          glow="hover:shadow-green-500/20"
        />

        <KPICard
          title="Atrasadas"
          value={atrasadas}
          icon={<AlertTriangle />}
          subtitle="Fora do prazo"
          glow="hover:shadow-red-500/20"
        />

      </div>


      <div
        className="
          bg-[#111827]
          border
          border-white/10
          rounded-2xl
          p-8
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            text-white
            mb-6
          "
        >
          Atividades recentes
        </h2>


        {
          activities.length === 0 ? (

            <p className="text-gray-400">
              Nenhuma atividade cadastrada.
            </p>

          ) : (

            <div className="space-y-4">

              {
                activities.map((activity) => (

                  <div
                    key={activity.id}
                    className="
                      flex
                      items-center
                      justify-between
                      p-5
                      rounded-xl
                      border
                      border-white/5
                      bg-white/5
                      hover:bg-white/10
                      transition-all
                    "
                  >

                    <div>

                      <h3 className="font-semibold text-lg text-white">
                        {activity.titulo}
                      </h3>

                      <p className="text-gray-400 mt-1">
                        {activity.obra?.nome ?? "Sem obra"}
                      </p>

                    </div>


                    <div
                      className="
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        bg-white/10
                        text-white
                      "
                    >
                      {activity.status}
                    </div>

                  </div>

                ))
              }

            </div>

          )
        }

      </div>

    </div>

  );
}

export default Dashboard;
