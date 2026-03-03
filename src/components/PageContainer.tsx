import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  size?: "default" | "compact";
}

export function PageContainer({ children, size = "default" }: PageContainerProps) {
  const widthClass = size === "compact" ? "max-w-6xl" : "max-w-7xl";

  return (
    <div
      className={`w-full ${widthClass} h-full bg-white dark:bg-neutral-900 rounded-none sm:rounded-large overflow-hidden flex flex-col browser-frame border border-transparent sm:border-neutral-200 dark:sm:border-neutral-800`}
    >
      {children}
    </div>
  );
}