import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  authenticateWithGoogle,
  authenticationSessionNeedsRefresh,
  clearAuthenticationSession,
  getAuthenticationSession,
  refreshAuthenticationSession,
  saveAuthenticationSession,
  type AuthenticationSession
} from "@/lib/auth-client";

const session: AuthenticationSession = {
  accessToken: "aftertrip-access-token",
  refreshToken: "aftertrip-refresh-token",
  tokenType: "Bearer",
  expiresInSeconds: 900,
  user: {
    id: "0d78f2e1-cfef-4828-8138-48492c01af12",
    email: "traveler@example.com",
    displayName: "AfterTrip Traveler",
    status: "ACTIVE",
    createdAt: "2026-08-26T10:00:00Z",
    updatedAt: "2026-08-26T10:00:00Z",
    lastLoginAt: "2026-08-26T10:00:00Z"
  }
};

describe("auth client", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("exchanges a Google credential for an AfterTrip session", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(session), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(authenticateWithGoogle("google-id-token")).resolves.toEqual(
      session
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/auth/google",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ idToken: "google-id-token" })
      })
    );
  });

  it("surfaces the backend error message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Google token is invalid." }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        })
      )
    );

    await expect(authenticateWithGoogle("expired-token")).rejects.toThrow(
      "Google token is invalid."
    );
  });

  it("stores and clears the browser session", () => {
    saveAuthenticationSession(session);
    expect(getAuthenticationSession()).toEqual(session);

    clearAuthenticationSession();
    expect(getAuthenticationSession()).toBeNull();
  });

  it("recognizes an access token that is close to expiry", () => {
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 30 }));

    expect(
      authenticationSessionNeedsRefresh({
        ...session,
        accessToken: `header.${payload}.signature`
      })
    ).toBe(true);
  });

  it("shares one refresh request between concurrent saves", async () => {
    saveAuthenticationSession(session);
    const refreshed = {
      ...session,
      accessToken: "refreshed-access-token",
      refreshToken: "rotated-refresh-token"
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(refreshed), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const [first, second] = await Promise.all([
      refreshAuthenticationSession(),
      refreshAuthenticationSession()
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(first).toEqual(refreshed);
    expect(second).toEqual(refreshed);
    expect(getAuthenticationSession()).toEqual(refreshed);
  });
});
