import { useState } from "react";

import type { FormEvent } from "react";

import {
  Activity,
  ShieldCheck,
  HardHat,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  /*
  ===================================
  ESTADOS
  ===================================
  */

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [erro, setErro] =
    useState("");


  /*
  ===================================
  LOGIN
  ===================================
  */

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    try {

      setLoading(true);

      setErro("");

      const response =
        await api.post(
          "/auth/login",

          new URLSearchParams({
            username: email,
            password: senha,
          }),

          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },
          }
        );

      const token =
        response.data.access_token;

      await login(token);

      navigate("/dashboard", { replace: true });

    } catch (error) {

      console.error(error);

      setErro(
        "Email ou senha inválidos"
      );

    } finally {

      setLoading(false);
    }
  }


  /*
  ===================================
  INTERFACE
  ===================================
  */

  return (

    <div
      className="
        min-h-screen
        flex
      "
    >

      {/* ===================================
      LADO ESQUERDO
      =================================== */}

      <div
        className="
          hidden
          lg:flex
          flex-col
          justify-between
          w-1/2
          bg-gradient-to-br
          from-slate-900
          via-blue-950
          to-slate-900
          text-white
          p-16
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-4
              mb-10
            "
          >

            <div
              className="
                bg-blue-500
                p-4
                rounded-2xl
              "
            >
              <Activity size={40} />
            </div>

            <div>

              <h1
                className="
                  text-4xl
                  font-bold
                "
              >
                Capeamento
              </h1>

              <p
                className="
                  text-blue-200
                "
              >
                Sistema Operacional
              </p>

            </div>

          </div>


          <h2
            className="
              text-5xl
              font-bold
              leading-tight
              mb-8
            "
          >
            Gestão operacional
            inteligente para
            obras industriais
          </h2>

          <p
            className="
              text-lg
              text-slate-300
              max-w-xl
              leading-relaxed
            "
          >
            Controle atividades,
            equipes, prioridades,
            cronogramas e execução
            operacional em um único
            ambiente.
          </p>

        </div>


        {/* FEATURES */}

        <div
          className="
            grid
            grid-cols-2
            gap-6
          "
        >

          <div
            className="
              bg-white/10
              backdrop-blur
              p-6
              rounded-2xl
            "
          >

            <ShieldCheck
              className="mb-4"
            />

            <h3
              className="
                font-semibold
                mb-2
              "
            >
              Segurança
            </h3>

            <p
              className="
                text-sm
                text-slate-300
              "
            >
              Controle de acesso
              por permissões.
            </p>

          </div>


          <div
            className="
              bg-white/10
              backdrop-blur
              p-6
              rounded-2xl
            "
          >

            <HardHat
              className="mb-4"
            />

            <h3
              className="
                font-semibold
                mb-2
              "
            >
              Operação
            </h3>

            <p
              className="
                text-sm
                text-slate-300
              "
            >
              Gestão industrial
              centralizada.
            </p>

          </div>

        </div>

      </div>


      {/* ===================================
      LADO DIREITO
      =================================== */}

      <div
        className="
          flex
          items-center
          justify-center
          w-full
          lg:w-1/2
          bg-slate-100
          p-8
        "
      >

        <div
          className="
            w-full
            max-w-md
            bg-white
            rounded-3xl
            shadow-2xl
            p-10
          "
        >

          <div className="mb-10">

            <h2
              className="
                text-3xl
                font-bold
                text-slate-800
                mb-2
              "
            >
              Bem-vindo
            </h2>

            <p
              className="
                text-slate-500
              "
            >
              Entre na plataforma
              operacional.
            </p>

          </div>


          {/* ERRO */}

          {
            erro && (

              <div
                className="
                  bg-red-100
                  text-red-700
                  p-4
                  rounded-xl
                  mb-6
                "
              >
                {erro}
              </div>

            )
          }


          {/* FORM */}

          <form
            onSubmit={handleLogin}
          >

            <div className="mb-5">

              <label
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Digite seu email"
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-xl
                  p-4
                  mt-2
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>


            <div className="mb-8">

              <label
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Senha
              </label>

              <input
                type="password"
                value={senha}
                onChange={(e) =>
                  setSenha(
                    e.target.value
                  )
                }
                placeholder="Digite sua senha"
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-xl
                  p-4
                  mt-2
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                transition
                text-white
                font-semibold
                py-4
                rounded-xl
                disabled:opacity-50
              "
            >

              {
                loading
                  ? "Entrando..."
                  : "Entrar"
              }

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;