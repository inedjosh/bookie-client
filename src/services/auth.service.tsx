import axiosInstance from "../Utils/Https";

const authEndpoint = "auth/";

export const LoginRequest = async (payload: {
  email: string;
  password: string;
}) => {
  const url = `${authEndpoint}login`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const RegisterRequest = async (payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) => {
  const url = `${authEndpoint}register`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const Logout = async () => {
  const url = `${authEndpoint}logout`;
  const res = await axiosInstance.delete(url);
  window.location.href = "/login";
  return res.data;
};
