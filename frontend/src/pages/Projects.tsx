import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import toast from "react-hot-toast";

import api from "../services/api";

import type { Project } from "../types/project";


function Projects() {

  /*
  ===================================
  STATES
  ===================================
  */

  const [nome, setNome] =
    useState("");

  const [descricao,
    setDescricao] =
      useState("");

  const [loading,
    setLoading] =
      useState(false);

  const [projects,
    setProjects] =
      useState<Project[]>([]);


  /*
  ===================================
  LOAD PROJECTS
  ===================================
  */

  async function carregarProjetos() {

    try {

      const response =
        await api.get("/projects");

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
  CREATE PROJECT
  ===================================
  */

  async function criarProjeto(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    try {

      setLoading(true);

      await api.post(
        "/projects",
        {
          nome,
          descricao,
        }
      );

      toast.success(
        "Obra criada"
      );

      setNome("");

      setDescricao("");

      await carregarProjetos();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao criar obra"
      );

    } finally {

      setLoading(false);
    }
  }


  /*
  ===================================
  INIT
  ===================================
  */

  useEffect(() => {

    void carregarProjetos();

  }, []);


  /*
  ===================================
  UI
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
        Obras
      </h1>


      {/* FORM */}

      <form
        onSubmit={criarProjeto}
        className="
          bg-white
          p-8
          rounded-2xl
          shadow
          max-w-2xl
        "
      >

        <div className="mb-4">

          <label>
            Nome da obra
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
          />

        </div>


        <div className="mb-6">

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
              rounded
              mt-2
            "
          />

        </div>


        <button
          type="submit"
          disabled={loading}
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded-xl
          "
        >

          {
            loading
              ? "Salvando..."
              : "Criar obra"
          }

        </button>

      </form>


      {/* TABLE */}

      <div
        className="
          bg-white
          p-8
          rounded-2xl
          shadow
          mt-10
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Obras cadastradas
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left pb-3">
                Nome
              </th>

              <th className="text-left pb-3">
                Descrição
              </th>

            </tr>

          </thead>

          <tbody>

            {
              projects.map(
                (project) => (

                  <tr
                    key={project.id}
                    className="border-b"
                  >

                    <td className="py-4">

                      {project.nome}

                    </td>

                    <td className="py-4">

                      {project.descricao}

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

export default Projects;