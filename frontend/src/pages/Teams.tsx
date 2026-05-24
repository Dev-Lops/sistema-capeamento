import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import api from "../services/api";

import toast from "react-hot-toast";
import type {Team} from "../types/team.ts";
import type {Company} from "../types/company.ts";


function Teams() {

  /*
  ===================================
  ESTADOS
  ===================================
  */

  const [nome,
    setNome] =
      useState("");

  const [tipo,
    setTipo] =
      useState("propria");

  const [teams,
    setTeams] =
      useState<Team[]>([]);

  const [loading,
    setLoading] =
      useState(false);

  const [companyId, setCompanyId] = useState<number | "">("");
const [companies, setCompanies] = useState<Company[]>([]);


  /*
  ===================================
  CARREGAR EQUIPES
  ===================================
  */

  async function carregarEquipes() {

    try {

      const response =
        await api.get("/teams/");

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

  async function carregarEmpresas() {
  try {
    const response = await api.get("/companies/");
    setCompanies(response.data);
  } catch (error) {
    console.error(error);
    toast.error("Erro ao carregar empresas");
  }
}


  /*
  ===================================
  EXECUTA AO ABRIR
  ===================================
  */

  useEffect(() => {
  void carregarEquipes();
  void carregarEmpresas();
}, []);


  /*
  ===================================
  CRIAR EQUIPE
  ===================================
  */

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


  /*
  ===================================
  DELETAR EQUIPE
  ===================================
  */

  async function deletarEquipe(
    id: number
  ) {

    const confirmar =
      confirm(
        "Deseja remover equipe?"
      );

    if (!confirmar) {
      return;
    }

    try {

      await api.delete(
        `/teams/${id}`
      );

      toast.success(
        "Equipe removida"
      );

      await carregarEquipes();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao remover equipe"
      );
    }
  }


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
        Equipes
      </h1>


      {/* FORMULÁRIO */}

      <form
        onSubmit={criarEquipe}
        className="
          bg-white
          p-8
          rounded-xl
          shadow
          mb-10
          max-w-2xl
        "
      >

        {/* NOME */}

        <div className="mb-4">

          <label>
            Nome da equipe
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) =>
              setNome(
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
            required
          />

        </div>


        {/* TIPO */}

        <div className="mb-4">

          <label>
            Tipo
          </label>

          <select
            value={tipo}
            onChange={(e) =>
              setTipo(
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

            <option value="propria">
              Própria
            </option>

            <option value="terceirizada">
              Terceirizada
            </option>

          </select>

        </div>


        {/* EMPRESA */}

        <div className="mb-6">

          <label>
            Empresa
          </label>
          <select
  value={companyId}
  onChange={(e) =>
    setCompanyId(
      e.target.value === "" ? "" : Number(e.target.value)
    )
  }
  className="w-full border p-3 rounded mt-2"
>
  <option value="">Selecione empresa</option>

  {companies.map((company) => (
    <option key={company.id} value={company.id}>
      {company.nome}
    </option>
  ))}
</select>


        </div>


        {/* BOTÃO */}

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
              : "Criar equipe"
          }

        </button>

      </form>


      {/* TABELA */}

      <div
        className="
          bg-white
          p-8
          rounded-xl
          shadow
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Lista de equipes
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left pb-4">
                Nome
              </th>

              <th className="text-left pb-4">
                Tipo
              </th>

              <th className="text-left pb-4">
                Empresa
              </th>

              <th className="text-left pb-4">
                Status
              </th>

              <th className="text-left pb-4">
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {teams.map((team) => (

              <tr
                key={team.id}
                className="border-b"
              >

                <td className="py-4">
                  {team.nome}
                </td>

                <td className="py-4">
                  {team.tipo}
                </td>

                <td className="py-4">
{team.company?.nome || "-"}                </td>

                <td className="py-4">

                  {
                    team.ativo
                      ? "Ativa"
                      : "Inativa"
                  }

                </td>

                <td className="py-4">

                  <button
                    onClick={() =>
                      deletarEquipe(
                        team.id
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

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Teams;