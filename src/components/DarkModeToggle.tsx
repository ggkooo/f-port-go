import { useEffect, useState } from "react";
import { applyTheme, persistThemePreference, resolveInitialTheme, type ThemePreference } from "../utils/theme";

interface DarkModeToggleProps {
  placement?: "fixed" | "inline" | "mobile-nav";
}

export function DarkModeToggle({ placement = "fixed" }: DarkModeToggleProps) {
  const [theme, setTheme] = useState<ThemePreference>(() => resolveInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleToggleDarkMode = () => {
    const nextTheme: ThemePreference = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    persistThemePreference(nextTheme);
  };

  const isDarkTheme = theme === "dark";
  const buttonClassName =
    placement === "inline"
      ? "w-12 h-12 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-200 shadow-sm border border-neutral-200 dark:border-neutral-700 transition-transform hover:scale-105 active:scale-95"
      : placement === "mobile-nav"
        ? "w-11 h-11 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 transition-transform hover:scale-105 active:scale-95"
        : "fixed bottom-20 right-4 sm:bottom-8 sm:right-8 bg-white dark:bg-neutral-800 p-3 sm:p-4 rounded-full shadow-2xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50";

  return (
    <button
      onClick={handleToggleDarkMode}
      className={buttonClassName}
      aria-label="Alternar modo escuro"
    >
      <span className={`material-symbols-outlined text-neutral-800 ${isDarkTheme ? "hidden" : ""}`}>
        dark_mode
      </span>
      <span className={`material-symbols-outlined text-white ${isDarkTheme ? "" : "hidden"}`}>
        light_mode
      </span>
    </button>
  );
}
