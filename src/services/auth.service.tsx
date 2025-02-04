import { OTP_TYPE } from "../constants";
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
  firstName: string;
  lastName: string;
}) => {
  const url = `${authEndpoint}register`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const ForgotPasswordRequest = async (payload: { email: string }) => {
  const url = `${authEndpoint}forgot-password`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const ResendOtpRequest = async (payload: {
  email: string;
  otp_type: OTP_TYPE;
}) => {
  const url = `${authEndpoint}resend-otp`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const ResetPasswordRequest = async (payload: {
  email: string;
  new_password: string;
}) => {
  const url = `${authEndpoint}reset-password`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const VerifyEmailRequest = async (payload: {
  email: string;
  otp: string;
  otp_type: OTP_TYPE;
}) => {
  const url = `${authEndpoint}verify-email`;
  const res = await axiosInstance.post(url, payload);

  return res.data;
};

export const Logout = async () => {
  const url = `${authEndpoint}logout`;
  const res = await axiosInstance.delete(url);
  // window.location.href = "/login";
  return res.data;
};
