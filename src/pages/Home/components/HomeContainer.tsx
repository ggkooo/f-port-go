import type { ReactNode } from "react";

interface HomeContainerProps {
  children: ReactNode;
}

export function HomeContainer({ children }: HomeContainerProps) {
  return (
    <div className="w-full max-w-7xl h-full bg-white dark:bg-neutral-900 rounded-large overflow-hidden flex flex-col browser-frame border border-neutral-200 dark:border-neutral-800">
      {children}
    </div>
  );
}
