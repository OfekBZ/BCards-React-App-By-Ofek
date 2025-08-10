import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function BusinessRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!(user.isBusiness || user.isAdmin)) return <Navigate to="/" replace />;
  return children;}

  