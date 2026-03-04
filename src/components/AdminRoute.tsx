import { Navigate } from "react-router-dom";
import { getSession, isSessionValid } from "../services/session";

interface AdminRouteProps {
  element: React.ReactElement;
}

export function AdminRoute({ element }: AdminRouteProps) {
  if (!isSessionValid()) {
    return <Navigate to="/login" replace />;
  }

  const session = getSession();
  if (!session?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return element;
}