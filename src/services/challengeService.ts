import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

const CHALLENGES_STORAGE_KEY_PREFIX = "portgo.challenges.today";

export type UserChallenge = {
  id: number;
  user_id: number;
  challenge_id: number;
  challenge_name: string;
  unit: string;
  target_value: number;
  current_value: number;
  xp_reward: number;
  challenge_date: string;
  position: number;
  completed_at: string | null;
};

export type TodayChallengesResponse = {
  user_uuid: string;
  date: string;
  count: number;
  challenges: UserChallenge[];
};

type IncrementChallengePayload = {
  increment: number;
};

export type SessionChallengeMetrics = {
  elapsedMinutesRounded: number;
  completedLessons: number;
  consecutiveCorrectAnswers: number;
};

function createEmptyTodayChallenges(uuid: string): TodayChallengesResponse {
  return {
    user_uuid: uuid,
    date: new Date().toISOString().slice(0, 10),
    count: 0,
    challenges: [],
  };
}

function getStorageKey(uuid: string): string {
  return `${CHALLENGES_STORAGE_KEY_PREFIX}.${uuid}`;
}

function getIncrementValueByUnit(challenge: UserChallenge, metrics: SessionChallengeMetrics): number {
  if (challenge.unit === "minutes") {
    return metrics.elapsedMinutesRounded;
  }

  if (challenge.unit === "lessons") {
    return metrics.completedLessons;
  }

  if (challenge.unit === "streak_exercises") {
    return metrics.consecutiveCorrectAnswers >= challenge.target_value
      ? challenge.target_value
      : 0;
  }

  return 0;
}

function getSafeMetricValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.round(value));
}

export function getStoredTodayChallenges(uuid: string): TodayChallengesResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getStorageKey(uuid));
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as TodayChallengesResponse;

    if (!parsed || parsed.user_uuid !== uuid || !Array.isArray(parsed.challenges)) {
      return null;
    }

    const today = new Date().toISOString().slice(0, 10);
    if (parsed.date !== today) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveTodayChallengesToStorage(data: TodayChallengesResponse): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(data.user_uuid), JSON.stringify(data));
}

export async function getTodayChallenges(uuid: string, token: string): Promise<TodayChallengesResponse> {
  const body = await requestJson<TodayChallengesResponse>(
    `${AUTH_API_BASE_URL}/users/${uuid}/challenges/today`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar os desafios do dia.",
  );

  return body ?? createEmptyTodayChallenges(uuid);
}

export async function getAndStoreTodayChallenges(uuid: string, token: string): Promise<TodayChallengesResponse> {
  const data = await getTodayChallenges(uuid, token);
  saveTodayChallengesToStorage(data);
  return data;
}

export async function incrementChallengeProgress(
  uuid: string,
  dailyChallengeId: number,
  increment: number,
  token: string,
): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/users/${uuid}/challenges/${dailyChallengeId}/progress`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
      body: JSON.stringify({ increment } satisfies IncrementChallengePayload),
    },
    "Não foi possível atualizar o progresso do desafio.",
  );
}

export async function syncChallengeProgressFromSession(
  uuid: string,
  token: string,
  metrics: SessionChallengeMetrics,
): Promise<TodayChallengesResponse> {
  const safeMetrics: SessionChallengeMetrics = {
    elapsedMinutesRounded: getSafeMetricValue(metrics.elapsedMinutesRounded),
    completedLessons: getSafeMetricValue(metrics.completedLessons),
    consecutiveCorrectAnswers: getSafeMetricValue(metrics.consecutiveCorrectAnswers),
  };

  const challengesData = getStoredTodayChallenges(uuid) ?? (await getAndStoreTodayChallenges(uuid, token));
  const updatedChallenges = [...challengesData.challenges];

  for (let index = 0; index < updatedChallenges.length; index += 1) {
    const challenge = updatedChallenges[index];
    const metricIncrement = getIncrementValueByUnit(challenge, safeMetrics);
    const remaining = Math.max(0, challenge.target_value - challenge.current_value);
    const increment = Math.min(remaining, metricIncrement);

    if (increment <= 0) {
      continue;
    }

    await incrementChallengeProgress(uuid, challenge.id, increment, token);

    const nextCurrentValue = challenge.current_value + increment;
    updatedChallenges[index] = {
      ...challenge,
      current_value: nextCurrentValue,
      completed_at:
        nextCurrentValue >= challenge.target_value
          ? challenge.completed_at ?? new Date().toISOString()
          : challenge.completed_at,
    };
  }

  const updatedData: TodayChallengesResponse = {
    ...challengesData,
    challenges: updatedChallenges,
    count: updatedChallenges.length,
  };

  saveTodayChallengesToStorage(updatedData);
  return updatedData;
}