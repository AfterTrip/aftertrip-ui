export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

export interface AuthenticationSession {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: AuthenticatedUser;
}

interface ApiErrorBody {
  message?: string;
}

const AUTH_SESSION_KEY = "aftertrip.auth.session";
export const AUTH_SESSION_CHANGED_EVENT = "aftertrip:auth-session-changed";
const ACCESS_TOKEN_REFRESH_WINDOW_SECONDS = 60;

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  ).replace(/\/$/, "");
}

function isAuthenticationSession(
  value: unknown
): value is AuthenticationSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Partial<AuthenticationSession>;
  return (
    typeof session.accessToken === "string" &&
    typeof session.refreshToken === "string" &&
    typeof session.tokenType === "string" &&
    typeof session.expiresInSeconds === "number" &&
    !!session.user &&
    typeof session.user.id === "string" &&
    typeof session.user.email === "string"
  );
}

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

export async function authenticateWithGoogle(
  idToken: string
): Promise<AuthenticationSession> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ idToken })
  });

  const body = await readResponseBody(response);

  if (!response.ok) {
    const error = body as ApiErrorBody | null;
    throw new Error(
      error?.message ||
        "AfterTrip could not complete the sign-in. Please try again."
    );
  }

  if (!isAuthenticationSession(body)) {
    throw new Error("AfterTrip received an unexpected sign-in response.");
  }

  return body;
}

export function saveAuthenticationSession(session: AuthenticationSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

export function getAuthenticationSession(): AuthenticationSession | null {
  if (typeof window === "undefined") return null;
  const storedSession = sessionStorage.getItem(AUTH_SESSION_KEY);
  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession: unknown = JSON.parse(storedSession);
    return isAuthenticationSession(parsedSession) ? parsedSession : null;
  } catch {
    return null;
  }
}

export function authenticationSessionNeedsRefresh(
  session: AuthenticationSession,
  now = Date.now()
) {
  const expiresAt = accessTokenExpiration(session.accessToken);
  if (expiresAt === null) return false;
  return expiresAt - now <= ACCESS_TOKEN_REFRESH_WINDOW_SECONDS * 1000;
}

function accessTokenExpiration(accessToken: string): number | null {
  const payload = accessToken.split(".")[1];
  if (!payload || typeof globalThis.atob !== "function") return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const claims = JSON.parse(globalThis.atob(padded)) as { exp?: unknown };
    return typeof claims.exp === "number" ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function clearAuthenticationSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
}

let refreshInFlight: Promise<AuthenticationSession> | null = null;

export async function refreshAuthenticationSession(): Promise<AuthenticationSession> {
  if (refreshInFlight) return refreshInFlight;

  const current = getAuthenticationSession();
  if (!current?.refreshToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  refreshInFlight = (async () => {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: current.refreshToken })
    });
    const body = await readResponseBody(response);
    if (!response.ok || !isAuthenticationSession(body)) {
      clearAuthenticationSession();
      throw new Error("Your session has expired. Please sign in again.");
    }
    saveAuthenticationSession(body);
    return body;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

export async function logoutAuthenticationSession() {
  const current = getAuthenticationSession();
  clearAuthenticationSession();
  if (!current?.refreshToken) return;

  await fetch(`${getApiBaseUrl()}/api/v1/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: current.refreshToken })
  }).catch(() => undefined);
}

export function requireAuthenticationSession(): AuthenticationSession {
  const session = getAuthenticationSession();
  if (!session) {
    throw new Error("AUTHENTICATION_REQUIRED");
  }
  return session;
}

export function apiBaseUrl() {
  return getApiBaseUrl();
}
