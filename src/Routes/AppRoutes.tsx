import { Navigate } from "react-router-dom";
import AuthWrapper from "../components/AuthWrapper";
import DashboardLayout from "../Layouts/DashboardLayout/Index";
import Dashboard from "../pages/app/Dashboard";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Singup";
import Account from "../pages/app/Account";
import Library from "../pages/app/Library";

export const DashboardRoutes = {
  path: "/app",
  element: <AuthWrapper component={DashboardLayout} />,
  children: [
    {
      path: "overview",
      element: <Dashboard />,
    },
    {
      path: "account",
      element: <Account />,
    },
    {
      path: "library",
      element: <Library />,
    },

    {
      path: "app/*",
      element: <Navigate to="/auth/login" replace />,
    },
  ],
};

export const AutheticationRoutes = {
  path: "/",
  element: <AuthLayout />,
  children: [
    {
      path: "register",
      element: <Signup />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ],
};
