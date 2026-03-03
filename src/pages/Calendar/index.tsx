import { AppLeftSidebar, BrowserHeader, DarkModeToggle, PageContainer } from "../../components";
import {
  CalendarMainContent,
  CalendarRightPanel,
} from "./components";

function Calendar() {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-2 md:p-4">
        <PageContainer>
          <BrowserHeader />

          <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
            <AppLeftSidebar activePath="/calendar" />
            <CalendarMainContent />
            <CalendarRightPanel />
          </div>
        </PageContainer>

        <DarkModeToggle />
      </div>
    </>
  );
}

export default Calendar;