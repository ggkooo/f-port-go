import { AppLeftSidebar, BrowserHeader, DarkModeToggle, PageContainer } from "../../components";
import {
  StoreMainContent,
  StoreRightPanel,
} from "./components";

function Store() {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-2 md:p-4">
        <PageContainer>
          <BrowserHeader url="portgo.com.br/store" />

          <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
            <AppLeftSidebar activePath="/store" />
            <StoreMainContent />
            <StoreRightPanel />
          </div>
        </PageContainer>

        <DarkModeToggle />
      </div>
    </>
  );
}

export default Store;