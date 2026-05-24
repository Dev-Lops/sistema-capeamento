import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "../services/api";


/*
===================================
TIPAGEM DO USUÁRIO
===================================
*/

type User = {
  id: number;
  nome: string;
  email: string;
  role: string;
};


/*
===================================
TIPAGEM DO CONTEXTO
===================================
*/

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => void;
};


/*
===================================
CRIANDO CONTEXTO
===================================
*/

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );


/*
===================================
PROVIDER
===================================
*/

type Props = {
  children: ReactNode;
};

export function AuthProvider({
  children
}: Props) {

  const [user,
    setUser] =
      useState<User | null>(
        null
      );

  const [loading,
    setLoading] =
      useState(true);


  /*
  ===================================
  CARREGAR USUÁRIO
  ===================================
  */

  useEffect(() => {

    async function carregarUsuario() {

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        setLoading(false);

        return;
      }

      try {

        const response =
          await api.get(
            "/auth/me"
          );

        setUser(
          response.data
        );

      } catch (error) {

        console.error(error);

        localStorage.removeItem(
          "token"
        );

      } finally {

        setLoading(false);
      }
    }

    void carregarUsuario();

  }, []);


  /*
  ===================================
  LOGOUT
  ===================================
  */

  function logout() {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );

  setUser(null);

  window.location.href =
    "/login";
}


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}


/*
===================================
HOOK CUSTOMIZADO
===================================
*/

export function useAuth() {

  return useContext(
    AuthContext
  );
}