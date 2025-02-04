import { Navigate } from "react-router-dom";
import AuthWrapper from "../components/AuthWrapper";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../pages/auth/Login";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import AdminOverview from "../pages/app/admin/AdminOverview";
import Users from "../pages/app/admin/Users";
import Tasks from "../pages/app/admin/Tasks";
import Content from "../pages/app/admin/Content";
import Courses from "../pages/app/admin/Courses";
import Cohort from "../pages/app/admin/Cohort";
import TeacherOverview from "../pages/app/teacher/TeacherOverview";
import Students from "../pages/app/teacher/Students";
import TeacherContent from "../pages/app/teacher/Content";
import TeacherDashboardLayout from "../Layouts/TeacherDashboardLayout";
import StudentDashboardLayout from "../Layouts/StudentDashboardLayout/Index";
import AdminDashboardLayout from "../Layouts/AdminDashboardLayout";
import Signup from "../pages/auth/Signup";
import Class from "../pages/app/admin/Class";
import TeacherClass from "../pages/app/teacher/Class";
import TeacherTasks from "../pages/app/teacher/Tasks";
import StudentClass from "../pages/app/student/Class";
import StudentTasks from "../pages/app/student/Tasks";
import StudentContent from "../pages/app/student/Content";
import StudentOverview from "../pages/app/student/StudentOverview";
import StudentMiniClass from "../pages/app/student/MiniClass";
import Profile from "../pages/app/Profile";
import Quiz from "../pages/app/student/Tasks/Quiz";
import VideoPage from "../pages/app/student/Content/VideoPage";
import ArticlePage from "../pages/app/student/Content/ArticlePage";
import PeerAssignmentPage from "../pages/app/student/Tasks/PeerAssignmentPage";
import PeerAssignmentGradePage from "../pages/app/student/Tasks/PeerAssignmentGradePage";

export const StudentDashboardRoutes = {
  path: "/student",
  element: <AuthWrapper component={StudentDashboardLayout} />,
  children: [
    {
      path: "overview",
      element: <StudentOverview />,
    },
    {
      path: "class",
      element: <StudentClass />,
    },
    {
      path: "mini-class",
      element: <StudentMiniClass />,
    },
    {
      path: "tasks",
      children: [
        { index: true, element: <StudentTasks /> },
        { path: "quiz/:id", element: <Quiz /> },
        { path: "peer-details/:id", element: <PeerAssignmentPage /> },
        { path: "peer-grade/:id", element: <PeerAssignmentGradePage /> },
      ],
    },
    {
      path: "content",
      children: [
        { index: true, element: <StudentContent /> },
        { path: "article/:id", element: <ArticlePage /> },
        { path: "video/:id", element: <VideoPage /> },
      ],
    },

    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "app/*",
      element: <Navigate to="/auth/login" replace />,
    },
  ],
};

export const TeacherDashboardRoutes = {
  path: "/teacher",
  element: <AuthWrapper component={TeacherDashboardLayout} />,
  children: [
    {
      path: "overview",
      element: <TeacherOverview />,
    },
    {
      path: "students",
      element: <Students />,
    },
    {
      path: "class",
      element: <TeacherClass />,
    },

    {
      path: "tasks",
      element: <TeacherTasks />,
    },
    {
      path: "content",
      element: <TeacherContent />,
    },

    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "app/*",
      element: <Navigate to="/auth/login" replace />,
    },
  ],
};

export const AdminDashboardRoutes = {
  path: "/admin",
  element: <AuthWrapper component={AdminDashboardLayout} />,
  children: [
    {
      path: "overview",
      element: <AdminOverview />,
    },
    {
      path: "users",
      element: <Users />,
    },

    {
      path: "tasks",
      element: <Tasks />,
    },
    {
      path: "content",
      element: <Content />,
    },
    {
      path: "courses",
      element: <Courses />,
    },
    {
      path: "class",
      element: <Class />,
    },
    {
      path: "cohort",
      element: <Cohort />,
    },

    {
      path: "app/*",
      element: <Navigate to="/auth/login" replace />,
    },
  ],
};

export const AuthenticationRoutes = {
  path: "/",
  element: <AuthLayout />,
  children: [
    {
      path: "/",
      element: <Navigate to="login" replace />,
    },
    {
      path: "register",
      element: <Signup />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "verify-email",
      element: <VerifyEmail />,
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "reset-password",
      element: <ResetPassword />,
    },
  ],
};
