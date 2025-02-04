import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useCurrentPath = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isTeacherRoute, setIsTeacherRoute] = useState(false);
  const [isStudentRoute, setIsStudentRoute] = useState(false);

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    setCurrentPath(lastSegment);

    const containsAdmin = location.pathname.includes("admin");
    setIsAdminRoute(containsAdmin);

    const containsTeacher = location.pathname.includes("teacher");
    setIsTeacherRoute(containsTeacher);

    const containsStudent = location.pathname.includes("student");
    setIsStudentRoute(containsStudent);
  }, [location]);

  return { currentPath, isAdminRoute, isTeacherRoute, isStudentRoute };
};

export default useCurrentPath;
