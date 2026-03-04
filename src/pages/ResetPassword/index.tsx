import React from "react";
import { useSearchParams } from "react-router-dom";
import { ResetPasswordForm } from "./components";
import {
  BrowserHeader,
  DarkModeToggle,
  LeftPanel,
  PageContainer,
} from "../../components";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleResetPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!token || !email) {
      setErrorMessage("Link inválido. Solicite uma nova recuperação de senha.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") || "");
    const passwordConfirmation = String(
      formData.get("password_confirmation") || "",
    );

    if (password !== passwordConfirmation) {
      setErrorMessage("A confirmação de senha não confere.");
      setSuccessMessage(null);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccessMessage(response.message || "Senha redefinida com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível redefinir a senha.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (!token || !email) {
      setErrorMessage("Link inválido. Solicite uma nova recuperação de senha.");
      return;
    }

    setErrorMessage(null);
  }, [email, token]);

  return (
    <>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24;
        }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #F0F4F8;
        }
        .browser-frame {
          box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.12), 0 30px 60px -30px rgba(0, 0, 0, 0.15);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-0 sm:p-2 md:p-4">
        <PageContainer size="compact">
          <BrowserHeader />
          <div className="flex flex-1 min-h-0 flex-col md:flex-row">
            <LeftPanel
              title="Atualize sua"
              titleHighlight="senha"
              description="Estamos quase lá. Defina sua nova senha para voltar aos estudos."
              cardIcon="lock_reset"
              cardTitle="Acesso seguro"
              cardDescription="Sua conta continua protegida durante todo o processo."
            />
            <ResetPasswordForm
              token={token}
              email={email}
              onSubmit={handleResetPasswordSubmit}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              successMessage={successMessage}
            />
          </div>
        </PageContainer>
      </div>

      <DarkModeToggle />
    </>
  );
}

export default ResetPassword;