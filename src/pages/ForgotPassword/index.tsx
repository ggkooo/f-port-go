import React from "react";
import {
  ForgotPasswordForm,
} from "./components";
import { BrowserHeader, DarkModeToggle, LeftPanel, PageContainer } from "../../components";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleForgotPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await forgotPassword({ email });
      setSuccessMessage(
        response.message || "Se o e-mail existir, enviaremos um link de redefinição.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o link de recuperação.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              title="Recupere sua"
              titleHighlight="senha"
              description="Não se preocupe, acontece com os melhores! Vamos te ajudar a voltar aos estudos."
              cardIcon="sentiment_satisfied"
              cardTitle="Tudo sob controle!"
              cardDescription="Sua conta e progresso estão seguros conosco."
            />
            <ForgotPasswordForm
              onSubmit={handleForgotPasswordSubmit}
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

export default ForgotPassword;