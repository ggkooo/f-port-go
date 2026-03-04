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

export type DifficultyOption = {
  id: number;
  name: string;
};

export type DifficultiesResponse = {
  difficulties: DifficultyOption[];
};

export type ActivityTypeOption = {
  id: number;
  name: string;
  slug: string;
};

export type ActivityTypesResponse = {
  activity_types: ActivityTypeOption[];
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

export async function getDifficulties(): Promise<DifficultiesResponse> {
  const body = await requestJson<DifficultiesResponse>(
    `${AUTH_API_BASE_URL}/difficulties`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar as dificuldades.",
  );

  return body ?? { difficulties: [] };
}

export async function getActivityTypes(): Promise<ActivityTypesResponse> {
  const body = await requestJson<ActivityTypesResponse>(
    `${AUTH_API_BASE_URL}/activity-types`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar os tipos de atividade.",
  );

  return body ?? { activity_types: [] };
}
