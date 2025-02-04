import { ComponentType, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { RootState } from "../redux/store";
import { useRequestError } from "./Hooks/useRequestError";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AxiosSingleUserType, CohortType, UserType } from "../types";
import { fetchData } from "../Utils/fetch";
import { setCohort, signinUser } from "../redux/slices/auth.slice";
import { Logo } from "../assets";

interface AuthHocProps<P> {
  component: ComponentType<P>;
}

const AuthHoc = <P,>({ component: Component, ...rest }: AuthHocProps<P>) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { handleRequestError } = useRequestError({ useToast: true });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const refreshUser = async () => {
    try {
      setLoading(true);
      const refreshToken = Cookies.get("refreshToken") || token.refreshToken;
      const accessToken = token?.accessToken;

      if (!refreshToken || !accessToken) {
        window.location.href = "/login";
        return;
      }

      const data = await fetchData<AxiosSingleUserType>("/user");

      dispatch(signinUser(data.data?.user as UserType));
      dispatch(setCohort(data.data?.cohort as CohortType));
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(async (config) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decodedToken: any = jwtDecode(token.accessToken);
      const currentTime = Date.now() / 1000;
      const tokenExpiryTime = decodedToken.exp;

      if (tokenExpiryTime - currentTime < 300) {
        await refreshUser();
        config.headers.Authorization = `Bearer ${Cookies.get("atk")}`;
      }

      return config;
    });
  };

  const isPageReload = (): boolean => {
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0) {
      return (navEntries[0] as PerformanceNavigationTiming).type === "reload";
    }
    return performance.navigation.type === 1; // Deprecated but fallback
  };

  useEffect(() => {
    if (!isPageReload()) {
      return;
    }

    if (!token.accessToken || !token.refreshToken) {
      navigate("/login");
    } else {
      setupAxiosInterceptors();
      refreshUser();
    }
  }, [token]);

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img src={Logo} />
      </div>
    );

  return <Component as {...(rest as P)} />;
};

export default AuthHoc;
