export type Activity = {

  id: number;

  titulo: string;

  descricao: string;

  status: string;

  prioridade: string;

  responsavel: string;

  obra: string;

  data_inicio?: string;

  data_fim?: string;

  project_id?: number;
};