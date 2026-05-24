import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {

  /*
  ============================
  TOKEN
  ============================
  */

  const token =
    localStorage.getItem("token");

  /*
  ============================
  USUÁRIO
  ============================
  */

  const userString =
    localStorage.getItem("user");

  const user =
    userString
      ? JSON.parse(userString)
      : null;

  /*
  ============================
  SEM TOKEN
  ============================
  */

  if (!token) {

    return (
      <Navigate to="/login" />
    );
  }

  /*
  ============================
  VERIFICA ROLE
  ============================
  */

  if (
    allowedRoles &&
    !allowedRoles.includes(user?.role)
  ) {

    return (
      <Navigate to="/dashboard" />
    );
  }

  /*
  ============================
  ACESSO LIBERADO
  ============================
  */

  return children;
}

export default ProtectedRoute;