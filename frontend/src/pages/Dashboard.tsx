import { useEffect, useState } from "react";
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
import PageHeader from "../components/ui/PageHeader";
import LoadingPage from "../components/ui/LoadingPage";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const response = await api.get<DashboardData>("/dashboard");
        setStats(response.data);
        setActivities(response.data.atividades_recentes ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void carregarDados();
  }, []);

  if (loading) {
    return <LoadingPage message="Carregando dashboard..." />;
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Dashboard operacional"
        description="Visão geral das atividades de capeamento"
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KPICard
          title="Total"
          value={stats?.total_atividades ?? 0}
          icon={<Activity className="h-6 w-6" />}
          subtitle="Atividades ativas"
          accent="blue"
        />
        <KPICard
          title="Planejadas"
          value={stats?.planejadas ?? 0}
          icon={<Clock3 className="h-6 w-6" />}
          subtitle="Aguardando início"
          accent="amber"
        />
        <KPICard
          title="Em execução"
          value={stats?.em_execucao ?? 0}
          icon={<Activity className="h-6 w-6" />}
          subtitle="Em andamento"
          accent="cyan"
        />
        <KPICard
          title="Concluídas"
          value={stats?.concluidas ?? 0}
          icon={<CheckCircle2 className="h-6 w-6" />}
          subtitle="Finalizadas"
          accent="green"
        />
        <KPICard
          title="Atrasadas"
          value={stats?.atrasadas ?? 0}
          icon={<AlertTriangle className="h-6 w-6" />}
          subtitle="Fora do prazo"
          accent="red"
        />
      </div>

      <div className="card card-body">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Atividades recentes
        </h2>

        {activities.length === 0 ? (
          <EmptyState
            title="Nenhuma atividade cadastrada"
            description="As atividades criadas aparecerão aqui."
          />
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {activity.titulo}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {activity.obra?.nome ?? "Sem obra vinculada"}
                    {activity.responsavel?.nome &&
                      ` · ${activity.responsavel.nome}`}
                  </p>
                </div>
                <StatusBadge value={activity.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
