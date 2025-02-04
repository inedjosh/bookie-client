import { CohortType, TokenType, UserType } from "./../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { OTP_TYPE } from "../../constants";

type AuthState = {
  user: UserType;
  isAuthenticated: boolean;
  token: TokenType;
  otpData: { email: string; type: OTP_TYPE };
  cohort: CohortType | null;
};

const atk = Cookies.get("atk") as string;
const rtk = Cookies.get("rtk") as string;
const initialState: AuthState = {
  user: {
    _id: "",
    role: "",
    email: "",
    firstName: "",
    lastName: "",
    profileUrl: "",
    country: "",
    phoneNumber: "",
    lastLoginDate: "",
    accountActive: false,
    createdAt: "",
    totalScore: 0,
    unreadNotifications: 0,
  },
  isAuthenticated: false,
  cohort: null,
  token: {
    refreshToken: rtk,
    accessToken: atk,
  },

  otpData: {
    email: "",
    type: OTP_TYPE.NONE,
  },
};

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    signinUser: (state, { payload }: PayloadAction<UserType>) => {
      state.user = payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = {
        _id: "",
        role: "",
        email: "",
        firstName: "",
        lastName: "",
        profileUrl: "",
        country: "",
        phoneNumber: "",
        lastLoginDate: "",
        accountActive: false,
        createdAt: "",
        totalScore: 0,
        unreadNotifications: 0,
      };
      state.isAuthenticated = false;
      state.token = { accessToken: "", refreshToken: "" };
    },
    setCohort: (state, { payload }: PayloadAction<CohortType>) => {
      state.cohort = payload;
    },
    setTokens: (
      state,
      { payload }: PayloadAction<{ refreshToken: string; accessToken: string }>
    ) => {
      state.token = payload;
    },
    setUser: (state, { payload }: PayloadAction<UserType>) => {
      state.user = payload;
    },
    setOtpData: (
      state,
      { payload }: PayloadAction<{ email: string; type: OTP_TYPE }>
    ) => {
      state.otpData = payload;
    },
  },
});

const { actions, reducer: AuthReducer } = authSlice;

export const {
  signinUser,
  setTokens,
  setCohort,
  logoutUser,
  setUser,
  setOtpData,
} = actions;
export default AuthReducer;
