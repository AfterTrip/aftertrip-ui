import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TripGallery } from "@/components/trip/trip-gallery";

describe("trip gallery", () => {
  it("shows the actual media count and treats AVIF metadata as an image", () => {
    render(
      <TripGallery
        images={[
          { src: "/one.jpg", alt: "First", type: "image" },
          { src: "/two.avif", alt: "Second", type: "image" },
          { src: "/three.mp4", alt: "Third", type: "video" }
        ]}
      />
    );

    expect(
      screen.getByRole("button", { name: "View all media (3)" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Video")).toHaveLength(1);
  });

  it("does not show uploaded filenames in the lightbox header", () => {
    render(
      <TripGallery
        images={[
          {
            src: "/uploads/IMG_4312-final.jpg",
            alt: "IMG_4312-final.jpg",
            type: "image"
          }
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "IMG_4312-final.jpg" }));

    const dialog = screen.getByRole("dialog", { name: "Trip media viewer" });
    expect(within(dialog).getByText("Photo")).toBeInTheDocument();
    expect(
      within(dialog).queryByText("IMG_4312-final.jpg")
    ).not.toBeInTheDocument();
  });
});
