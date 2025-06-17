import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function BusinessRoute({ children }: { children: ReactNode }) {
  const user = useSelector((state: RootState) => state.user);

 
  if (!user || !user.isBusiness) {
    return <Navigate to="*" replace />;
  }

  return <>{children}</>;
}
