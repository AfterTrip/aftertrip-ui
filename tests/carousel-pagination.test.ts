import { describe, expect, it } from "vitest";
import { getCarouselMetrics } from "@/lib/use-carousel-pagination";

function carouselWithPages({
  cards,
  cardWidth,
  gap,
  clientWidth,
  scrollLeft = 0
}: {
  cards: number;
  cardWidth: number;
  gap: number;
  clientWidth: number;
  scrollLeft?: number;
}) {
  const carousel = document.createElement("div");
  Array.from({ length: cards }, (_, index) => {
    const card = document.createElement("article");
    Object.defineProperties(card, {
      offsetWidth: { value: cardWidth },
      offsetLeft: { value: index * (cardWidth + gap) }
    });
    carousel.appendChild(card);
  });
  const scrollWidth = cards * cardWidth + Math.max(0, cards - 1) * gap;
  Object.defineProperties(carousel, {
    clientWidth: { value: clientWidth },
    scrollWidth: { value: Math.max(clientWidth, scrollWidth) },
    scrollLeft: { value: scrollLeft, writable: true }
  });
  return carousel;
}

describe("carousel pagination", () => {
  it("has one page and no extra pagination when all cards fit", () => {
    const carousel = carouselWithPages({
      cards: 1,
      cardWidth: 280,
      gap: 18,
      clientWidth: 1200
    });

    expect(getCarouselMetrics(carousel).pageCount).toBe(1);
  });

  it("groups cards by the number visible on each page", () => {
    const carousel = carouselWithPages({
      cards: 8,
      cardWidth: 286.5,
      gap: 18,
      clientWidth: 1200
    });

    expect(getCarouselMetrics(carousel).pageCount).toBe(2);
  });

  it("tracks the active page after horizontal scrolling", () => {
    const carousel = carouselWithPages({
      cards: 6,
      cardWidth: 286.5,
      gap: 18,
      clientWidth: 1200,
      scrollLeft: 627
    });

    expect(getCarouselMetrics(carousel).activePage).toBe(1);
  });
});
