import { BrowserHeader, DarkModeToggle } from "../../components";
import {
  StoreContainer,
  StoreLeftSidebar,
  StoreMainContent,
  StoreRightPanel,
} from "./components";

function Store() {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-2 md:p-4">
        <StoreContainer>
          <BrowserHeader url="portgo.com.br/store" />

          <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
            <StoreLeftSidebar />
            <StoreMainContent />
            <StoreRightPanel />
          </div>
        </StoreContainer>

        <DarkModeToggle />
      </div>
    </>
  );
}

export default Store;