import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("atk");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const successHandler = (response: AxiosResponse) => {
  const accessToken = response.headers["x-access-token"];
  const refreshToken = response.headers["x-refresh-token"];

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts: string[] = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };
  getCookie("device-id");
  if (accessToken) {
    Cookies.set("atk", accessToken);
    Cookies.set("rtk", refreshToken);
  }
  return response;
};

axiosInstance.interceptors.response.use(
  (response) => successHandler(response),
  (error) => {
    if (
      error?.response?.status === 419 ||
      error?.response?.status === 401 ||
      error?.response?.data?.message === "Unauthorized"
    ) {
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
