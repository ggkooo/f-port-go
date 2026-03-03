import { AppLeftSidebar, BrowserHeader, PageContainer } from "../../components";
import {
  CalendarMainContent,
  CalendarRightPanel,
} from "./components";

function Calendar() {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center px-0 pt-0 pb-0 sm:px-2 sm:pt-2 sm:pb-0 md:px-4 md:pt-4 md:pb-0 lg:p-4">
        <PageContainer>
          <BrowserHeader />

          <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
            <AppLeftSidebar activePath="/calendar" />
            <CalendarMainContent />
            <CalendarRightPanel />
          </div>
        </PageContainer>

      </div>
    </>
  );
}

export default Calendar;