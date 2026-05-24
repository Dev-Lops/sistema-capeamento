import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import toast from "react-hot-toast";


type Team = {

  id: number;

  nome: string;

  company_id: number;

  work_id: number;
};


type Company = {

  id: number;

  nome: string;
};


type Work = {

  id: number;

  nome: string;
};


function Teams() {

  const [nome, setNome] =
    useState("");

  const [companyId,
    setCompanyId] =
      useState("");

  const [workId,
    setWorkId] =
      useState("");

  const [teams,
    setTeams] =
      useState<Team[]>([]);

  const [companies,
    setCompanies] =
      useState<Company[]>([]);

  const [works,
    setWorks] =
      useState<Work[]>([]);


  /*
  ================================
  CARREGAR DADOS
  ================================
  */

  async function carregarDados() {

    try {

      const [
        teamsResponse,
        companiesResponse,
        worksResponse,
      ] = await Promise.all([

        api.get("/teams"),

        api.get("/companies"),

        api.get("/works"),
      ]);

      setTeams(
        teamsResponse.data
      );

      setCompanies(
        companiesResponse.data
      );

      setWorks(
        worksResponse.data
      );

    } catch (error) {

      console.error(error);
    }
  }


  useEffect(() => {

    void carregarDados();

  }, []);


  /*
  ================================
  CRIAR
  ================================
  */

  async function criarEquipe() {

    try {

      await api.post("/teams", {

        nome,

        company_id:
          Number(companyId),

        work_id:
          Number(workId),
      });

      toast.success(
        "Equipe criada"
      );

      setNome("");

      setCompanyId("");

      setWorkId("");

      await carregarDados();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao criar equipe"
      );
    }
  }


  /*
  ================================
  DELETAR
  ================================
  */

  async function deletarEquipe(
    id: number
  ) {

    try {

      await api.delete(
        `/teams/${id}`
      );

      toast.success(
        "Equipe removida"
      );

      await carregarDados();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao remover"
      );
    }
  }


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


      <div
        className="
          bg-white
          p-8
          rounded-xl
          shadow
          mb-10
          max-w-2xl
        "
      >

        <input
          type="text"
          placeholder="Nome da equipe"
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
            mb-4
          "
        />


        <select
          value={companyId}
          onChange={(e) =>
            setCompanyId(
              e.target.value
            )
          }
          className="
            w-full
            border
            p-3
            rounded
            mb-4
          "
        >

          <option value="">
            Selecione empresa
          </option>

          {companies.map(
            (company) => (

            <option
              key={company.id}
              value={company.id}
            >
              {company.nome}
            </option>

          ))}

        </select>


        <select
          value={workId}
          onChange={(e) =>
            setWorkId(
              e.target.value
            )
          }
          className="
            w-full
            border
            p-3
            rounded
            mb-4
          "
        >

          <option value="">
            Selecione obra
          </option>

          {works.map(
            (work) => (

            <option
              key={work.id}
              value={work.id}
            >
              {work.nome}
            </option>

          ))}

        </select>


        <button
          onClick={criarEquipe}
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded
          "
        >
          Criar equipe
        </button>

      </div>


      <div
        className="
          bg-white
          p-8
          rounded-xl
          shadow
        "
      >

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left pb-4">
                Nome
              </th>

              <th className="text-left pb-4">
                Empresa
              </th>

              <th className="text-left pb-4">
                Obra
              </th>

              <th className="text-left pb-4">
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {teams.map((team) => {

              const company =
                companies.find(
                  (c) =>
                    c.id ===
                    team.company_id
                );

              const work =
                works.find(
                  (w) =>
                    w.id ===
                    team.work_id
                );

              return (

                <tr
                  key={team.id}
                  className="border-b"
                >

                  <td className="py-4">
                    {team.nome}
                  </td>

                  <td className="py-4">
                    {company?.nome}
                  </td>

                  <td className="py-4">
                    {work?.nome}
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

              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Teams;