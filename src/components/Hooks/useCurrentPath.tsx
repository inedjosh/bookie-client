import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useCurrentPath = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const [isAppRoute, setIsAppRoute] = useState(false);

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    setCurrentPath(lastSegment);

    const containsApp = location.pathname.includes("app");
    setIsAppRoute(containsApp);
  }, [location]);

  return { currentPath, isAppRoute };
};

export default useCurrentPath;
