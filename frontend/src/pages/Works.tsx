import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import toast from "react-hot-toast";


type Work = {

  id: number;

  nome: string;
};


function Works() {

  const [nome, setNome] =
    useState("");

  const [works, setWorks] =
    useState<Work[]>([]);


  /*
  ================================
  CARREGAR OBRAS
  ================================
  */

  async function carregarObras() {

    try {

      const response =
        await api.get("/works");

      setWorks(response.data);

    } catch (error) {

      console.error(error);
    }
  }


  useEffect(() => {

    void carregarObras();

  }, []);


  /*
  ================================
  CRIAR
  ================================
  */

  async function criarObra() {

    try {

      await api.post("/works", {
        nome,
      });

      toast.success(
        "Obra criada"
      );

      setNome("");

      await carregarObras();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao criar obra"
      );
    }
  }


  /*
  ================================
  DELETAR
  ================================
  */

  async function deletarObra(
    id: number
  ) {

    try {

      await api.delete(
        `/works/${id}`
      );

      toast.success(
        "Obra removida"
      );

      await carregarObras();

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
        Obras
      </h1>


      <div
        className="
          bg-white
          p-8
          rounded-xl
          shadow
          mb-10
          max-w-xl
        "
      >

        <input
          type="text"
          placeholder="Nome da obra"
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

        <button
          onClick={criarObra}
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded
          "
        >
          Criar obra
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
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {works.map((work) => (

              <tr
                key={work.id}
                className="border-b"
              >

                <td className="py-4">
                  {work.nome}
                </td>

                <td className="py-4">

                  <button
                    onClick={() =>
                      deletarObra(
                        work.id
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

export default Works;