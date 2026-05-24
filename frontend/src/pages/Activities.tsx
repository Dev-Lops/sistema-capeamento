import {
  useEffect,
  useState,
} from "react";

import type {FormEvent,} from "react";

import toast from "react-hot-toast";

import api from "../services/api";

import type { Activity } from "../types/activity";

import {
  useAuth
} from "../context/AuthContext";


function Activities() {

  const { user } = useAuth();

  const isAdmin =
  user?.role === "admin";

const isPlanner =
  user?.role === "planner";

// const isOperador =
//   user?.role === "operador";

const podeCriar =
  isAdmin || isPlanner;

const podeEditar =
  isAdmin || isPlanner;

const podeExcluir =
  isAdmin;
  /*
  ===================================
  ESTADOS DO FORMULÁRIO
  ===================================
  */

  const [titulo,
    setTitulo] = useState("");

  const [descricao,
    setDescricao] = useState("");

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

  const [loading,
  setLoading] =
    useState(false);

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
  LISTA DE ATIVIDADES
  ===================================
  */

  const [activities,
    setActivities] =
      useState<Activity[]>([]);


  /*
  ===================================
  CONTROLE DE EDIÇÃO
  ===================================

  null = criando

  número = editando
  */

  const [editingId,
    setEditingId] =
      useState<number | null>(
        null
      );


  /*
  ===================================
  BUSCAR ATIVIDADES
  ===================================
  */

  async function carregarAtividades() {

    try {

      const response =
        await api.get("/activities");

      setActivities(
        response.data
      );

    } catch (error) {

      console.error(error);
    }
  }


  /*
  ===================================
  EXECUTA AO ABRIR PÁGINA
  ===================================
  */

  useEffect(() => {

    void carregarAtividades();

  }, []);


  /*
  ===================================
  LIMPAR FORMULÁRIO
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
  }


  /*
  ===================================
  CRIAR ATIVIDADE
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
  PREENCHER FORMULÁRIO
  PARA EDIÇÃO
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

    setStatus(activity.status);

    setPrioridade(
      activity.prioridade
    );

    setResponsavel(
      activity.responsavel
    );

    setObra(activity.obra);

    setDataInicio(
      activity.data_inicio || ""
    );

    setDataFim(
      activity.data_fim || ""
    );
  }


  /*
  ===================================
  ATUALIZAR ATIVIDADE
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

      toast.error(
  "Erro ao excluir"
);
    }
  }

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

        activity.responsavel
          .toLowerCase()
          .includes(
            busca.toLowerCase()
          )

        ||

        activity.obra
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
  INTERFACE
  ===================================
  */

  return (


    <div className="p-10">



      <h1
        className="
          text-3xl
          font-bold
          mb-8
        "
      >
        Atividades
      </h1>

      <p className="text-gray-500 mb-6">
  Perfil:
  <strong className="ml-2">
    {user?.role}
  </strong>
</p>


      {/* FORMULÁRIO */}
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
        rounded-xl
        shadow
        max-w-2xl
      "
    >

        {/* TÍTULO */}

        <div className="mb-4">

          <label>Título</label>

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
              rounded
              mt-2
            "
          />

        </div>


        {/* DESCRIÇÃO */}

        <div className="mb-4">

          <label>Descrição</label>

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
              rounded
              mt-2
            "
          />

        </div>


        {/* STATUS */}

        <div className="mb-4">

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
              rounded
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


        {/* PRIORIDADE */}

        <div className="mb-4">

          <label>Prioridade</label>

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
              rounded
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


        {/* RESPONSÁVEL */}

        <div className="mb-4">

          <label>Responsável</label>

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
              rounded
              mt-2
            "
          />

        </div>


        {/* OBRA */}

        <div className="mb-4">

          <label>Obra</label>

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
              rounded
              mt-2
            "
          />

        </div>


        {/* DATAS */}

        <div className="mb-4">

          <label>Data início</label>

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
              rounded
              mt-2
            "
          />

        </div>


        <div className="mb-6">

          <label>Data fim</label>

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
              rounded
              mt-2
            "
          />

        </div>


        {/* BOTÕES */}

        <button
          type="submit"
          disabled={loading}
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded
            hover:bg-blue-700
            disabled:opacity-50
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
                ml-4
                bg-gray-500
                text-white
                px-6
                py-3
                rounded
              "
            >
              Cancelar
            </button>

          )
        }

      </form>
    )}

      {/* TABELA */}

      <div
        className="
          bg-white
          mt-10
          p-8
          rounded-xl
          shadow
        "
      >


         <div
  className="
    flex
    gap-4
    mb-6
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
      border
      p-3
      rounded
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
      rounded
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
      rounded
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
        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Atividades
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left pb-3">
                Título
              </th>

              <th className="text-left pb-3">
                Status
              </th>

              <th className="text-left pb-3">
                Responsável
              </th>

              <th className="text-left pb-3">
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
        rounded
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
        rounded
      "
    >
      Excluir
    </button>

  )
}

                  </td>

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Activities;