import { BrowserHeader, DarkModeToggle } from "../../components";
import {
  SettingsContainer,
  SettingsLeftSidebar,
  SettingsMainContent,
  SettingsRightPanel,
} from "./components";

function Settings() {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-2 md:p-4">
        <SettingsContainer>
          <BrowserHeader url="portgo.com.br/settings" />

          <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
            <SettingsLeftSidebar />
            <SettingsMainContent />
            <SettingsRightPanel />
          </div>
        </SettingsContainer>

        <DarkModeToggle />
      </div>
    </>
  );
}

export default Settings;
