import { Navigate } from "react-router-dom";
import { isSessionValid } from "../services/session";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export function ProtectedRoute({ element }: ProtectedRouteProps) {
  return isSessionValid() ? element : <Navigate to="/login" replace />;
}
