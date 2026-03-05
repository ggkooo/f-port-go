import { Outlet, useLocation } from "react-router-dom";
import { AdministrationLayout } from "./components";
import { getAdminRouteFromPath } from "./routes";

function AdministrationShell() {
  const { pathname } = useLocation();
  const activePath = getAdminRouteFromPath(pathname);

  return (
    <AdministrationLayout activePath={activePath}>
      <Outlet />
    </AdministrationLayout>
  );
}

export default AdministrationShell;
