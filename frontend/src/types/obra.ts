export type Obra = {
  id: number;
  nome: string;
  cliente: string;
  local: string;
  status: string;
  data_inicio?: string | null;
  data_fim?: string | null;
  ativo: boolean;
};
