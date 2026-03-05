import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

export type ChallengeItem = {
  id: number;
  name: string;
  unit: string;
  target_value: number;
  xp_reward: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ChallengesResponse = {
  challenges: ChallengeItem[];
};

export type SingleChallengeResponse = {
  challenge: ChallengeItem;
};

export type CreateChallengePayload = {
  name: string;
  unit: string;
  target_value: number;
  xp_reward: number;
  is_active: boolean;
};

export type ChallengeType = {
  id: number;
  name: string;
};

export type ChallengeTypesResponse = {
  challenge_types: ChallengeType[];
};

export async function getChallengeTypes(): Promise<ChallengeType[]> {
  const body = await requestJson<ChallengeTypesResponse>(
    `${AUTH_API_BASE_URL}/challenge-types`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar os tipos de desafio.",
  );

  return body?.challenge_types ?? [];
}

export async function getAllChallenges(): Promise<ChallengesResponse> {
  const body = await requestJson<ChallengesResponse>(
    `${AUTH_API_BASE_URL}/challenges`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar os desafios.",
  );

  return body ?? { challenges: [] };
}

export async function getChallengeById(id: number): Promise<ChallengeItem> {
  const body = await requestJson<SingleChallengeResponse>(
    `${AUTH_API_BASE_URL}/challenges/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar o desafio.",
  );

  if (!body || !body.challenge) {
    throw new Error("Desafio não encontrado");
  }

  return body.challenge;
}

export async function createChallenge(payload: CreateChallengePayload, token: string): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/challenges`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
      body: JSON.stringify(payload),
    },
    "Não foi possível cadastrar o desafio.",
  );
}

export async function updateChallenge(
  id: number,
  payload: CreateChallengePayload,
  token: string,
): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/challenges/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
      body: JSON.stringify(payload),
    },
    "Não foi possível atualizar o desafio.",
  );
}

export async function deleteChallenge(id: number, token: string): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/challenges/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível deletar o desafio.",
  );
}
