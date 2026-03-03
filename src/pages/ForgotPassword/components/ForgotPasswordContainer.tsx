import { ReactNode } from "react";

interface ForgotPasswordContainerProps {
  children: ReactNode;
}

export function ForgotPasswordContainer({
  children,
}: ForgotPasswordContainerProps) {
  return (
    <div className="w-full max-w-6xl bg-white dark:bg-neutral-900 rounded-large overflow-hidden flex flex-col browser-frame border border-neutral-200 dark:border-neutral-800">
      {children}
    </div>
  );
}
