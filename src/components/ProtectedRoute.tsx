import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getSession, isSessionValid } from "../services/session";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export function ProtectedRoute({ element }: ProtectedRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();
  const isProfileIncomplete = session?.profileCompleted === false;
  const shouldBlockRoute = isProfileIncomplete && location.pathname !== "/settings";

  if (!isSessionValid()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {element}

      {shouldBlockRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
            <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">
              Complete seu perfil
            </h2>
            <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">
              Para continuar com a melhor experiência no app, finalize os dados do seu perfil.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  navigate("/settings", { replace: true });
                }}
                className="rounded-xl bg-[#D4EAFC] px-4 py-2.5 text-sm font-extrabold text-blue-900 transition-colors hover:bg-[#C2E2FF] dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
              >
                Ir para configurações
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
