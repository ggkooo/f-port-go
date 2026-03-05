import { useRoutes, Navigate } from "react-router-dom";
import { AdminRoute, ProtectedRoute, PublicRoute } from "../components";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import Store from "../pages/Store";
import Ranking from "../pages/Ranking";
import Calendar from "../pages/Calendar";
import Settings from "../pages/Settings";
import Questionnaire from "../pages/Questionnaire";
import Administration from "../pages/Administration";
import AdministrationQuestions from "../pages/Administration/Questions";
import AdministrationChallenges from "../pages/Administration/Challenges";
import AdministrationUsers from "../pages/Administration/Users";
import AdministrationCalendar from "../pages/Administration/Calendar";
import AdministrationShell from "../pages/Administration/AdministrationShell";
import { ROUTE_PATHS } from "./paths";

export function AppRouter() {
  return useRoutes([
    {
      path: ROUTE_PATHS.LOGIN,
      element: <PublicRoute element={<Login />} />,
    },
    {
      path: ROUTE_PATHS.REGISTER,
      element: <PublicRoute element={<Register />} />,
    },
    {
      path: ROUTE_PATHS.FORGOT_PASSWORD,
      element: <PublicRoute element={<ForgotPassword />} />,
    },
    {
      path: ROUTE_PATHS.RESET_PASSWORD,
      element: <PublicRoute element={<ResetPassword />} />,
    },
    {
      path: ROUTE_PATHS.STORE,
      element: <ProtectedRoute element={<Store />} />,
    },
    {
      path: ROUTE_PATHS.RANKING,
      element: <ProtectedRoute element={<Ranking />} />,
    },
    {
      path: ROUTE_PATHS.CALENDAR,
      element: <ProtectedRoute element={<Calendar />} />,
    },
    {
      path: ROUTE_PATHS.SETTINGS,
      element: <ProtectedRoute element={<Settings />} />,
    },
    {
      path: ROUTE_PATHS.QUESTIONNAIRE,
      element: <ProtectedRoute element={<Questionnaire />} />,
    },
    {
      path: ROUTE_PATHS.HOME,
      element: <ProtectedRoute element={<Home />} />,
    },
    {
      path: ROUTE_PATHS.ADMINISTRATION,
      element: <AdminRoute element={<AdministrationShell />} />,
      children: [
        {
          index: true,
          element: <Administration />,
        },
        {
          path: "questions",
          element: <AdministrationQuestions />,
        },
        {
          path: "challenges",
          element: <AdministrationChallenges />,
        },
        {
          path: "users",
          element: <AdministrationUsers />,
        },
        {
          path: "calendar",
          element: <AdministrationCalendar />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to={ROUTE_PATHS.HOME} replace />,
    },
  ]);
}
