import { postRequest } from "./apiClient";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  uuid: string;
  email: string;
  profile_completed: boolean;
  token: string;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export function login(payload: LoginPayload) {
  return postRequest<LoginResponse>("/login", payload);
}

export function register(payload: RegisterPayload) {
  return postRequest<Record<string, unknown>>("/register", payload);
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return postRequest<Record<string, unknown>>("/forgot-password", payload);
}

export function resetPassword(payload: ResetPasswordPayload) {
  return postRequest<Record<string, unknown>>("/reset-password", payload);
}
