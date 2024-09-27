import { useRoutes } from "react-router-dom";
import { AuthenticationRoutes, DashboardRoutes } from "./AppRoutes";

const Routes = () => useRoutes([DashboardRoutes, AuthenticationRoutes]);

export default Routes;
