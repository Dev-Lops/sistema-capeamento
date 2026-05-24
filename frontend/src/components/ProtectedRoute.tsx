import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import LoadingPage from "./ui/LoadingPage";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
