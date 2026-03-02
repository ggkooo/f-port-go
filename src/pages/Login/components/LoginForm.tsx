interface LoginFormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onSignUpClick?: () => void;
  onForgotClick?: () => void;
}

import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";

export function LoginForm({
  onSubmit,
  onSignUpClick,
  onForgotClick,
}: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <div className="w-full md:w-1/2 p-10 md:p-24 flex flex-col justify-center bg-white dark:bg-neutral-900">
      <div className="max-w-sm mx-auto w-full">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-3">
            Entrar no PortGO
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            Faça login para continuar seus estudos.
          </p>
        </header>

        {/* Form */}
        <form action="#" className="space-y-6" onSubmit={handleSubmit}>
          <EmailInput id="email" placeholder="seu@email.com" />
          <PasswordInput
            id="password"
            placeholder="••••••••"
            onForgotClick={onForgotClick}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#D4EAFC] hover:bg-[#C2E2FF] text-blue-900 font-extrabold py-5 rounded-2xl shadow-sm transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 group"
          >
            <span className="text-lg">Entrar</span>
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-1.5">
              arrow_right_alt
            </span>
          </button>
        </form>

        {/* Sign Up Section */}
        <div className="mt-12 text-center">
          <p className="text-neutral-500 dark:text-neutral-400 font-semibold mb-2">
            Novo no PortGO?
          </p>
          <button
            type="button"
            onClick={onSignUpClick}
            className="inline-block text-neutral-900 dark:text-white font-extrabold text-lg relative group transition-colors"
          >
            Criar Conta
            <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-accent-green/40 group-hover:bg-accent-green/70 transition-all rounded-full -z-10"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
