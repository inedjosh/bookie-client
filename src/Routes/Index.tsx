import { useRoutes } from "react-router-dom";
import {
  AuthenticationRoutes,
  StudentDashboardRoutes,
  TeacherDashboardRoutes,
  AdminDashboardRoutes,
} from "./AppRoutes";

const Routes = () =>
  useRoutes([
    StudentDashboardRoutes,
    TeacherDashboardRoutes,
    AdminDashboardRoutes,
    AuthenticationRoutes,
  ]);

export default Routes;
