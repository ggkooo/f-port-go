import React from "react";
import {
  ForgotPasswordLeftPanel,
  ForgotPasswordForm,
  ForgotPasswordContainer,
} from "./components";
import { BrowserHeader, DarkModeToggle } from "../../components";

function ForgotPassword() {
  const handleForgotPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submitted", e);
    // TODO: Implementar lógica de recuperação de senha
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
        <ForgotPasswordContainer>
          <BrowserHeader url="portgo.com.br/recuperar-senha" />
          <div className="flex flex-1 min-h-0 flex-col md:flex-row">
            <ForgotPasswordLeftPanel />
            <ForgotPasswordForm onSubmit={handleForgotPasswordSubmit} />
          </div>
        </ForgotPasswordContainer>
      </div>

      <DarkModeToggle />
    </>
  );
}

export default ForgotPassword;