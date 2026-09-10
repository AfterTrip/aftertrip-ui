import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TripSectionTabs } from "@/components/trip/trip-section-tabs";

describe("trip section tabs", () => {
  it("marks the selected section as active", () => {
    render(
      <>
        <TripSectionTabs hasTravelerNotes hasGallery />
        <section id="overview" />
        <section id="itinerary" />
        <section id="tips" />
        <section id="gallery" />
      </>
    );

    const overview = screen.getByRole("link", { name: /overview/i });
    const itinerary = screen.getByRole("link", { name: /itinerary/i });

    expect(overview).toHaveClass("active");
    fireEvent.click(itinerary);
    expect(itinerary).toHaveClass("active");
    expect(itinerary).toHaveAttribute("aria-current", "true");
  });

  it("hides tabs for sections that are not on the page", () => {
    render(<TripSectionTabs hasTravelerNotes={false} hasGallery={false} />);

    expect(
      screen.queryByRole("link", { name: /highlights/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /gallery/i })
    ).not.toBeInTheDocument();
  });
});
