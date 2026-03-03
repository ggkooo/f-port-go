import { EmailInput } from "../../../components";
import { useNavigate } from "react-router-dom";

interface ForgotPasswordFormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
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
            Esqueceu a senha?
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            Insira seu e-mail cadastrado para receber as instruções de recuperação.
          </p>
        </header>

        {/* Form */}
        <form action="#" className="space-y-5" onSubmit={handleSubmit}>
          <EmailInput id="email" placeholder="seu@email.com" />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#D4EAFC] hover:bg-[#C2E2FF] dark:bg-blue-500 dark:hover:bg-blue-400 text-blue-900 dark:text-white font-extrabold py-4 rounded-2xl shadow-sm transition-all active:scale-[0.98] mt-3 flex items-center justify-center gap-3 group"
          >
            <span className="text-lg">Enviar Link</span>
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-1.5">
              arrow_right_alt
            </span>
          </button>
        </form>

        {/* Back to Login Section */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-block text-neutral-500 dark:text-neutral-400 font-bold text-base hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
            Voltar para o Login
          </button>
        </div>
      </div>
    </div>
  );
}
