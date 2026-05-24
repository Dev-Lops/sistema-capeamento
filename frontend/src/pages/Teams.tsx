import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import api from "../services/api";
import toast from "react-hot-toast";
import type { Team } from "../types/team";
import type { Company } from "../types/company";

import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";

export default function Teams() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("propria");
  const [companyId, setCompanyId] = useState<number | "">("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregarEquipes() {
    try {
      const response = await api.get<Team[]>("/teams/");
      setTeams(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar equipes");
    }
  }

  async function carregarEmpresas() {
    try {
      const response = await api.get<Company[]>("/companies/");
      setCompanies(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar empresas");
    }
  }

  useEffect(() => {
    void carregarEquipes();
    void carregarEmpresas();
  }, []);

  async function criarEquipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!companyId) {
      toast.error("Selecione uma empresa");
      return;
    }

    try {
      setLoading(true);
      await api.post("/teams/", {
        nome,
        tipo,
        company_id: Number(companyId),
      });

      toast.success("Equipe criada");
      setNome("");
      setTipo("propria");
      setCompanyId("");
      await carregarEquipes();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar equipe");
    } finally {
      setLoading(false);
    }
  }

  async function deletarEquipe(id: number) {
    if (!confirm("Deseja remover equipe?")) return;

    try {
      await api.delete(`/teams/${id}`);
      toast.success("Equipe removida");
      await carregarEquipes();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover equipe");
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Equipes"
        description="Equipes de execução vinculadas às empresas"
      />

      <form onSubmit={criarEquipe} className="card card-body mb-8 max-w-xl">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Nova equipe
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label-field">Nome da equipe</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="select-field"
            >
              <option value="propria">Própria</option>
              <option value="terceirizada">Terceirizada</option>
            </select>
          </div>
          <div>
            <label className="label-field">Empresa</label>
            <select
              value={companyId}
              onChange={(e) =>
                setCompanyId(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="select-field"
            >
              <option value="">Selecione empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-6">
          <Plus className="h-4 w-4" />
          {loading ? "Salvando..." : "Criar equipe"}
        </button>
      </form>

      <div className="card card-body">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Equipes cadastradas
        </h2>

        {teams.length === 0 ? (
          <EmptyState title="Nenhuma equipe cadastrada" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Empresa</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td className="font-medium text-slate-900">{team.nome}</td>
                    <td>
                      <StatusBadge value={team.tipo} />
                    </td>
                    <td>{team.company?.nome ?? "—"}</td>
                    <td>
                      <span
                        className={
                          team.ativo ? "badge badge-green" : "badge badge-slate"
                        }
                      >
                        {team.ativo ? "Ativa" : "Inativa"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deletarEquipe(team.id)}
                        className="btn-danger !px-3 !py-1.5 text-xs"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
