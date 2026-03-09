import { AppLeftSidebar, BrowserHeader, PageContainer } from "../../components";

import { useCallback, useEffect, useState } from "react";
import { RankingMainContent, RankingRightPanel } from "./components";
import { getSession } from "../../services/session";
import { getRanking, type RankingPlayer } from "../../services/rankingService";


function Ranking() {
  const [loggedUser, setLoggedUser] = useState<RankingPlayer | null>(null);

  const fetchLoggedUser = useCallback(async () => {
    const session = getSession();
    if (!session?.token) {
      setLoggedUser(null);
      return;
    }
    try {
      const rankingData = await getRanking(session.token);
      setLoggedUser(
        rankingData.loggedUser ||
        rankingData.ranking.find((player: RankingPlayer) => player.isCurrentUser || (session.uuid && player.uuid === session.uuid)) ||
        null
      );
    } catch {
      setLoggedUser(null);
    }
  }, []);

  useEffect(() => {
    fetchLoggedUser();
  }, [fetchLoggedUser]);

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center px-0 pt-0 pb-0 sm:px-2 sm:pt-2 sm:pb-0 md:px-4 md:pt-4 md:pb-0 lg:p-4">
      <PageContainer>
        <BrowserHeader />
        <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden flex-row">
          <AppLeftSidebar activePath="/ranking" />
          <div className="flex flex-1 min-h-0 flex-row">
            <RankingMainContent />
            <RankingRightPanel loggedUser={loggedUser} />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

export default Ranking;