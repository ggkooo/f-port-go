const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const AUTH_API_BASE_URL = (envApiBaseUrl && envApiBaseUrl.length > 0
  ? envApiBaseUrl
  : "http://localhost:8000/api").replace(/\/$/, "");
export const AUTH_API_KEY =
  "347df2c2e273c2d3db310872294422266549286f5b51080b2915d0b3118cc30b";

export type ApiResult<T> = {
  data: T;
  message: string;
};

export type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

function extractErrorMessage(body: ApiErrorPayload | Record<string, unknown> | null, fallback: string): string {
  const validationErrors = body && "errors" in body ? body.errors : undefined;
  const firstValidationMessage = validationErrors
    ? Object.values(validationErrors).flat()[0]
    : undefined;

  return firstValidationMessage ||
    (body && "message" in body && typeof body.message === "string" ? body.message : undefined) ||
    fallback;
}

export async function postRequest<T>(endpoint: string, payload: unknown): Promise<ApiResult<T>> {
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
    throw new Error(extractErrorMessage(body, "Não foi possível concluir a solicitação."));
  }

  return {
    data: (body ?? {}) as T,
    message:
      (body && "message" in body && typeof body.message === "string"
        ? body.message
        : undefined) || "Solicitação realizada com sucesso.",
  };
}

export async function requestJson<T>(url: string, init: RequestInit, fallbackError: string): Promise<T> {
  const response = await fetch(url, init);
  const contentType = response.headers.get("content-type") ?? "";
  const isJsonResponse = contentType.includes("application/json");
  const body = (isJsonResponse ? await response.json() : null) as
    | ApiErrorPayload
    | T
    | null;

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(body as ApiErrorPayload | Record<string, unknown> | null, fallbackError),
    );
  }

  return body as T;
}
