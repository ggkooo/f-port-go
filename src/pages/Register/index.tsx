import React from "react";
import {
  RegisterForm,
} from "./components";
import { BrowserHeader, DarkModeToggle, LeftPanel, PageContainer } from "../../components";
function Register() {
  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submitted", e);
    // TODO: Implementar lógica de registro
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
      
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-2 md:p-4">
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
            />
          </div>
        </PageContainer>
        <DarkModeToggle />
      </div>
    </>
  );
}

export default Register;