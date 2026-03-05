import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

export type UserApiItem = {
  id: number | string;
  uuid?: string;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
};

type UsersResponse = {
  users: UserApiItem[];
};

export type CreateUserPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type UpdateUserPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
};

function getAdminHeaders(adminUuid: string): HeadersInit {
  return {
    Accept: "application/json",
    "x-api-key": AUTH_API_KEY,
    "x-admin-uuid": adminUuid,
  };
}

export async function getAllUsers(adminUuid: string): Promise<UsersResponse> {
  const body = await requestJson<UsersResponse>(
    `${AUTH_API_BASE_URL}/users`,
    {
      method: "GET",
      headers: getAdminHeaders(adminUuid),
    },
    "Não foi possível carregar os usuários.",
  );

  return body ?? { users: [] };
}

export async function createUser(adminUuid: string, payload: CreateUserPayload): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/users`,
    {
      method: "POST",
      headers: {
        ...getAdminHeaders(adminUuid),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    "Não foi possível adicionar o usuário.",
  );
}

export async function updateUser(
  adminUuid: string,
  userId: string,
  payload: UpdateUserPayload,
): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/users/${userId}`,
    {
      method: "PATCH",
      headers: {
        ...getAdminHeaders(adminUuid),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    "Não foi possível atualizar o usuário.",
  );
}

export async function deleteUser(adminUuid: string, userId: string): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/users/${userId}`,
    {
      method: "DELETE",
      headers: getAdminHeaders(adminUuid),
    },
    "Não foi possível deletar o usuário.",
  );
}

export async function promoteUserToAdmin(adminUuid: string, userId: string): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/users/${userId}/promote`,
    {
      method: "PATCH",
      headers: getAdminHeaders(adminUuid),
    },
    "Não foi possível promover o usuário a administrador.",
  );
}

export async function removeUserAdmin(adminUuid: string, userId: string): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/users/${userId}/remove-admin`,
    {
      method: "PATCH",
      headers: getAdminHeaders(adminUuid),
    },
    "Não foi possível remover privilégios de administrador.",
  );
}