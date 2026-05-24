export type Team = {
  id: number;
  nome: string;
  tipo: string;
  company?: {
    id: number;
    nome: string;
  };
  ativo: boolean;
};