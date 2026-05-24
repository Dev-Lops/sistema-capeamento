import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import toast from "react-hot-toast";

import api from "../services/api";

import type {
  Activity,
} from "../types/activity";

import type {
  Project,
} from "../types/project";

import type {
  Team,
} from "../types/team";

import type {
  Obra,
} from "../types/obra";

import type {
  UserOption,
} from "../types/user";

import {
  useAuth,
} from "../context/AuthContext";

function Activities() {

  const { user } = useAuth();

  /*
  ===================================
  PERMISSÕES
  ===================================
  */

  const isAdmin =
    user?.role === "admin";

  const isPlanner =
    user?.role === "planner";

  const podeCriar =
    isAdmin || isPlanner;

  const podeEditar =
    isAdmin || isPlanner;

  const podeExcluir =
    isAdmin;

  /*
  ===================================
  ESTADOS FORM
  ===================================
  */

  const [titulo,
    setTitulo] =
    useState("");

  const [descricao,
    setDescricao] =
    useState("");

  const [status,
    setStatus] =
    useState("planejado");

  const [prioridade,
    setPrioridade] =
    useState("media");

  const [responsavelId,
    setResponsavelId] =
    useState("");

  const [obraId,
    setObraId] =
    useState("");

  const [dataInicio,
    setDataInicio] =
    useState("");

  const [dataFim,
    setDataFim] =
    useState("");

  const [projectId,
    setProjectId] =
    useState("");

  const [teamId,
    setTeamId] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  /*
  ===================================
  FILTROS
  ===================================
  */

  const [busca,
    setBusca] =
    useState("");

  const [filtroStatus,
    setFiltroStatus] =
    useState("");

  const [filtroPrioridade,
    setFiltroPrioridade] =
    useState("");

  /*
  ===================================
  LISTAS
  ===================================
  */

  const [activities,
    setActivities] =
    useState<Activity[]>([]);

  const [projects,
    setProjects] =
    useState<Project[]>([]);

  const [teams,
    setTeams] =
    useState<Team[]>([]);

  const [obras,
    setObras] =
    useState<Obra[]>([]);

  const [usuarios,
    setUsuarios] =
    useState<UserOption[]>([]);

  /*
  ===================================
  EDIÇÃO
  ===================================
  */

  const [editingId,
    setEditingId] =
    useState<number | null>(
      null
    );

  /*
  ===================================
  CARREGAR ATIVIDADES
  ===================================
  */

  async function carregarAtividades() {

    try {

      const response =
        await api.get(
          "/activities"
        );

      setActivities(
        response.data
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao carregar atividades"
      );
    }
  }

  /*
  ===================================
  CARREGAR PROJETOS
  ===================================
  */

  async function carregarProjetos() {

    try {

      const response =
        await api.get(
          "/projects"
        );

      setProjects(
        response.data
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao carregar obras"
      );
    }
  }

  /*
  ===================================
  CARREGAR EQUIPES
  ===================================
  */

  async function carregarEquipes() {

    try {

      const response =
        await api.get(
          "/teams"
        );

      setTeams(
        response.data
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao carregar equipes"
      );
    }
  }

  async function carregarObras() {

    try {

      const response =
        await api.get<Obra[]>(
          "/obras"
        );

      setObras(
        response.data
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao carregar obras"
      );
    }
  }

  async function carregarUsuarios() {

    try {

      const response =
        await api.get<UserOption[]>(
          "/users"
        );

      setUsuarios(
        response.data
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao carregar usuários"
      );
    }
  }

  function montarPayload() {
    return {
      titulo,
      descricao,
      status,
      prioridade,
      data_inicio: dataInicio,
      data_fim: dataFim,
      obra_id: obraId ? Number(obraId) : null,
      project_id: projectId ? Number(projectId) : null,
      team_id: teamId ? Number(teamId) : null,
      responsavel_id: responsavelId
        ? Number(responsavelId)
        : null,
    };
  }

  /*
  ===================================
  INIT
  ===================================
  */

  useEffect(() => {

    void carregarAtividades();

    void carregarProjetos();

    void carregarEquipes();

    void carregarObras();

    void carregarUsuarios();

  }, []);

  /*
  ===================================
  LIMPAR FORM
  ===================================
  */

  function limparFormulario() {

    setEditingId(null);

    setTitulo("");

    setDescricao("");

    setStatus("planejado");

    setPrioridade("media");

    setResponsavelId("");

    setObraId("");

    setDataInicio("");

    setDataFim("");

    setProjectId("");

    setTeamId("");
  }

  /*
  ===================================
  CRIAR
  ===================================
  */

  async function criarAtividade(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    try {

      setLoading(true);

      await api.post(
        "/activities",
        montarPayload()
      );

      toast.success(
        "Atividade criada"
      );

      limparFormulario();

      await carregarAtividades();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao criar atividade"
      );

    } finally {

      setLoading(false);
    }
  }

  /*
  ===================================
  EDITAR
  ===================================
  */

  function editarAtividade(
    activity: Activity
  ) {

    if (!podeEditar) {
      return;
    }

    setEditingId(
      activity.id
    );

    setTitulo(
      activity.titulo
    );

    setDescricao(
      activity.descricao
    );

    setStatus(
      activity.status
    );

    setPrioridade(
      activity.prioridade
    );

    setResponsavelId(
      String(
        activity.responsavel_id || ""
      )
    );

    setObraId(
      String(
        activity.obra_id || ""
      )
    );

    setDataInicio(
      activity.data_inicio || ""
    );

    setDataFim(
      activity.data_fim || ""
    );

    setProjectId(
      String(
        activity.project_id || ""
      )
    );

    setTeamId(
      String(
        activity.team_id || ""
      )
    );
  }

  /*
  ===================================
  ATUALIZAR
  ===================================
  */

  async function atualizarAtividade(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    try {

      setLoading(true);

      await api.put(
        `/activities/${editingId}`,
        montarPayload()
      );

      toast.success(
        "Atividade atualizada"
      );

      limparFormulario();

      await carregarAtividades();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao atualizar atividade"
      );

    } finally {

      setLoading(false);
    }
  }

  /*
  ===================================
  DELETAR
  ===================================
  */

  async function deletarAtividade(
    id: number
  ) {

    if (!podeExcluir) {
      return;
    }

    const confirmar =
      confirm(
        "Deseja excluir atividade?"
      );

    if (!confirmar) {
      return;
    }

    try {

      await api.delete(
        `/activities/${id}`
      );

      toast.success(
        "Atividade removida"
      );

      void carregarAtividades();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao excluir atividade"
      );
    }
  }

  /*
  ===================================
  FILTROS
  ===================================
  */

  const filteredActivities =
    activities.filter(
      (activity) => {

        const matchBusca =

          activity.titulo
            .toLowerCase()
            .includes(
              busca.toLowerCase()
            )

          ||

          (activity.responsavel?.nome || "")
            .toLowerCase()
            .includes(
              busca.toLowerCase()
            )

          ||

          (activity.obra?.nome || "")
            .toLowerCase()
            .includes(
              busca.toLowerCase()
            );

        const matchStatus =

          filtroStatus === ""

          ||

          activity.status ===
          filtroStatus;

        const matchPrioridade =

          filtroPrioridade === ""

          ||

          activity.prioridade ===
          filtroPrioridade;

        return (
          matchBusca
          &&
          matchStatus
          &&
          matchPrioridade
        );
      }
    );

  /*
  ===================================
  RENDER
  ===================================
  */

  return (

    <div className="p-10">

      <div className="mb-10">

        <h1
          className="
            text-4xl
            font-bold
            text-white
          "
        >
          Gestão de Atividades
        </h1>

        <p
          className="
            text-gray-400
            mt-2
          "
        >
          Controle operacional das obras
        </p>

      </div>

      {
        podeCriar && (

          <form
            onSubmit={
              editingId
                ? atualizarAtividade
                : criarAtividade
            }
            className="
              bg-[#111827]
              border
              border-white/10
              rounded-2xl
              p-8
              mb-10
              shadow-2xl
            "
          >

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              "
            >

              <div>

                <label
                  className="
                    text-gray-300
                    text-sm
                  "
                >
                  Título
                </label>

                <input
                  type="text"
                  value={titulo}
                  onChange={(e) =>
                    setTitulo(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-[#1F2937]
                    border
                    border-white/10
                    rounded-xl
                    p-4
                    text-white
                  "
                />

              </div>

              <div>

                <label
                  className="
                    text-gray-300
                    text-sm
                  "
                >
                  Responsável
                </label>

                <select
                  value={responsavelId}
                  onChange={(e) =>
                    setResponsavelId(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-[#1F2937]
                    border
                    border-white/10
                    rounded-xl
                    p-4
                    text-white
                  "
                >
                  <option value="">
                    Selecione
                  </option>
                  {usuarios.map((usuario) => (
                    <option
                      key={usuario.id}
                      value={usuario.id}
                    >
                      {usuario.nome}
                    </option>
                  ))}
                </select>

              </div>

            </div>

            <div className="mt-6">

              <label
                className="
                  text-gray-300
                  text-sm
                "
              >
                Descrição
              </label>

              <textarea
                value={descricao}
                onChange={(e) =>
                  setDescricao(
                    e.target.value
                  )
                }
                rows={4}
                className="
                  w-full
                  mt-2
                  bg-[#1F2937]
                  border
                  border-white/10
                  rounded-xl
                  p-4
                  text-white
                "
              />

            </div>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-4
                gap-6
                mt-6
              "
            >

              <div>

                <label
                  className="
                    text-gray-300
                    text-sm
                  "
                >
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-[#1F2937]
                    border
                    border-white/10
                    rounded-xl
                    p-4
                    text-white
                  "
                >

                  <option value="planejado">
                    Planejado
                  </option>

                  <option value="em_execucao">
                    Em execução
                  </option>

                  <option value="concluido">
                    Concluído
                  </option>

                </select>

              </div>

              <div>

                <label
                  className="
                    text-gray-300
                    text-sm
                  "
                >
                  Prioridade
                </label>

                <select
                  value={prioridade}
                  onChange={(e) =>
                    setPrioridade(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-[#1F2937]
                    border
                    border-white/10
                    rounded-xl
                    p-4
                    text-white
                  "
                >

                  <option value="baixa">
                    Baixa
                  </option>

                  <option value="media">
                    Média
                  </option>

                  <option value="alta">
                    Alta
                  </option>

                </select>

              </div>

              <div>

                <label
                  className="
                    text-gray-300
                    text-sm
                  "
                >
                  Obra
                </label>

                <select
                  value={obraId}
                  onChange={(e) =>
                    setObraId(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-[#1F2937]
                    border
                    border-white/10
                    rounded-xl
                    p-4
                    text-white
                  "
                >
                  <option value="">
                    Selecione
                  </option>
                  {obras.map((obra) => (
                    <option
                      key={obra.id}
                      value={obra.id}
                    >
                      {obra.nome}
                    </option>
                  ))}
                </select>

              </div>

              <div>

                <label
                  className="
                    text-gray-300
                    text-sm
                  "
                >
                  Projeto
                </label>

                <select
                  value={projectId}
                  onChange={(e) =>
                    setProjectId(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-[#1F2937]
                    border
                    border-white/10
                    rounded-xl
                    p-4
                    text-white
                  "
                >
                  <option value="">
                    Selecione
                  </option>
                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.nome}
                    </option>
                  ))}
                </select>

              </div>

              <div>

                <label
                  className="
                    text-gray-300
                    text-sm
                  "
                >
                  Equipe
                </label>

                <select
                  value={teamId}
                  onChange={(e) =>
                    setTeamId(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-[#1F2937]
                    border
                    border-white/10
                    rounded-xl
                    p-4
                    text-white
                  "
                >

                  <option value="">
                    Selecione
                  </option>

                  {
                    teams.map(
                      (team) => (

                        <option
                          key={team.id}
                          value={team.id}
                        >
                          {team.nome}
                        </option>

                      )
                    )
                  }

                </select>

              </div>

            </div>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
                mt-6
              "
            >

              <div>

                <label
                  className="
                    text-gray-300
                    text-sm
                  "
                >
                  Data início
                </label>

                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) =>
                    setDataInicio(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-[#1F2937]
                    border
                    border-white/10
                    rounded-xl
                    p-4
                    text-white
                  "
                />

              </div>

              <div>

                <label
                  className="
                    text-gray-300
                    text-sm
                  "
                >
                  Data fim
                </label>

                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) =>
                    setDataFim(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    mt-2
                    bg-[#1F2937]
                    border
                    border-white/10
                    rounded-xl
                    p-4
                    text-white
                  "
                />

              </div>

            </div>

            <div className="mt-8 flex gap-4">

              <button
                type="submit"
                disabled={loading}
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  transition-all
                  text-white
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                "
              >

                {
                  loading
                    ? "Salvando..."
                    : editingId
                      ? "Atualizar atividade"
                      : "Criar atividade"
                }

              </button>

              {
                editingId && (

                  <button
                    type="button"
                    onClick={
                      limparFormulario
                    }
                    className="
                      bg-gray-600
                      hover:bg-gray-700
                      transition-all
                      text-white
                      px-8
                      py-4
                      rounded-xl
                      font-semibold
                    "
                  >
                    Cancelar
                  </button>

                )
              }

            </div>

          </form>

        )
      }

      <div
        className="
          bg-[#111827]
          border
          border-white/10
          rounded-2xl
          p-8
          shadow-2xl
        "
      >

        <div
          className="
            flex
            flex-col
            md:flex-row
            gap-4
            mb-8
          "
        >

          <input
            type="text"
            placeholder="
              Buscar atividade
            "
            value={busca}
            onChange={(e) =>
              setBusca(
                e.target.value
              )
            }
            className="
              flex-1
              bg-[#1F2937]
              border
              border-white/10
              rounded-xl
              p-4
              text-white
            "
          />

          <select
            value={filtroStatus}
            onChange={(e) =>
              setFiltroStatus(
                e.target.value
              )
            }
            className="
              bg-[#1F2937]
              border
              border-white/10
              rounded-xl
              p-4
              text-white
            "
          >

            <option value="">
              Todos status
            </option>

            <option value="planejado">
              Planejado
            </option>

            <option value="em_execucao">
              Em execução
            </option>

            <option value="concluido">
              Concluído
            </option>

          </select>

          <select
            value={filtroPrioridade}
            onChange={(e) =>
              setFiltroPrioridade(
                e.target.value
              )
            }
            className="
              bg-[#1F2937]
              border
              border-white/10
              rounded-xl
              p-4
              text-white
            "
          >

            <option value="">
              Todas prioridades
            </option>

            <option value="baixa">
              Baixa
            </option>

            <option value="media">
              Média
            </option>

            <option value="alta">
              Alta
            </option>

          </select>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr
                className="
                  border-b
                  border-white/10
                  text-gray-400
                "
              >

                <th className="text-left pb-4">
                  Título
                </th>

                <th className="text-left pb-4">
                  Status
                </th>

                <th className="text-left pb-4">
                  Prioridade
                </th>

                <th className="text-left pb-4">
                  Responsável
                </th>

                <th className="text-left pb-4">
                  Ações
                </th>

              </tr>

            </thead>

            <tbody>

              {
                filteredActivities.map(
                  (activity) => (

                    <tr
                      key={activity.id}
                      className="
                        border-b
                        border-white/5
                      "
                    >

                      <td
                        className="
                          py-5
                          text-white
                        "
                      >
                        {activity.titulo}
                      </td>

                      <td
                        className="
                          py-5
                          text-gray-300
                        "
                      >
                        {activity.status}
                      </td>

                      <td
                        className="
                          py-5
                          text-gray-300
                        "
                      >
                        {activity.prioridade}
                      </td>

                      <td
                        className="
                          py-5
                          text-gray-300
                        "
                      >
                        {activity.responsavel?.nome ?? "—"}
                      </td>

                      <td className="py-5">

                        {
                          podeEditar && (

                            <button
                              onClick={() =>
                                editarAtividade(
                                  activity
                                )
                              }
                              className="
                                bg-yellow-500
                                hover:bg-yellow-600
                                transition-all
                                text-white
                                px-4
                                py-2
                                rounded-lg
                                mr-3
                              "
                            >
                              Editar
                            </button>

                          )
                        }

                        {
                          podeExcluir && (

                            <button
                              onClick={() =>
                                deletarAtividade(
                                  activity.id
                                )
                              }
                              className="
                                bg-red-600
                                hover:bg-red-700
                                transition-all
                                text-white
                                px-4
                                py-2
                                rounded-lg
                              "
                            >
                              Excluir
                            </button>

                          )
                        }

                      </td>

                    </tr>

                  )
                )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Activities;