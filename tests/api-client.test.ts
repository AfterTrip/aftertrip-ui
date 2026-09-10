import { beforeEach, describe, expect, it, vi } from "vitest";
import { gatewayRequest } from "@/lib/api-client";
import { getTripEngagement } from "@/lib/aftertrip-api";
import {
  getAuthenticationSession,
  saveAuthenticationSession,
  type AuthenticationSession
} from "@/lib/auth-client";

function jwtExpiringIn(seconds: number) {
  const payload = btoa(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + seconds })
  );
  return `header.${payload}.signature`;
}

function session(accessToken: string): AuthenticationSession {
  return {
    accessToken,
    refreshToken: "refresh-token",
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
}

describe("gateway API client authentication", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("renews a nearly expired token before a protected save", async () => {
    saveAuthenticationSession(session(jwtExpiringIn(20)));
    const refreshed = session(jwtExpiringIn(900));
    refreshed.refreshToken = "rotated-refresh-token";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(refreshed), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ saved: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      gatewayRequest<{ saved: boolean }>("/api/v1/trips/trip-id/itinerary", {
        method: "PUT",
        authenticated: true,
        body: { days: [] }
      })
    ).resolves.toEqual({ saved: true });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "http://localhost:8080/api/v1/auth/refresh"
    );
    const saveHeaders = fetchMock.mock.calls[1]?.[1]?.headers as Headers;
    expect(saveHeaders.get("Authorization")).toBe(
      `Bearer ${refreshed.accessToken}`
    );
  });

  it("returns a friendly session error when renewal fails", async () => {
    saveAuthenticationSession(session(jwtExpiringIn(20)));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: "Refresh token is invalid or expired" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        )
      )
    );

    await expect(
      gatewayRequest("/api/v1/trips/trip-id/basics", {
        method: "PUT",
        authenticated: true,
        body: {}
      })
    ).rejects.toMatchObject({
      message: "Your sign-in expired. Please sign in again to continue.",
      code: "SESSION_EXPIRED"
    });
    expect(getAuthenticationSession()).toBeNull();
  });

  it("does not expose an invalid-bearer response after renewal", async () => {
    saveAuthenticationSession(session(jwtExpiringIn(20)));
    const refreshed = session(jwtExpiringIn(900));
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(refreshed), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Invalid bearer token" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      gatewayRequest("/api/v1/trips/trip-id/itinerary", {
        method: "PUT",
        authenticated: true,
        body: { days: [] }
      })
    ).rejects.toMatchObject({
      message: "Your sign-in expired. Please sign in again to continue.",
      code: "SESSION_EXPIRED"
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not attach a bearer token to public requests", async () => {
    saveAuthenticationSession(session(jwtExpiringIn(-60)));
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ content: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await gatewayRequest("/api/v1/discovery/trips");

    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.has("Authorization")).toBe(false);
  });

  it("attaches a bearer token to engagement reads for signed-in users", async () => {
    saveAuthenticationSession(session("aftertrip-access-token"));
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [{ tripId: "trip-1", views: 10, likes: 2, likedByMe: true }]
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getTripEngagement(["trip-1"])).resolves.toEqual([
      { tripId: "trip-1", views: 10, likes: 2, likedByMe: true }
    ]);

    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer aftertrip-access-token");
  });
});
