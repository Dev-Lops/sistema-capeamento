import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import api from "../services/api";
import toast from "react-hot-toast";

import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import StatusBadge from "../components/ui/StatusBadge";

type Company = {
  id: number;
  nome: string;
  tipo: string;
};

export default function Companies() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("propria");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregarEmpresas() {
    try {
      const response = await api.get<Company[]>("/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar empresas");
    }
  }

  useEffect(() => {
    void carregarEmpresas();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      await api.post("/companies", { nome, tipo });
      toast.success("Empresa criada");
      setNome("");
      setTipo("propria");
      await carregarEmpresas();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar empresa");
    } finally {
      setLoading(false);
    }
  }

  async function deletarEmpresa(id: number) {
    if (!confirm("Deseja remover esta empresa?")) return;

    try {
      await api.delete(`/companies/${id}`);
      toast.success("Empresa removida");
      await carregarEmpresas();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover");
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Empresas"
        description="Empresas vinculadas às equipes de campo"
      />

      <form onSubmit={handleSubmit} className="card card-body mb-8 max-w-xl">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Nova empresa
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label-field">Nome</label>
            <input
              type="text"
              placeholder="Nome da empresa"
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
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-6">
          <Plus className="h-4 w-4" />
          {loading ? "Salvando..." : "Criar empresa"}
        </button>
      </form>

      <div className="card card-body">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Empresas cadastradas
        </h2>

        {companies.length === 0 ? (
          <EmptyState title="Nenhuma empresa cadastrada" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td className="font-medium text-slate-900">
                      {company.nome}
                    </td>
                    <td>
                      <StatusBadge value={company.tipo} />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deletarEmpresa(company.id)}
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
