import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import api from "../services/api";
import toast from "react-hot-toast";
import type { Obra } from "../types/obra";

import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";

export default function Obras() {
  const [nome, setNome] = useState("");
  const [cliente, setCliente] = useState("");
  const [local, setLocal] = useState("");
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregarObras() {
    try {
      const response = await api.get<Obra[]>("/obras");
      setObras(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar obras");
    }
  }

  useEffect(() => {
    void carregarObras();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!nome.trim() || !cliente.trim() || !local.trim()) {
      toast.error("Preencha nome, cliente e local");
      return;
    }

    try {
      setLoading(true);
      await api.post("/obras", {
        nome,
        cliente,
        local,
        status: "planejada",
      });

      toast.success("Obra criada");
      setNome("");
      setCliente("");
      setLocal("");
      await carregarObras();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar obra");
    } finally {
      setLoading(false);
    }
  }

  async function deletarObra(id: number) {
    if (!confirm("Deseja remover esta obra?")) return;

    try {
      await api.delete(`/obras/${id}`);
      toast.success("Obra removida");
      await carregarObras();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover obra");
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Obras"
        description="Cadastro de unidades e locais de capeamento"
      />

      <form onSubmit={handleSubmit} className="card card-body mb-8 max-w-3xl">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Nova obra
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="label-field">Nome</label>
            <input
              type="text"
              placeholder="Ex: UTE GNA II"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Cliente</label>
            <input
              type="text"
              placeholder="Cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Local</label>
            <input
              type="text"
              placeholder="Cidade — UF"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-6">
          <Plus className="h-4 w-4" />
          {loading ? "Salvando..." : "Criar obra"}
        </button>
      </form>

      <div className="card card-body">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Obras cadastradas
        </h2>

        {obras.length === 0 ? (
          <EmptyState title="Nenhuma obra cadastrada" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cliente</th>
                  <th>Local</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {obras.map((obra) => (
                  <tr key={obra.id}>
                    <td className="font-medium text-slate-900">{obra.nome}</td>
                    <td>{obra.cliente}</td>
                    <td>{obra.local}</td>
                    <td>
                      <StatusBadge value={obra.status} />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deletarObra(obra.id)}
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
