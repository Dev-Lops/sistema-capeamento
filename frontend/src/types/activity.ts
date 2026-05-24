export type ObraRef = {
  id: number;
  nome: string;
};

export type ProjectRef = {
  id: number;
  nome: string;
};

export type TeamRef = {
  id: number;
  nome: string;
};

export type UserRef = {
  id: number;
  nome: string;
};

export type Activity = {
  id: number;
  titulo: string;
  descricao: string | null;
  status: string;
  prioridade: string;
  data_inicio: string;
  data_fim: string;
  obra_id: number | null;
  project_id: number | null;
  team_id: number | null;
  responsavel_id: number | null;
  obra: ObraRef | null;
  project: ProjectRef | null;
  team: TeamRef | null;
  responsavel: UserRef | null;
};
