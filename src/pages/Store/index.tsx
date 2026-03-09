
import { useState, useEffect } from "react";
import { AppLeftSidebar, BrowserHeader, PageContainer, ConfirmationModal } from "../../components";
import { useNavigate } from "react-router-dom";
import {
  StoreMainContent,
  StoreRightPanel,
} from "./components";


function Store() {
  const [modalOpen, setModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    setModalOpen(false);
    navigate("/");
  };

  // Bloqueia scroll do body enquanto a modal estiver aberta
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  return (
    <>
      <ConfirmationModal
        isOpen={modalOpen}
        title="Em Breve!"
        description="A loja está em desenvolvimento. Em breve você poderá adquirir poções e utilitários para evoluir ainda mais na sua jornada!"
        confirmLabel="Voltar para Home"
        onConfirm={handleBackToHome}
        footer={<span>Por: Giordano Bruno Biasi Berwig</span>}
      >
        <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300">
          <li>Adquira poções para multiplicar seu XP.</li>
          <li>Compre utilitários para proteger sua ofensiva e facilitar sua evolução.</li>
          <li>Itens exclusivos e novidades em breve!</li>
        </ul>
      </ConfirmationModal>
      {/* O conteúdo da loja fica "por trás" do blur, mas não pode ser acessado */}
      <div aria-hidden={modalOpen} className="h-screen w-screen overflow-hidden flex items-center justify-center px-0 pt-0 pb-0 sm:px-2 sm:pt-2 sm:pb-0 md:px-4 md:pt-4 md:pb-0 lg:p-4 pointer-events-none select-none blur-sm">
        <PageContainer>
          <BrowserHeader />
          <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
            <AppLeftSidebar activePath="/store" />
            <StoreMainContent />
            <StoreRightPanel />
          </div>
        </PageContainer>
      </div>
    </>
  );
}

export default Store;