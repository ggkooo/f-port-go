import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

export type ProfileUser = {
  id: number;
  uuid: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  state: string | null;
  city: string | null;
  school: string | null;
  class: string | number | null;
  shift: string | number | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileResponse = {
  user: ProfileUser;
};

export type UpdateProfilePayload = {
  phone: string;
  email: string;
  state: string;
  city: string;
  school: string;
  class: number;
  shift: number;
};

export async function getProfile(uuid: string, token: string): Promise<ProfileResponse> {
  const body = await requestJson<ProfileResponse>(
    `${AUTH_API_BASE_URL}/profile/${uuid}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível carregar o perfil do usuário.",
  );

  return body ?? { user: {} as ProfileUser };
}

export async function updateProfile(token: string, payload: UpdateProfilePayload): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/profile`,
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
    "Não foi possível salvar os dados do perfil.",
  );
}
