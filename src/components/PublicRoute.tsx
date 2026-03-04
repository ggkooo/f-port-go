import { Navigate } from "react-router-dom";
import { isSessionValid } from "../services/session";

interface PublicRouteProps {
  element: React.ReactElement;
}

export function PublicRoute({ element }: PublicRouteProps) {
  return isSessionValid() ? <Navigate to="/" replace /> : element;
}
