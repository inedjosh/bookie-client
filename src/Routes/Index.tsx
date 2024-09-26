import { useRoutes } from "react-router-dom";
import { AutheticationRoutes, DashboardRoutes } from "./AppRoutes";

const Routes = () => useRoutes([DashboardRoutes, AutheticationRoutes]);

export default Routes;
