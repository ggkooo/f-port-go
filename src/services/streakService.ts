import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

export type UserStreakResponse = {
  user_uuid: string;
  current_streak: number;
  best_streak: number;
  last_lesson_date: string | null;
  lesson_done_today: boolean;
};

export type CheckTodayStreakResponse = {
  user_uuid: string;
  date: string;
  lesson_done_today: boolean;
  last_lesson_date: string | null;
};

function createEmptyUserStreak(uuid: string): UserStreakResponse {
  return {
    user_uuid: uuid,
    current_streak: 0,
    best_streak: 0,
    last_lesson_date: null,
    lesson_done_today: false,
  };
}

export async function getUserStreak(uuid: string, token: string): Promise<UserStreakResponse> {
  const body = await requestJson<UserStreakResponse>(
    `${AUTH_API_BASE_URL}/users/${uuid}/streak`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar a ofensiva do usuário.",
  );

  return body ?? createEmptyUserStreak(uuid);
}

export async function checkTodayStreak(uuid: string, token: string): Promise<CheckTodayStreakResponse> {
  const body = await requestJson<CheckTodayStreakResponse>(
    `${AUTH_API_BASE_URL}/users/${uuid}/streak/check-today`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível verificar a ofensiva de hoje.",
  );

  return body ?? {
    user_uuid: uuid,
    date: new Date().toISOString().slice(0, 10),
    lesson_done_today: false,
    last_lesson_date: null,
  };
}

export async function completeTodayStreak(uuid: string, token: string): Promise<void> {
  await requestJson<Record<string, unknown> | null>(
    `${AUTH_API_BASE_URL}/users/${uuid}/streak/complete-today`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível completar a ofensiva de hoje.",
  );
}

export async function syncTodayStreakCompletion(uuid: string, token: string): Promise<void> {
  const todayStatus = await checkTodayStreak(uuid, token);

  if (todayStatus.lesson_done_today) {
    return;
  }

  await completeTodayStreak(uuid, token);
}