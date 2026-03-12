// import { baseApi } from "./baseApi";
import { baseApi } from "../api/baseApi";
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  access_token?: string;
  user?: User;
}

// Map these directly to your NestJS DTOs
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}// Adjust path as needed

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/auth/verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation<AuthResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<AuthResponse, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<AuthResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;