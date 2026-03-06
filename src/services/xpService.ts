import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

type UpdateXpPayload = {
  xp: number;
};

export async function updateUserXp(uuid: string, xpAmount: number, token: string): Promise<void> {
  await requestJson<Record<string, unknown> | null>(
    `${AUTH_API_BASE_URL}/users/${uuid}/xp`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
      body: JSON.stringify({ xp: xpAmount } satisfies UpdateXpPayload),
    },
    "Não foi possível atualizar o XP do usuário.",
  );
}
