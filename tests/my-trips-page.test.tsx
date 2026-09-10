/* eslint-disable @next/next/no-img-element */
import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MyTripsPage } from "@/components/dashboard/my-trips-page";

const apiMocks = vi.hoisted(() => ({
  getMyTrips: vi.fn(),
  getOwnProfileViews: vi.fn(),
  getTripEngagement: vi.fn(),
  deleteTrip: vi.fn()
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard"
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
  getMyTrips: apiMocks.getMyTrips,
  getOwnProfileViews: apiMocks.getOwnProfileViews,
  getTripEngagement: apiMocks.getTripEngagement,
  deleteTrip: apiMocks.deleteTrip,
  loadOwnedMedia: vi.fn(),
  publicMediaUrl: (id?: string | null) => (id ? `/media/${id}` : null)
}));

const destination = {
  provider: "MAPBOX",
  providerPlaceId: "india",
  name: "India",
  displayName: "India",
  country: "India",
  countryCode: "IN",
  latitude: 20,
  longitude: 78
};

const trip = (overrides: Record<string, unknown>) => ({
  id: "trip",
  ownerUserId: "user-1",
  status: "PUBLISHED",
  slug: "trip",
  title: "Trip",
  destination,
  startDate: "2026-01-01",
  endDate: "2026-01-03",
  durationDays: 3,
  tripGroup: "FRIENDS",
  coverMediaId: "cover",
  styles: [],
  highlights: [],
  galleryMediaIds: [],
  itinerary: [],
  budgetCategories: {},
  completion: {
    basics: true,
    story: true,
    budget: true,
    readyToPublish: true
  },
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  version: 1,
  ...overrides
});

describe("My Trips page", () => {
  beforeEach(() => {
    apiMocks.getOwnProfileViews.mockResolvedValue({ views: 42 });
    apiMocks.getMyTrips.mockResolvedValue({
      content: [
        trip({
          id: "old",
          slug: "old-trip",
          title: "Old Kerala Journey",
          destination: { ...destination, displayName: "Kerala, India" },
          publishedAt: "2026-01-05T00:00:00Z"
        }),
        trip({
          id: "new",
          slug: "new-trip",
          title: "Newest Mountain Journey",
          destination: { ...destination, displayName: "Himachal Pradesh, India" },
          publishedAt: "2026-06-05T00:00:00Z"
        }),
        trip({
          id: "popular",
          slug: "popular-trip",
          title: "Popular Goa Journey",
          destination: { ...destination, displayName: "Goa, India" },
          publishedAt: "2026-03-05T00:00:00Z"
        }),
        trip({
          id: "draft",
          status: "DRAFT",
          slug: null,
          title: "Draft without cover",
          destination: { ...destination, displayName: "Mumbai, India" },
          coverMediaId: null,
          updatedAt: "2026-07-05T00:00:00Z"
        })
      ],
      page: 0,
      size: 50,
      totalElements: 3,
      totalPages: 1
    });
    apiMocks.getTripEngagement.mockResolvedValue([
      { tripId: "old", views: 100, likes: 2, likedByMe: false },
      { tripId: "new", views: 200, likes: 4, likedByMe: false },
      { tripId: "popular", views: 900, likes: 30, likedByMe: false }
    ]);
  });

  it("sorts by date and popularity, searches trips, and exposes mobile routes", async () => {
    render(<MyTripsPage />);

    const results = await screen.findByRole("list", { name: "My trip results" });
    const titles = () =>
      within(results)
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent);

    expect(titles()).toEqual([
      "Newest Mountain Journey",
      "Popular Goa Journey",
      "Old Kerala Journey"
    ]);

    fireEvent.change(screen.getByRole("combobox", { name: "Sort trips" }), {
      target: { value: "popular" }
    });
    expect(titles()[0]).toBe("Popular Goa Journey");

    fireEvent.change(screen.getByRole("combobox", { name: "Sort trips" }), {
      target: { value: "oldest" }
    });
    expect(titles()[0]).toBe("Old Kerala Journey");

    fireEvent.change(screen.getByPlaceholderText("Search my trips..."), {
      target: { value: "Goa" }
    });
    expect(titles()).toEqual(["Popular Goa Journey"]);

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile dashboard navigation"
    });
    expect(
      within(mobileNavigation).getByRole("link", { name: "Publish" })
    ).toHaveAttribute("href", "/dashboard/create-trip");
    expect(
      within(mobileNavigation).queryByRole("link", { name: "Footprint" })
    ).not.toBeInTheDocument();
    expect(within(mobileNavigation).getAllByRole("link")).toHaveLength(5);

    fireEvent.change(screen.getByPlaceholderText("Search my trips..."), {
      target: { value: "" }
    });
    fireEvent.click(screen.getByRole("tab", { name: "Drafts" }));
    expect(screen.getByAltText("Draft without cover cover photo")).toHaveAttribute(
      "src",
      "/images/hero/mountain-lake-traveler.png"
    );
  });
});
