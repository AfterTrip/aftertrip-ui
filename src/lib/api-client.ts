import {
  authenticationSessionNeedsRefresh,
  clearAuthenticationSession,
  getAuthenticationSession,
  refreshAuthenticationSession
} from "@/lib/auth-client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/user-facing-errors";

type ApiErrorBody = {
  code?: string;
  message?: string;
  correlationId?: string;
  fieldErrors?: Record<string, string>;
};

export class AfterTripApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = "API_REQUEST_FAILED",
    public readonly correlationId?: string,
    public readonly fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "AfterTripApiError";
  }
}

type GatewayRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  authenticated?: boolean;
  retryAuthentication?: boolean;
  timeoutMs?: number;
};

const gatewayBaseUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080").replace(
    /\/$/,
    ""
  );

export async function gatewayRequest<T>(
  path: string,
  options: GatewayRequestOptions = {}
): Promise<T> {
  if (!path.startsWith("/api/")) {
    throw new Error("Gateway paths must start with /api/");
  }

  const {
    authenticated = false,
    retryAuthentication = true,
    body,
    timeoutMs = 20_000,
    headers: suppliedHeaders,
    ...requestInit
  } = options;
  let session = getAuthenticationSession();
  let refreshedBeforeRequest = false;
  if (authenticated && !session) {
    throw new AfterTripApiError(
      GENERIC_ERROR_MESSAGE,
      401,
      "AUTHENTICATION_REQUIRED"
    );
  }

  if (
    authenticated &&
    retryAuthentication &&
    session &&
    authenticationSessionNeedsRefresh(session)
  ) {
    try {
      session = await refreshAuthenticationSession();
      refreshedBeforeRequest = true;
    } catch {
      throwSessionExpired();
    }
  }

  const headers = new Headers(suppliedHeaders);
  headers.set(
    "X-Correlation-ID",
    globalThis.crypto?.randomUUID?.() ??
      `web-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  if (authenticated && session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  let requestBody: BodyInit | undefined;
  if (body instanceof FormData || typeof body === "string") {
    requestBody = body;
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(`${gatewayBaseUrl()}${path}`, {
    ...requestInit,
    body: requestBody,
    headers,
    cache: "no-store",
    signal: requestInit.signal ?? AbortSignal.timeout(timeoutMs)
  });

  if (response.status === 401 && authenticated) {
    if (retryAuthentication && !refreshedBeforeRequest) {
      try {
        await refreshAuthenticationSession();
        return gatewayRequest<T>(path, {
          ...options,
          retryAuthentication: false
        });
      } catch {
        throwSessionExpired();
      }
    }
    throwSessionExpired();
  }

  if (!response.ok) {
    const error = await readApiError(response);
    if (process.env.NODE_ENV !== "production") {
      console.error("AfterTrip API request failed", {
        path,
        status: response.status,
        code: error.code,
        correlationId: error.correlationId,
        fieldErrors: error.fieldErrors
      });
    }
    throw new AfterTripApiError(
      GENERIC_ERROR_MESSAGE,
      response.status,
      error.code,
      error.correlationId,
      error.fieldErrors
    );
  }

  if (response.status === 204) return undefined as T;
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return (await response.blob()) as T;
  }
  return (await response.json()) as T;
}

function throwSessionExpired(): never {
  clearAuthenticationSession();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("aftertrip:session-expired"));
  }
  throw new AfterTripApiError(GENERIC_ERROR_MESSAGE, 401, "SESSION_EXPIRED");
}

async function readApiError(response: Response): Promise<ApiErrorBody> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return {};
  try {
    return (await response.json()) as ApiErrorBody;
  } catch {
    return {};
  }
}
