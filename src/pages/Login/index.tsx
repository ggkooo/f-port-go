import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LoginLeftPanel,
  LoginForm,
  LoginContainer,
} from "./components";
import { BrowserHeader, DarkModeToggle } from "../../components";

function Login() {
  const navigate = useNavigate();

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submitted", e);
    // TODO: Implementar lógica de login
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
      
      <div className="min-h-screen flex items-center justify-center p-4 md:p-12">
        <LoginContainer>
          <BrowserHeader url="portgo.com.br/login" />
          <div className="flex flex-col md:flex-row min-h-[700px]">
            <LoginLeftPanel />
            <LoginForm
              onSubmit={handleLoginSubmit}
              onForgotClick={handleForgotPassword}
            />
          </div>
        </LoginContainer>
        <DarkModeToggle />
      </div>
    </>
  );
}

export default Login;