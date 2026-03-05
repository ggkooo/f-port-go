import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

export type OverviewStatistics = {
  total_questions: number;
  total_users: number;
  total_challenges: number;
};

export type OverviewResponse = {
  statistics: OverviewStatistics;
};

export async function getOverviewStatistics(): Promise<OverviewStatistics> {
  const body = await requestJson<OverviewResponse>(
    `${AUTH_API_BASE_URL}/statistics/overview`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar as estatísticas.",
  );

  if (!body || !body.statistics) {
    throw new Error("Estatísticas não encontradas");
  }

  return body.statistics;
}
