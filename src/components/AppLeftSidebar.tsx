import { useNavigate } from "react-router-dom";
import { DarkModeToggle } from "./DarkModeToggle";
import { clearSession, getSession } from "../services/session";

type AppRoute = "/" | "/store" | "/ranking" | "/calendar" | "/settings";

interface AppLeftSidebarProps {
  activePath?: AppRoute;
  showStoreNotification?: boolean;
  navigationLocked?: boolean;
}

const navItems: Array<{ icon: string; path: AppRoute }> = [
  { icon: "home", path: "/" },
  { icon: "shopping_basket", path: "/store" },
  { icon: "leaderboard", path: "/ranking" },
  { icon: "calendar_today", path: "/calendar" },
];

const pastelPalette = [
  "#FADADD",
  "#FFE5B4",
  "#FFFACD",
  "#D4F5DD",
  "#D9ECFF",
  "#E6E0FF",
  "#F8DFF5",
  "#FFDCE5",
];

function getInitialSeed(firstName?: string, email?: string): string {
  if (firstName?.trim()) {
    return firstName.trim();
  }

  if (email?.trim()) {
    return email.trim().split("@")[0] || email.trim();
  }

  return "Usuário";
}

function getPastelColor(seed: string): string {
  const total = seed
    .split("")
    .reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0);

  return pastelPalette[total % pastelPalette.length];
}

export function AppLeftSidebar({
  activePath,
  showStoreNotification = false,
  navigationLocked = false,
}: AppLeftSidebarProps) {
  const navigate = useNavigate();
  const session = getSession();
  const avatarSeed = getInitialSeed(session?.firstName, session?.email);
  const avatarLetter = avatarSeed.charAt(0).toUpperCase();
  const avatarBackground = getPastelColor(avatarSeed);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <>
      <aside className="w-24 bg-neutral-100 dark:bg-neutral-800 m-3 rounded-[2rem] flex-col items-center py-6 gap-5 hidden lg:flex">
        <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-3 rounded-2xl mb-4">
          <span className="material-symbols-outlined text-2xl">menu_book</span>
        </div>

        <nav className="flex flex-col gap-4 flex-1">
          {navItems.map(({ icon, path }) => {
            const isActive = activePath === path;
            const hasNotification = showStoreNotification && path === "/store";

            return (
              <button
                key={icon}
                type="button"
                onClick={() => navigate(path)}
                disabled={navigationLocked}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm relative transition-colors ${
                  isActive
                    ? "bg-neutral-900 dark:bg-blue-500 text-white"
                    : "bg-white dark:bg-neutral-700 text-neutral-500"
                } ${navigationLocked ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <span className="material-symbols-outlined">{icon}</span>
                {hasNotification && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-neutral-100 dark:border-neutral-800" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col gap-4 mt-auto">
          <DarkModeToggle placement="inline" />

          <button
            type="button"
            onClick={() => navigate("/settings")}
            disabled={navigationLocked}
            className={`w-12 h-12 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-neutral-500 shadow-sm ${
              navigationLocked ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={navigationLocked}
            className={`w-12 h-12 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-red-500 shadow-sm transition-colors ${
              navigationLocked
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-red-50 dark:hover:bg-red-900/20"
            }`}
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>

          <div
            aria-label="Inicial do perfil do usuário"
            className="w-12 h-12 rounded-full border-2 border-white dark:border-neutral-700 flex items-center justify-center text-neutral-900 font-extrabold text-lg"
            style={{ backgroundColor: avatarBackground }}
          >
            {avatarLetter}
          </div>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-neutral-200 dark:border-neutral-700 bg-white/95 dark:bg-neutral-900/95 backdrop-blur px-2 py-2">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {navItems.map(({ icon, path }) => {
            const isActive = activePath === path;
            const hasNotification = showStoreNotification && path === "/store";

            return (
              <button
                key={`${icon}-mobile`}
                type="button"
                onClick={() => navigate(path)}
                disabled={navigationLocked}
                className={`w-11 h-11 rounded-full flex items-center justify-center relative transition-colors ${
                  isActive
                    ? "bg-neutral-900 dark:bg-blue-500 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                } ${navigationLocked ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                {hasNotification && (
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-neutral-900" />
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => navigate("/settings")}
            disabled={navigationLocked}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
              activePath === "/settings"
                ? "bg-neutral-900 dark:bg-blue-500 text-white"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
            } ${navigationLocked ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={navigationLocked}
            className={`w-11 h-11 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-red-500 transition-colors ${
              navigationLocked
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-red-50 dark:hover:bg-red-900/20"
            }`}
            title="Logout"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>

          <DarkModeToggle placement="mobile-nav" />
        </div>
      </nav>
    </>
  );
}