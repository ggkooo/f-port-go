import React from "react";
import { useNavigate } from "react-router-dom";
import {
  RegisterForm,
} from "./components";
import { BrowserHeader, DarkModeToggle, LeftPanel, PageContainer } from "../../components";
import { register } from "../../services/auth";
function Register() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get("first_name") || "").trim();
    const lastName = String(formData.get("last_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
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
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccessMessage("Conta criada com sucesso.");
      navigate("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar a conta.";
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
              title="Crie sua"
              titleHighlight="conta"
              description="Comece sua jornada no aprendizado de Português hoje mesmo!"
              variant="register"
              cardIcon="group"
              cardTitle="Junte-se a +1000 alunos"
              cardDescription="Aprenda com a melhor comunidade."
            />
            <RegisterForm
              onSubmit={handleRegisterSubmit}
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

export default Register;