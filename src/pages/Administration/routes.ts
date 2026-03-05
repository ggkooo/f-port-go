import { ROUTE_PATHS } from "../../routes/paths";

export type AdminRoute =
  | typeof ROUTE_PATHS.ADMINISTRATION
  | typeof ROUTE_PATHS.ADMINISTRATION_QUESTIONS
  | typeof ROUTE_PATHS.ADMINISTRATION_CHALLENGES
  | typeof ROUTE_PATHS.ADMINISTRATION_USERS;

export const ADMIN_NAV_ITEMS: Array<{ icon: string; path: AdminRoute; label: string }> = [
  { icon: "space_dashboard", path: ROUTE_PATHS.ADMINISTRATION, label: "Painel" },
  { icon: "quiz", path: ROUTE_PATHS.ADMINISTRATION_QUESTIONS, label: "Questões" },
  { icon: "sports_score", path: ROUTE_PATHS.ADMINISTRATION_CHALLENGES, label: "Desafios" },
  { icon: "groups", path: ROUTE_PATHS.ADMINISTRATION_USERS, label: "Usuários" },
];

export function getAdminRouteFromPath(pathname: string): AdminRoute {
  if (pathname.startsWith(ROUTE_PATHS.ADMINISTRATION_QUESTIONS)) {
    return ROUTE_PATHS.ADMINISTRATION_QUESTIONS;
  }

  if (pathname.startsWith(ROUTE_PATHS.ADMINISTRATION_CHALLENGES)) {
    return ROUTE_PATHS.ADMINISTRATION_CHALLENGES;
  }

  if (pathname.startsWith(ROUTE_PATHS.ADMINISTRATION_USERS)) {
    return ROUTE_PATHS.ADMINISTRATION_USERS;
  }

  return ROUTE_PATHS.ADMINISTRATION;
}
