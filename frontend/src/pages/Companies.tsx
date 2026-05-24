import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import toast from "react-hot-toast";


type Company = {

  id: number;

  nome: string;

  tipo: string;
};


function Companies() {

  const [nome, setNome] =
    useState("");

  const [tipo, setTipo] =
    useState("propria");

  const [companies,
    setCompanies] =
      useState<Company[]>([]);


  /*
  ================================
  CARREGAR
  ================================
  */

  async function carregarEmpresas() {

    try {

      const response =
        await api.get(
          "/companies"
        );

      setCompanies(
        response.data
      );

    } catch (error) {

      console.error(error);
    }
  }


  useEffect(() => {

    void carregarEmpresas();

  }, []);


  /*
  ================================
  CRIAR
  ================================
  */

  async function criarEmpresa() {

    try {

      await api.post(
        "/companies",
        {
          nome,
          tipo,
        }
      );

      toast.success(
        "Empresa criada"
      );

      setNome("");

      setTipo("propria");

      await carregarEmpresas();

    } catch (error) {

      console.error(error);

      toast.error(
        "Erro ao criar"
      );
    }
  }


  /*
  ================================
  DELETAR
  ================================
  */

  async function deletarEmpresa(
    id: number
  ) {

    try {

      await api.delete(
        `/companies/${id}`
      );

      toast.success(
        "Empresa removida"
      );

      await carregarEmpresas();

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
        Empresas
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
          placeholder="Nome da empresa"
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
            mb-4
          "
        >

          <option value="propria">
            Própria
          </option>

          <option value="terceirizada">
            Terceirizada
          </option>

        </select>


        <button
          onClick={criarEmpresa}
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded
          "
        >
          Criar empresa
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
                Tipo
              </th>

              <th className="text-left pb-4">
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {companies.map(
              (company) => (

              <tr
                key={company.id}
                className="border-b"
              >

                <td className="py-4">
                  {company.nome}
                </td>

                <td className="py-4">
                  {company.tipo}
                </td>

                <td className="py-4">

                  <button
                    onClick={() =>
                      deletarEmpresa(
                        company.id
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

export default Companies;