import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

type RankingApiItem = Record<string, unknown>;

type RankingApiResponse = {
  ranking?: unknown;
  top_10?: unknown;
  logged_user?: unknown;
};

export type RankingPlayer = {
  position: number;
  name: string;
  streak: number;
  xp: number;
  uuid: string | null;
  isCurrentUser: boolean;
};

export type RankingData = {
  ranking: RankingPlayer[];
  top10: RankingPlayer[];
  loggedUser: RankingPlayer | null;
};

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return fallback;
}

function toString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function getRankingItems(payload: unknown): RankingApiItem[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.filter((item): item is RankingApiItem => typeof item === "object" && item !== null);
}

function mapRankingItem(item: RankingApiItem, index: number, isCurrentUser = false): RankingPlayer {
  const position = toNumber(item.position ?? item.rank ?? item.place, index + 1);
  const firstName = toString(item.first_name);
  const lastName = toString(item.last_name);
  const composedName = firstName ? `${firstName}${lastName ? ` ${lastName}` : ""}` : null;

  return {
    position,
    name:
      toString(item.name) ??
      toString(item.user_name) ??
      toString(item.username) ??
      composedName ??
      `Jogador ${position}`,
    streak: toNumber(item.offensive ?? item.streak ?? item.current_streak ?? item.best_streak),
    xp: toNumber(item.xp_amount ?? item.xp ?? item.total_xp ?? item.points),
    uuid: toString(item.uuid ?? item.user_uuid),
    isCurrentUser: isCurrentUser || Boolean(item.is_current_user),
  };
}

export async function getRanking(token: string): Promise<RankingData> {
  const body = await requestJson<RankingApiResponse | unknown>(
    `${AUTH_API_BASE_URL}/ranking`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar o ranking.",
  );

  const payload = body && typeof body === "object" ? (body as RankingApiResponse) : {};

  const ranking = getRankingItems(payload.ranking)
    .map((item, index) => mapRankingItem(item, index))
    .sort((playerA, playerB) => playerA.position - playerB.position);

  const top10 = getRankingItems(payload.top_10)
    .map((item, index) => mapRankingItem(item, index))
    .sort((playerA, playerB) => playerA.position - playerB.position);

  const loggedUserRaw = payload.logged_user;
  const loggedUser =
    loggedUserRaw && typeof loggedUserRaw === "object" && !Array.isArray(loggedUserRaw)
      ? mapRankingItem(loggedUserRaw as RankingApiItem, 0, true)
      : null;

  return {
    ranking,
    top10,
    loggedUser,
  };
}
