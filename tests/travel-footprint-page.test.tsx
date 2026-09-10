/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TravelFootprintPage } from "@/components/dashboard/travel-footprint-page";

const apiMocks = vi.hoisted(() => ({
  getOwnProfile: vi.fn(),
  getOwnTravelFootprint: vi.fn()
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/travel-footprint"
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill: ignoredFill,
    priority: ignoredPriority,
    sizes: ignoredSizes,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    [key: string]: unknown;
  }) => {
    void ignoredFill;
    void ignoredPriority;
    void ignoredSizes;
    return <img src={src} alt={alt} {...props} />;
  }
}));

vi.mock("@/lib/use-authenticated-page", () => ({
  useAuthenticatedPage: () => true
}));

vi.mock("@/components/layout/account-menu", () => ({
  AccountMenu: () => <div data-testid="account-menu" />
}));

vi.mock("@/components/theme/theme-toggle", () => ({
  ThemeToggle: () => <button type="button">Theme</button>
}));

vi.mock("@/lib/aftertrip-api", () => ({
  getOwnProfile: apiMocks.getOwnProfile,
  getOwnTravelFootprint: apiMocks.getOwnTravelFootprint,
  publicMediaUrl: (id?: string | null) => (id ? `/media/${id}` : null)
}));

describe("Travel Footprint page", () => {
  beforeEach(() => {
    apiMocks.getOwnProfile.mockResolvedValue({
      displayName: "Sreehari P",
      location: "Kochi, Kerala, India",
      tagline: "Same places, different perspectives.",
      avatarMediaId: "avatar",
      coverMediaId: "cover"
    });
    apiMocks.getOwnTravelFootprint.mockResolvedValue({
      summary: {
        trips: 3,
        travelDays: 14,
        destinations: 2,
        countries: 1,
        achievementsUnlocked: 2
      },
      destinations: [
        {
          name: "Meghalaya",
          displayName: "Meghalaya, India",
          latitude: 25.467,
          longitude: 91.3662,
          trips: 2
        },
        {
          name: "Goa",
          displayName: "Goa, India",
          latitude: 15.2993,
          longitude: 74.124,
          trips: 1
        }
      ],
      travelDna: [{ key: "NATURE", trips: 3, percentage: 82 }],
      travelWith: [{ key: "FRIENDS", trips: 2, percentage: 67 }],
      achievements: [
        {
          code: "FIRST_JOURNEY",
          title: "First Journey",
          description: "Published your first journey"
        },
        {
          code: "NATURE_LOVER",
          title: "Nature Lover",
          description: "Shared three nature trips"
        }
      ],
      journeys: [
        {
          tripId: "trip-1",
          destination: "Meghalaya, India",
          durationDays: 7
        },
        {
          tripId: "trip-2",
          destination: "Meghalaya, India",
          durationDays: 4
        },
        {
          tripId: "trip-3",
          destination: "Goa, India",
          durationDays: 3
        }
      ]
    });
  });

  it("renders API-backed profile insights and exposes the primary mobile navigation", async () => {
    render(<TravelFootprintPage />);

    expect(
      screen.getByText("Loading your travel footprint...")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /^Traveler$/ })
    ).not.toBeInTheDocument();

    expect(
      await screen.findByRole("heading", { name: "Sreehari P" })
    ).toBeInTheDocument();
    expect(screen.getByText("Kochi, Kerala, India")).toBeInTheDocument();
    expect(
      screen.getByText("Same places, different perspectives.")
    ).toBeInTheDocument();

    const summary = screen.getByLabelText("Travel summary");
    expect(within(summary).getByText("3")).toBeInTheDocument();
    expect(within(summary).getByText("14")).toBeInTheDocument();
    expect(within(summary).getByText("2/50")).toBeInTheDocument();

    expect(screen.getByText("Nature")).toBeInTheDocument();
    expect(screen.getByText("82%")).toBeInTheDocument();
    expect(screen.getByText("First Journey")).toBeInTheDocument();
    expect(screen.getByText("Friends")).toBeInTheDocument();
    expect(screen.getByText("67%")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Verified destination Mapbox map")
    ).toBeInTheDocument();

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile dashboard navigation"
    });
    expect(
      within(mobileNavigation).queryByRole("link", { name: "Footprint" })
    ).not.toBeInTheDocument();
    expect(
      within(mobileNavigation).getByRole("link", { name: "Publish" })
    ).toHaveAttribute("href", "/dashboard/create-trip");
    expect(
      within(mobileNavigation).getByRole("link", { name: "My Trips" })
    ).toHaveAttribute("href", "/dashboard");
    expect(within(mobileNavigation).getAllByRole("link")).toHaveLength(5);
    expect(
      within(mobileNavigation).queryByRole("link", { current: "page" })
    ).not.toBeInTheDocument();
  });
});
