import { IAuthState, IUser } from "@/types/auth.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState: IAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: IUser; token: string }>
    ) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;

      // Store token in Cookies for middleware authentication
      Cookies.set("famsched-access-token", token, {
        path: "/",
        expires: 7,
      });
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      // Remove token from cookie
      Cookies.remove("famsched-access-token", { path: "/" });
    },
  },
});

// Typed selectors - using inline type to avoid circular dependency with store
export const selectUser = (state: { auth: IAuthState }) => state.auth.user;
export const selectToken = (state: { auth: IAuthState }) => state.auth.token;

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
