interface LoginFormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onForgotClick?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
}

import { EmailInput, PasswordInput } from "../../../components";
import { useNavigate } from "react-router-dom";

export function LoginForm({
  onSubmit,
  onForgotClick,
  isSubmitting = false,
  errorMessage,
  successMessage,
}: LoginFormProps) {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <div className="w-full md:w-1/2 p-6 md:p-10 xl:p-14 flex flex-col justify-center bg-white dark:bg-neutral-900 h-full">
      <div className="max-w-sm mx-auto w-full">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-3">
            Entrar no PortGO
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            Faça login para continuar seus estudos.
          </p>
        </header>

        {/* Form */}
        <form action="#" className="space-y-5" onSubmit={handleSubmit}>
          {errorMessage && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
              {successMessage}
            </p>
          )}

          <EmailInput id="email" placeholder="seu@email.com" />
          <PasswordInput
            id="password"
            placeholder="••••••••"
            onForgotClick={onForgotClick}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#D4EAFC] hover:bg-[#C2E2FF] dark:bg-blue-500 dark:hover:bg-blue-400 text-blue-900 dark:text-white font-extrabold py-4 rounded-2xl shadow-sm transition-all active:scale-[0.98] mt-3 flex items-center justify-center gap-3 group"
          >
            <span className="text-lg">{isSubmitting ? "Entrando..." : "Entrar"}</span>
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-1.5">
              arrow_right_alt
            </span>
          </button>
        </form>

        {/* Sign Up Section */}
        <div className="mt-8 text-center">
          <p className="text-neutral-500 dark:text-neutral-400 font-semibold mb-2">
            Novo no PortGO?
          </p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-block text-neutral-900 dark:text-white font-extrabold text-lg relative group transition-colors"
          >
            Criar Conta
            <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-emerald-400/30 group-hover:bg-emerald-400/50 transition-all rounded-full -z-10"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
