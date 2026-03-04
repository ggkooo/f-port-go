import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

export type ClassOption = {
  id: number;
  name: string;
};

export type ClassesResponse = {
  classes: ClassOption[];
};

export type ShiftOption = {
  id: number;
  name: string;
};

export type ShiftsResponse = {
  shifts: ShiftOption[];
};

export async function getClasses(): Promise<ClassesResponse> {
  const body = await requestJson<ClassesResponse>(
    `${AUTH_API_BASE_URL}/classes`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar as turmas.",
  );

  return body ?? { classes: [] };
}

export async function getShifts(): Promise<ShiftsResponse> {
  const body = await requestJson<ShiftsResponse>(
    `${AUTH_API_BASE_URL}/shifts`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar os turnos.",
  );

  return body ?? { shifts: [] };
}
