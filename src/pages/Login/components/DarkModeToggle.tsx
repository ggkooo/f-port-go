export function DarkModeToggle() {
  const handleToggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={handleToggleDarkMode}
      className="fixed bottom-8 right-8 bg-white dark:bg-neutral-800 p-4 rounded-full shadow-2xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50"
      aria-label="Alternar modo escuro"
    >
      <span className="material-symbols-outlined dark:hidden text-neutral-800">
        dark_mode
      </span>
      <span className="material-symbols-outlined hidden dark:block text-white">
        light_mode
      </span>
    </button>
  );
}
