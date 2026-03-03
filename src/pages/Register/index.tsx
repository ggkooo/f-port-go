import React from "react";
import {
  RegisterLeftPanel,
  RegisterForm,
  RegisterContainer,
} from "./components";
import { BrowserHeader, DarkModeToggle } from "../../components";
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
      
      <div className="min-h-screen flex items-center justify-center p-4 md:p-12">
        <RegisterContainer>
          <BrowserHeader url="portgo.com.br/cadastro" />
          <div className="flex flex-col md:flex-row min-h-[700px]">
            <RegisterLeftPanel />
            <RegisterForm
              onSubmit={handleRegisterSubmit}
            />
          </div>
        </RegisterContainer>
        <DarkModeToggle />
      </div>
    </>
  );
}

export default Register;