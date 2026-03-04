const AUTH_API_BASE_URL = "http://localhost:8000/api";
const AUTH_API_KEY =
  "347df2c2e273c2d3db310872294422266549286f5b51080b2915d0b3118cc30b";

type ApiResult<T> = {
  data: T;
  message: string;
};

type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

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

async function request<T>(
  endpoint: string,
  payload: unknown,
): Promise<ApiResult<T>> {
  const response = await fetch(`${AUTH_API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-KEY": AUTH_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJsonResponse = contentType.includes("application/json");
  const body = (isJsonResponse ? await response.json() : null) as
    | ApiErrorPayload
    | (Record<string, unknown> & { message?: string })
    | null;

  if (!response.ok) {
    const validationErrors = body && "errors" in body ? body.errors : undefined;
    const firstValidationMessage = validationErrors
      ? Object.values(validationErrors).flat()[0]
      : undefined;

    const errorMessage =
      firstValidationMessage ||
      (body && "message" in body ? body.message : undefined) ||
      "Não foi possível concluir a solicitação.";

    throw new Error(errorMessage);
  }

  return {
    data: (body ?? {}) as T,
    message:
      (body && "message" in body && typeof body.message === "string"
        ? body.message
        : undefined) || "Solicitação realizada com sucesso.",
  };
}

export function login(payload: LoginPayload) {
  return request<LoginResponse>("/login", payload);
}

export function register(payload: RegisterPayload) {
  return request<Record<string, unknown>>("/register", payload);
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return request<Record<string, unknown>>("/forgot-password", payload);
}

export function resetPassword(payload: ResetPasswordPayload) {
  return request<Record<string, unknown>>("/reset-password", payload);
}