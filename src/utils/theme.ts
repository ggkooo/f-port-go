export const THEME_STORAGE_KEY = "portgo.theme";

export type ThemePreference = "light" | "dark";

const isThemePreference = (value: string | null): value is ThemePreference => value === "light" || value === "dark";

const getSystemTheme = (): ThemePreference =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const getStoredThemePreference = (): ThemePreference | null => {
  const rawValue = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemePreference(rawValue) ? rawValue : null;
};

export const resolveInitialTheme = (): ThemePreference => getStoredThemePreference() ?? getSystemTheme();

export const applyTheme = (theme: ThemePreference) => {
  const isDark = theme === "dark";

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = theme;
};

export const initializeTheme = () => {
  applyTheme(resolveInitialTheme());
};

export const persistThemePreference = (theme: ThemePreference) => {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};