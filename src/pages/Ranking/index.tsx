import { AppLeftSidebar, BrowserHeader, DarkModeToggle, PageContainer } from "../../components";
import {
  RankingMainContent,
  RankingRightPanel,
} from "./components";

function Ranking() {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-2 md:p-4">
        <PageContainer>
          <BrowserHeader />

          <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
            <AppLeftSidebar activePath="/ranking" />
            <RankingMainContent />
            <RankingRightPanel />
          </div>
        </PageContainer>

        <DarkModeToggle />
      </div>
    </>
  );
}

export default Ranking;