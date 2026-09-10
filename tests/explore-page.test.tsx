/* eslint-disable @next/next/no-img-element */
import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExploreClient } from "@/app/explore/explore-client";

const apiMocks = vi.hoisted(() => ({
  searchTrips: vi.fn(),
  getProfiles: vi.fn(),
  getTripEngagement: vi.fn()
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

vi.mock("@/lib/aftertrip-api", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/aftertrip-api")>();
  return {
    ...original,
    searchTrips: apiMocks.searchTrips,
    getProfiles: apiMocks.getProfiles,
    getTripEngagement: apiMocks.getTripEngagement
  };
});

describe("Explore page", () => {
  beforeEach(() => {
    apiMocks.searchTrips.mockResolvedValue({
      content: [
        {
          tripId: "trip-1",
          ownerUserId: "user-1",
          slug: "meghalaya-living-roots",
          title: "Meghalaya: Clouds, Caves & Living Roots",
          coverMediaId: "cover-1",
          destination: {
            provider: "MAPBOX",
            providerPlaceId: "meghalaya",
            name: "Meghalaya",
            displayName: "Meghalaya, India",
            country: "India",
            countryCode: "IN",
            latitude: 25.467,
            longitude: 91.366
          },
          startDate: "2026-03-01",
          endDate: "2026-03-07",
          durationDays: 7,
          tripGroup: "FRIENDS",
          styles: ["NATURE", "ADVENTURE"],
          budget: {
            mode: "EXACT",
            currency: "INR",
            amount: 24800
          },
          publishedAt: "2026-03-10T10:00:00Z"
        }
      ],
      page: 0,
      size: 50,
      totalElements: 1,
      totalPages: 1
    });
    apiMocks.getProfiles.mockResolvedValue([
      {
        userId: "user-1",
        slug: "anisha-verma",
        displayName: "Anisha Verma",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
        version: 1
      }
    ]);
    apiMocks.getTripEngagement.mockResolvedValue([
      { tripId: "trip-1", views: 2600, likes: 521, likedByMe: false }
    ]);
  });

  it("keeps budget details visible and mobile filters interactive", async () => {
    render(<ExploreClient />);

    expect(
      await screen.findByRole("heading", {
        name: "Meghalaya: Clouds, Caves & Living Roots"
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText("₹24,800")).toHaveLength(2);
    expect(screen.getByText("per person")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    const dialog = screen.getByRole("dialog", {
      name: "Mobile trip filters"
    });
    fireEvent.click(within(dialog).getByRole("button", { name: "USD" }));
    fireEvent.click(
      within(dialog).getByRole("button", { name: "4-7 days" })
    );
    fireEvent.click(within(dialog).getByRole("button", { name: "Friends" }));
    fireEvent.click(within(dialog).getByRole("button", { name: "Nature" }));

    expect(within(dialog).getByText("$15 - $6,250")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "USD" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(
      within(dialog).getByRole("button", { name: "4-7 days" })
    ).toHaveAttribute("aria-pressed", "true");

    const sortSelects = screen.getAllByRole("combobox", { name: "Sort trips" });
    expect(sortSelects).toHaveLength(2);

    fireEvent.change(sortSelects[0], {
      target: { value: "Popular" }
    });

    sortSelects.forEach((select) => expect(select).toHaveValue("Popular"));
  });
});
