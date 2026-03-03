import { NameInput, EmailInput, PasswordInput } from "../../../components";
import { useNavigate } from "react-router-dom";

interface RegisterFormProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
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
            Cadastre-se no PortGO
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">
            Preencha os campos abaixo para começar.
          </p>
        </header>

        {/* Form */}
        <form action="#" className="space-y-5" onSubmit={handleSubmit}>
          <NameInput id="name" placeholder="Como quer ser chamado?" />
          <EmailInput id="email" placeholder="seu@email.com" />
          <PasswordInput id="password" placeholder="••••••••" />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#D4EAFC] hover:bg-[#C2E2FF] dark:bg-blue-500 dark:hover:bg-blue-400 text-blue-900 dark:text-white font-extrabold py-4 rounded-2xl shadow-sm transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 group"
          >
            <span className="text-lg">Criar Conta</span>
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-1.5">
              arrow_right_alt
            </span>
          </button>
        </form>

        {/* Login Section */}
        <div className="mt-7 text-center">
          <p className="text-neutral-500 dark:text-neutral-400 font-semibold mb-2">
            Já tem uma conta?
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-block text-neutral-900 dark:text-white font-extrabold text-lg relative group transition-colors"
          >
            Entrar
            <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-blue-400/30 group-hover:bg-blue-400/50 transition-all rounded-full -z-10"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
