import { BrowserHeader, DarkModeToggle } from "../../components";
import {
  CalendarContainer,
  CalendarLeftSidebar,
  CalendarMainContent,
  CalendarRightPanel,
} from "./components";

function Calendar() {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-2 md:p-4">
        <CalendarContainer>
          <BrowserHeader url="portgo.com.br/calendar" />

          <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
            <CalendarLeftSidebar />
            <CalendarMainContent />
            <CalendarRightPanel />
          </div>
        </CalendarContainer>

        <DarkModeToggle />
      </div>
    </>
  );
}

export default Calendar;