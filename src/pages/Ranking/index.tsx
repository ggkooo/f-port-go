import { BrowserHeader, DarkModeToggle } from "../../components";
import {
  RankingContainer,
  RankingLeftSidebar,
  RankingMainContent,
  RankingRightPanel,
} from "./components";

function Ranking() {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-2 md:p-4">
        <RankingContainer>
          <BrowserHeader url="portgo.com.br/ranking" />

          <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
            <RankingLeftSidebar />
            <RankingMainContent />
            <RankingRightPanel />
          </div>
        </RankingContainer>

        <DarkModeToggle />
      </div>
    </>
  );
}

export default Ranking;