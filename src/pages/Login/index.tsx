import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LoginForm,
} from "./components";
import { BrowserHeader, DarkModeToggle, LeftPanel, PageContainer } from "../../components";
import { login } from "../../services/auth";
import { saveSession } from "../../services/session";

function Login() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await login({
        email,
        password,
      });

      const {
        uuid,
        email: userEmail,
        token,
        profile_completed: profileCompleted,
      } = response.data;

      saveSession({ uuid, email: userEmail, token, profileCompleted });

      setSuccessMessage("Login realizado com sucesso.");
      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível realizar login.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
              title="Bem-vindo de"
              titleHighlight="volta!"
              description="Estamos felizes em ver você novamente. Pronto para continuar sua jornada no aprendizado de Português?"
            />
            <LoginForm
              onSubmit={handleLoginSubmit}
              onForgotClick={handleForgotPassword}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              successMessage={successMessage}
            />
          </div>
        </PageContainer>
        <DarkModeToggle />
      </div>
    </>
  );
}

export default Login;