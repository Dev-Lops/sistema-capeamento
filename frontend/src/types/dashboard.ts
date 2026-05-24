import type { Activity } from "./activity";

export type DashboardData = {
  total_atividades: number;
  planejadas: number;
  em_execucao: number;
  concluidas: number;
  atrasadas: number;
  atividades_recentes: Activity[];
};
