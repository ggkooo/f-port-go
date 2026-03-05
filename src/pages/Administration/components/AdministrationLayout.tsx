import type { ReactNode } from "react";
import { BrowserHeader, PageContainer } from "../../../components";
import { AdminLeftSidebar } from "./AdminLeftSidebar";
import { AdministrationRightPanel } from "./AdministrationRightPanel";
import type { AdminRoute } from "../routes";

interface AdministrationLayoutProps {
  activePath: AdminRoute;
  children: ReactNode;
}

export function AdministrationLayout({ activePath, children }: AdministrationLayoutProps) {
  return (
    <>
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center px-0 pt-0 pb-0 sm:px-2 sm:pt-2 sm:pb-0 md:px-4 md:pt-4 md:pb-0 lg:p-4">
        <PageContainer>
          <BrowserHeader />

          <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
            <AdminLeftSidebar activePath={activePath} />
            {children}
            <AdministrationRightPanel />
          </div>
        </PageContainer>

      </div>
    </>
  );
}