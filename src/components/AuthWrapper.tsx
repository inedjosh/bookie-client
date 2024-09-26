import { ComponentType, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { RootState } from "../redux/store";
import { signinUser } from "../redux/slices/auth.slice";
import { useRequestError } from "./Hooks/useRequestError";
import { GetUser } from "../services/user.service";
import { Typography } from "./Typography";

interface AuthHocProps<P> {
  component: ComponentType<P>;
}

const AuthHoc = <P,>({ component: Component, ...rest }: AuthHocProps<P>) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { handleRequestError } = useRequestError({ useToast: true });
  const [loading, setLoading] = useState(false);
  const refreshUser = async () => {
    try {
      setLoading(true);
      const refreshToken = Cookies.get("refreshToken") || token.refreshToken;
      const accessToken = token?.accessToken;

      if (!refreshToken || !accessToken) {
        window.location.href = "/login";
        return;
      }

      const user = await GetUser();

      dispatch(signinUser(user.data));
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Typography variant="heading" color="primary" as="h1">
          Bookie
        </Typography>{" "}
      </div>
    );

  return <Component as {...(rest as P)} />;
};

export default AuthHoc;
