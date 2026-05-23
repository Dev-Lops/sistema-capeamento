import { useState } from "react";

import api from "../services/api";

function Login() {

  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  async function handleLogin(
    event: React.FormEvent
  ) {

    event.preventDefault();

    try {

      const response = await api.post(
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

      const token = response.data.access_token;

      localStorage.setItem(
        "token",
        token
      );

      window.location.href = "/dashboard";

      // console.log(token);

    } catch (error) {

      console.error(error);

      alert("Erro no login");
    }
  }

  return (
    <div>

      <h1>Login</h1>

      <form onSubmit={handleLogin}>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
          />
        </div>

        <button type="submit">
          Entrar
        </button>

      </form>

    </div>
  );
}

export default Login;