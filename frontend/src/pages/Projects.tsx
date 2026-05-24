import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import toast from "react-hot-toast";
import api from "../services/api";
import type { Project } from "../types/project";

import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

export default function Projects() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  async function carregarProjetos() {
    try {
      const response = await api.get<Project[]>("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar projetos");
    }
  }

  useEffect(() => {
    void carregarProjetos();
  }, []);

  async function criarProjeto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      await api.post("/projects", { nome, descricao });
      toast.success("Projeto criado");
      setNome("");
      setDescricao("");
      await carregarProjetos();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar projeto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="Projetos"
        description="Projetos de planejamento vinculados às atividades"
      />

      <form onSubmit={criarProjeto} className="card card-body mb-8 max-w-xl">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Novo projeto
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label-field">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="textarea-field"
              rows={3}
            />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-6">
          <Plus className="h-4 w-4" />
          {loading ? "Salvando..." : "Criar projeto"}
        </button>
      </form>

      <div className="card card-body">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Projetos cadastrados
        </h2>

        {projects.length === 0 ? (
          <EmptyState title="Nenhum projeto cadastrado" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="font-medium text-slate-900">
                      {project.nome}
                    </td>
                    <td className="text-slate-600">
                      {project.descricao || "—"}
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
