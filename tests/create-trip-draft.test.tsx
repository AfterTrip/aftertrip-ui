/* eslint-disable @next/next/no-img-element */
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CreateTripPage } from "@/components/dashboard/create-trip-page";
import { createTripDraft, updateTripBasics } from "@/lib/aftertrip-api";

const router = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn()
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router
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

vi.mock("@/lib/aftertrip-api", () => ({
  createTripDraft: vi.fn().mockResolvedValue({ id: "draft-1" }),
  deleteTrip: vi.fn(),
  deleteMedia: vi.fn(),
  getOwnedMedia: vi.fn(),
  getOwnedTrip: vi.fn(),
  loadOwnedMedia: vi.fn(),
  publishTrip: vi.fn(),
  resolveLocation: vi.fn(),
  searchLocations: vi.fn(),
  updateTripBasics: vi.fn().mockResolvedValue({}),
  updateTripBudget: vi.fn().mockResolvedValue({}),
  updateTripItinerary: vi.fn().mockResolvedValue({}),
  updateTripStory: vi.fn().mockResolvedValue({}),
  uploadMedia: vi.fn()
}));

describe("create trip draft lifecycle", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("does not create a draft just by opening the create-trip page", async () => {
    render(<CreateTripPage />);

    await act(async () => undefined);

    expect(createTripDraft).not.toHaveBeenCalled();
    expect(screen.getByText("Not saved yet")).toBeInTheDocument();
  });

  it("previews an incomplete trip without creating a draft", async () => {
    render(<CreateTripPage />);

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));

    expect(
      screen.getByRole("dialog", { name: "Your trip title" })
    ).toBeInTheDocument();
    expect(screen.getByText("Only you can see this draft")).toBeInTheDocument();
    expect(createTripDraft).not.toHaveBeenCalled();
  });

  it("creates and persists a draft after the traveler enters content", async () => {
    vi.useFakeTimers();
    render(<CreateTripPage />);

    fireEvent.change(
      screen.getByPlaceholderText("e.g. Magical Meghalaya Escape"),
      { target: { value: "Weekend in Munnar" } }
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(701);
    });

    expect(createTripDraft).toHaveBeenCalledTimes(1);
    expect(updateTripBasics).toHaveBeenCalledWith(
      "draft-1",
      expect.objectContaining({ title: "Weekend in Munnar" })
    );
    expect(router.replace).toHaveBeenCalledWith(
      "/dashboard/create-trip?trip=draft-1"
    );
  });

  it("does not create a draft when an edit is cleared before autosave", async () => {
    vi.useFakeTimers();
    render(<CreateTripPage />);
    const title = screen.getByPlaceholderText(
      "e.g. Magical Meghalaya Escape"
    );

    fireEvent.change(title, { target: { value: "Temporary title" } });
    fireEvent.change(title, { target: { value: "" } });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(701);
    });

    expect(createTripDraft).not.toHaveBeenCalled();
  });

  it("keeps the wizard controls interactive across every step", () => {
    render(<CreateTripPage />);

    fireEvent.click(screen.getByRole("button", { name: /About Trip/i }));
    const roadTrip = screen.getByRole("button", { name: "Road trip" });
    fireEvent.click(roadTrip);
    expect(roadTrip).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: /Itinerary/i }));
    fireEvent.click(screen.getByRole("button", { name: /Add another day/i }));
    expect(
      screen.getByRole("button", { name: "Remove day 2" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Budget details/i }));
    fireEvent.click(screen.getByRole("button", { name: "Budget range" }));
    expect(screen.getByPlaceholderText("e.g. 20000")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. 30000")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "INR" }));
    fireEvent.click(screen.getByRole("option", { name: "USD" }));
    expect(screen.getByRole("button", { name: "USD" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Final check/i }));
    expect(screen.getByRole("button", { name: "Publish Trip" })).toBeDisabled();
  });
});
