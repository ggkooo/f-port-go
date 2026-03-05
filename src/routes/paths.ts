export const ROUTE_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  STORE: "/store",
  RANKING: "/ranking",
  CALENDAR: "/calendar",
  SETTINGS: "/settings",
  QUESTIONNAIRE: "/questionnaire",
  ADMINISTRATION: "/administration",
  ADMINISTRATION_QUESTIONS: "/administration/questions",
  ADMINISTRATION_CHALLENGES: "/administration/challenges",
  ADMINISTRATION_USERS: "/administration/users",
} as const;

export type AppRoutePath =
  | typeof ROUTE_PATHS.HOME
  | typeof ROUTE_PATHS.STORE
  | typeof ROUTE_PATHS.RANKING
  | typeof ROUTE_PATHS.CALENDAR
  | typeof ROUTE_PATHS.ADMINISTRATION
  | typeof ROUTE_PATHS.SETTINGS;
