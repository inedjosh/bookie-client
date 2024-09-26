import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

type User = {
  id: string;
  role: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_url: string;
};

type Token = {
  refreshToken: string;
  accessToken: string;
};

type AuthState = {
  user: User;
  isAuthenticated: boolean;
  token: Token;
};

const atk = Cookies.get("atk") as string;
const rtk = Cookies.get("rtk") as string;
const initialState: AuthState = {
  user: {
    id: "",
    role: "",
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    profile_url: "",
  },
  isAuthenticated: false,

  token: {
    refreshToken: rtk,
    accessToken: atk,
  },
};

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    signinUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = {
        id: "",
        role: "",
        email: "",
        first_name: "",
        last_name: "",
        username: "",
        profile_url: "",
      };
      state.isAuthenticated = false;
      state.token = { accessToken: "", refreshToken: "" };
    },

    setTokens: (
      state,
      { payload }: PayloadAction<{ refreshToken: string; accessToken: string }>
    ) => {
      state.token = payload;
    },
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
    },
  },
});

const { actions, reducer: AuthReducer } = authSlice;

export const { signinUser, setTokens, logout, setUser } = actions;
export default AuthReducer;
