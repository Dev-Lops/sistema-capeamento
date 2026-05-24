import { useEffect, useState } from "react";

import api from "../services/api";
import toast from "react-hot-toast";

import type { Obra } from "../types/obra";

function Obras() {
  const [nome, setNome] = useState("");
  const [cliente, setCliente] = useState("");
  const [local, setLocal] = useState("");
  const [obras, setObras] = useState<Obra[]>([]);

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

  async function criarObra() {
    if (!nome.trim() || !cliente.trim() || !local.trim()) {
      toast.error("Preencha nome, cliente e local");
      return;
    }

    try {
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
    }
  }

  async function deletarObra(id: number) {
    if (!confirm("Deseja remover esta obra?")) {
      return;
    }

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
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Obras</h1>

      <div className="bg-white p-8 rounded-xl shadow mb-10 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nome da obra"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border p-3 rounded"
          />
          <input
            type="text"
            placeholder="Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full border p-3 rounded"
          />
          <input
            type="text"
            placeholder="Local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="w-full border p-3 rounded"
          />
        </div>

        <button
          onClick={criarObra}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Criar obra
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left pb-4">Nome</th>
              <th className="text-left pb-4">Cliente</th>
              <th className="text-left pb-4">Local</th>
              <th className="text-left pb-4">Status</th>
              <th className="text-left pb-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {obras.map((obra) => (
              <tr key={obra.id} className="border-b">
                <td className="py-4">{obra.nome}</td>
                <td className="py-4">{obra.cliente}</td>
                <td className="py-4">{obra.local}</td>
                <td className="py-4">{obra.status}</td>
                <td className="py-4">
                  <button
                    onClick={() => deletarObra(obra.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
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

export default Obras;
