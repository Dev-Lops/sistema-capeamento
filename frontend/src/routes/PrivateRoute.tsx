import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

function PrivateRoute({
  children,
}: Props) {

  const token =
    localStorage.getItem("token");

  if (!token) {

    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;