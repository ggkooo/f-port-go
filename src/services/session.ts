export type UserSession = {
  uuid: string;
  email: string;
  token: string;
  profileCompleted: boolean;
};

const USER_SESSION_KEY = "user_session";
const SESSION_EXPIRY_KEY = "user_session_expiry";
const SESSION_VALIDITY_DAYS = 7;

export function saveSession(session: UserSession): void {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + SESSION_VALIDITY_DAYS);

  sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  sessionStorage.setItem(SESSION_EXPIRY_KEY, expiryDate.toISOString());
}

export function getSession(): UserSession | null {
  const session = sessionStorage.getItem(USER_SESSION_KEY);
  const expiry = sessionStorage.getItem(SESSION_EXPIRY_KEY);

  if (!session || !expiry) {
    return null;
  }

  const expiryDate = new Date(expiry);
  if (new Date() > expiryDate) {
    clearSession();
    return null;
  }

  try {
    return JSON.parse(session) as UserSession;
  } catch {
    clearSession();
    return null;
  }
}

export function isSessionValid(): boolean {
  return getSession() !== null;
}

export function clearSession(): void {
  sessionStorage.removeItem(USER_SESSION_KEY);
  sessionStorage.removeItem(SESSION_EXPIRY_KEY);
}

export function getSessionToken(): string | null {
  const session = getSession();
  return session?.token ?? null;
}

export function updateSession(partialSession: Partial<UserSession>): void {
  const currentSession = getSession();

  if (!currentSession) {
    return;
  }

  saveSession({
    ...currentSession,
    ...partialSession,
  });
}
