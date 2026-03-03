import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: "home", active: true, path: "/" },
  { icon: "shopping_basket", active: false, hasNotification: true, path: "/store" },
  { icon: "leaderboard", active: false, path: "/ranking" },
  { icon: "calendar_today", active: false },
];

export function HomeLeftSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-24 bg-neutral-100 dark:bg-neutral-800 m-3 rounded-[2rem] flex-col items-center py-6 gap-5 hidden lg:flex">
      <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-3 rounded-2xl mb-4">
        <span className="material-symbols-outlined text-2xl">menu_book</span>
      </div>

      <nav className="flex flex-col gap-4 flex-1">
        {navItems.map(({ icon, active, hasNotification, path }) => (
          <button
            key={icon}
            type="button"
            onClick={() => {
              if (path) {
                navigate(path);
              }
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm relative transition-colors ${
              active
                ? "bg-neutral-900 dark:bg-blue-500 text-white"
                : "bg-white dark:bg-neutral-700 text-neutral-500"
            }`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            {hasNotification && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-neutral-100 dark:border-neutral-800" />
            )}
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-4 mt-auto">
        <button
          type="button"
          className="w-12 h-12 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-neutral-500 shadow-sm"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-neutral-700">
          <img
            alt="Perfil do usuário"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA8jxgRwmHa7khknGtCaovN2s-tc3pl4_WW6zQ9yvXglSvhuZD1n81vZhKLM2A07lE1MJOh2Zx2WGN-Nihd0pry50Q_dnKJXmjU6hhyYO-lOWI8LeNkXyR_4u6RBDCW4Bgu58PtHccWqg0iZIMCc0VvH1Yv9ir948Sk3tRUuy5DZXrpNUAsm4A8Q4hAJk5jykRYs_ECNEaHQEk9DsI00aq9pri-BLS1kMk1EAcNVgYFEID9jQrjizP27Kjl_a8cmvo57CqIoBJyarO"
          />
        </div>
      </div>
    </aside>
  );
}
