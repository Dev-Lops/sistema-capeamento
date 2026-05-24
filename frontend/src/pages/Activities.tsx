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

import {
  useAuth,
} from "../context/AuthContext";

function Activities() {

  /*
  ===================================
  AUTH
  ===================================
  */

  const { user } = useAuth();

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

  const [responsavel,
    setResponsavel] =
      useState("");

  const [obra,
    setObra] =
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

  /*
  ===================================
  CONTROLES
  ===================================
  */

  const [loading,
    setLoading] =
      useState(false);

  const [editingId,
    setEditingId] =
      useState<number | null>(
        null
      );

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
  INIT
  ===================================
  */

  useEffect(() => {

    void carregarAtividades();

    void carregarProjetos();

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

    setResponsavel("");

    setObra("");

    setDataInicio("");

    setDataFim("");

    setProjectId("");
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
        {
          titulo,
          descricao,
          status,
          prioridade,
          responsavel,
          obra,
          data_inicio: dataInicio,
          data_fim: dataFim,
          project_id: Number(projectId),
        }
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

    setEditingId(activity.id);

    setTitulo(activity.titulo);

    setDescricao(
      activity.descricao
    );

    setStatus(
      activity.status
    );

    setPrioridade(
      activity.prioridade
    );

    setResponsavel(
      activity.responsavel
    );

    setObra(
      activity.obra
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
  }

  /*
  ===================================
  UPDATE
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
        {
          titulo,
          descricao,
          status,
          prioridade,
          responsavel,
          obra,
          data_inicio: dataInicio,
          data_fim: dataFim,
          project_id: Number(projectId),
        }
      );

      toast.success(
        "Atividade atualizada"
      );

      limparFormulario();

      await carregarAtividades();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao atualizar"
      );

    } finally {

      setLoading(false);
    }
  }

  /*
  ===================================
  DELETE
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

      await carregarAtividades();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao excluir"
      );
    }
  }

  /*
  ===================================
  FILTRO
  ===================================
  */

  const filteredActivities =
    activities.filter(
      (activity) => {

        const matchBusca =

          activity.titulo
            ?.toLowerCase()
            .includes(
              busca.toLowerCase()
            )

          ||

          activity.responsavel
            ?.toLowerCase()
            .includes(
              busca.toLowerCase()
            )

          ||

          activity.obra
            ?.toLowerCase()
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
  UI
  ===================================
  */

  return (

    <div className="p-10">

      <div className="mb-8">

        <h1
          className="
            text-4xl
            font-bold
          "
        >
          Atividades
        </h1>

        <p className="text-gray-500 mt-2">
          Perfil:
          <strong className="ml-2">
            {user?.role}
          </strong>
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
              bg-white
              p-8
              rounded-2xl
              shadow
              mb-10
            "
          >

            <div className="grid grid-cols-2 gap-6">

              <div>

                <label>
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
                    border
                    p-3
                    rounded-lg
                    mt-2
                  "
                />

              </div>

              <div>

                <label>
                  Responsável
                </label>

                <input
                  type="text"
                  value={responsavel}
                  onChange={(e) =>
                    setResponsavel(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    p-3
                    rounded-lg
                    mt-2
                  "
                />

              </div>

            </div>

            <div className="mt-6">

              <label>
                Descrição
              </label>

              <textarea
                value={descricao}
                onChange={(e) =>
                  setDescricao(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  p-3
                  rounded-lg
                  mt-2
                  h-32
                "
              />

            </div>

            <div className="grid grid-cols-4 gap-6 mt-6">

              <div>

                <label>Status</label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    p-3
                    rounded-lg
                    mt-2
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

                <label>
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
                    border
                    p-3
                    rounded-lg
                    mt-2
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

                <label>
                  Obra
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
                    border
                    p-3
                    rounded-lg
                    mt-2
                  "
                >

                  <option value="">
                    Selecione
                  </option>

                  {
                    projects.map(
                      (project) => (

                        <option
                          key={project.id}
                          value={project.id}
                        >
                          {project.nome}
                        </option>
                      )
                    )
                  }

                </select>

              </div>

              <div>

                <label>
                  Obra Texto
                </label>

                <input
                  type="text"
                  value={obra}
                  onChange={(e) =>
                    setObra(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    p-3
                    rounded-lg
                    mt-2
                  "
                />

              </div>

            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">

              <div>

                <label>
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
                    border
                    p-3
                    rounded-lg
                    mt-2
                  "
                />

              </div>

              <div>

                <label>
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
                    border
                    p-3
                    rounded-lg
                    mt-2
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
                  text-white
                  px-6
                  py-3
                  rounded-lg
                  hover:bg-blue-700
                "
              >

                {
                  loading
                    ? "Salvando..."
                    : editingId
                    ? "Atualizar"
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
                      bg-gray-500
                      text-white
                      px-6
                      py-3
                      rounded-lg
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
          bg-white
          rounded-2xl
          shadow
          p-8
        "
      >

        <div
          className="
            flex
            gap-4
            mb-8
          "
        >

          <input
            type="text"
            placeholder="Buscar..."
            value={busca}
            onChange={(e) =>
              setBusca(
                e.target.value
              )
            }
            className="
              border
              p-3
              rounded-lg
              flex-1
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
              border
              p-3
              rounded-lg
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
              border
              p-3
              rounded-lg
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

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-4">
                Título
              </th>

              <th className="text-left py-4">
                Status
              </th>

              <th className="text-left py-4">
                Prioridade
              </th>

              <th className="text-left py-4">
                Responsável
              </th>

              <th className="text-left py-4">
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
                    className="border-b"
                  >

                    <td className="py-4">
                      {activity.titulo}
                    </td>

                    <td className="py-4">
                      {activity.status}
                    </td>

                    <td className="py-4">
                      {activity.prioridade}
                    </td>

                    <td className="py-4">
                      {
                        activity.responsavel
                      }
                    </td>

                    <td className="py-4">

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
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              mr-2
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
                              bg-red-500
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
  );
}
export default Activities;