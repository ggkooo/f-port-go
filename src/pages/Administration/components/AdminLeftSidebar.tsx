import { useNavigate } from "react-router-dom";
import { DarkModeToggle } from "../../../components";
import { clearSession, getSession } from "../../../services/session";

export type AdminRoute =
  | "/administration"
  | "/administration/questions"
  | "/administration/challenges"
  | "/administration/users";

interface AdminLeftSidebarProps {
  activePath: AdminRoute;
}

const navItems: Array<{ icon: string; path: AdminRoute; label: string }> = [
  { icon: "space_dashboard", path: "/administration", label: "Painel" },
  { icon: "quiz", path: "/administration/questions", label: "Questões" },
  { icon: "sports_score", path: "/administration/challenges", label: "Desafios" },
  { icon: "groups", path: "/administration/users", label: "Usuários" },
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

  return "Admin";
}

function getPastelColor(seed: string): string {
  const total = seed
    .split("")
    .reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0);

  return pastelPalette[total % pastelPalette.length];
}

export function AdminLeftSidebar({ activePath }: AdminLeftSidebarProps) {
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
          <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
        </div>

        <nav className="flex flex-col gap-4 flex-1">
          {navItems.map(({ icon, path, label }) => {
            const isActive = activePath === path;

            return (
              <button
                key={icon}
                type="button"
                onClick={() => navigate(path)}
                title={label}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm relative transition-colors ${
                  isActive
                    ? "bg-neutral-900 dark:bg-blue-500 text-white"
                    : "bg-white dark:bg-neutral-700 text-neutral-500"
                }`}
              >
                <span className="material-symbols-outlined">{icon}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col gap-4 mt-auto">
          <DarkModeToggle placement="inline" />

          <button
            type="button"
            onClick={handleLogout}
            className="w-12 h-12 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-red-500 shadow-sm transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>

          <div
            aria-label="Inicial do perfil do administrador"
            className="w-12 h-12 rounded-full border-2 border-white dark:border-neutral-700 flex items-center justify-center text-neutral-900 font-extrabold text-lg"
            style={{ backgroundColor: avatarBackground }}
          >
            {avatarLetter}
          </div>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-neutral-200 dark:border-neutral-700 bg-white/95 dark:bg-neutral-900/95 backdrop-blur px-2 py-2">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {navItems.map(({ icon, path, label }) => {
            const isActive = activePath === path;

            return (
              <button
                key={`${icon}-mobile`}
                type="button"
                onClick={() => navigate(path)}
                title={label}
                className={`w-11 h-11 rounded-full flex items-center justify-center relative transition-colors ${
                  isActive
                    ? "bg-neutral-900 dark:bg-blue-500 text-white"
                    : "text-neutral-500 dark:text-neutral-300"
                }`}
              >
                <span className="material-symbols-outlined">{icon}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}