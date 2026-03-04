import { PasswordInput } from "../../../components";
import { useNavigate } from "react-router-dom";

interface ResetPasswordFormProps {
  token: string;
  email: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
}

export function ResetPasswordForm({
  token,
  email,
  onSubmit,
  isSubmitting = false,
  errorMessage,
  successMessage,
}: ResetPasswordFormProps) {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <div className="w-full md:w-1/2 p-6 md:p-10 xl:p-14 flex flex-col justify-center bg-white dark:bg-neutral-900 h-full">
      <div className="max-w-sm mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-3">
            Redefinir senha
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            Defina uma nova senha para continuar no PortGO.
          </p>
        </header>

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

          <div className="group">
            <label
              htmlFor="email"
              className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2.5 ml-1"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              readOnly
              className="w-full px-6 py-4 bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-2xl outline-none transition-all dark:text-white text-base placeholder:text-neutral-400"
            />
          </div>

          <input type="hidden" id="token" name="token" value={token} readOnly />

          <PasswordInput id="password" placeholder="••••••••" />
          <PasswordInput
            id="password_confirmation"
            label="Confirme sua senha"
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={isSubmitting || !token || !email}
            className="w-full bg-[#D4EAFC] hover:bg-[#C2E2FF] dark:bg-blue-500 dark:hover:bg-blue-400 text-blue-900 dark:text-white font-extrabold py-4 rounded-2xl shadow-sm transition-all active:scale-[0.98] mt-3 flex items-center justify-center gap-3 group"
          >
            <span className="text-lg">
              {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
            </span>
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-1.5">
              arrow_right_alt
            </span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-block text-neutral-500 dark:text-neutral-400 font-bold text-base hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            Voltar para o Login
          </button>
        </div>
      </div>
    </div>
  );
}