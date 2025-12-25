import {
  ILoginRequest,
  ILoginResponse,
  IForgotPasswordResponse,
  IVerifyOtpResponse,
  IResendOtpResponse,
  IChangePasswordResponse,
  IChangePasswordRequest,
} from "@/types/auth.types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Login
    login: build.mutation<ILoginResponse, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [tagTypes.auth],
    }),

    // Forgot password - sends OTP to email
    forgotPassword: build.mutation<IForgotPasswordResponse, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "PATCH",
        body: data,
      }),
    }),

    // Verify OTP
    verifyOtp: build.mutation<IVerifyOtpResponse, { otp: string }>({
      query: (data) => ({
        url: "/otp/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Resend OTP
    resendOtp: build.mutation<IResendOtpResponse, { email: string }>({
      query: (data) => ({
        url: "/otp/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    // Change password (for resetting after OTP verification)
    changePassword: build.mutation<
      IChangePasswordResponse,
      IChangePasswordRequest
    >({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.auth],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useChangePasswordMutation,
} = authApi;
