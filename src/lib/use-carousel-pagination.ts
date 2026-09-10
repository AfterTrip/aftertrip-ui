"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

type CarouselPagination = {
  activePage: number;
  pageCount: number;
  scrollToPage: (page: number) => void;
};

type CarouselMetrics = {
  activePage: number;
  pageCount: number;
  pageOffsets: number[];
};

export function getCarouselMetrics(carousel: HTMLElement): CarouselMetrics {
  const cards = Array.from(carousel.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.offsetWidth > 0
  );
  const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
  if (!cards.length || maxScroll <= 2) {
    return { activePage: 0, pageCount: 1, pageOffsets: [0] };
  }

  const firstCard = cards[0];
  const gap =
    cards.length > 1
      ? Math.max(
          0,
          cards[1].offsetLeft - firstCard.offsetLeft - firstCard.offsetWidth
        )
      : 0;
  const cardStep = firstCard.offsetWidth + gap;
  const visibleCards = Math.max(
    1,
    Math.floor((carousel.clientWidth + gap + 1) / Math.max(1, cardStep))
  );
  const pageCount = Math.ceil(cards.length / visibleCards);
  const pageOffsets = Array.from({ length: pageCount }, (_, page) => {
    const card = cards[Math.min(page * visibleCards, cards.length - 1)];
    return Math.min(
      maxScroll,
      Math.max(0, card.offsetLeft - firstCard.offsetLeft)
    );
  });
  const activePage = pageOffsets.reduce(
    (nearestPage, offset, page) =>
      Math.abs(offset - carousel.scrollLeft) <
      Math.abs(pageOffsets[nearestPage] - carousel.scrollLeft)
        ? page
        : nearestPage,
    0
  );

  return { activePage, pageCount, pageOffsets };
}

export function useCarouselPagination(
  carouselRef: RefObject<HTMLElement | null>,
  contentVersion: number
): CarouselPagination {
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const measure = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel || carousel.clientWidth <= 0) return;

    const metrics = getCarouselMetrics(carousel);
    setPageCount(metrics.pageCount);
    setActivePage(metrics.activePage);
  }, [carouselRef]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const frame = window.requestAnimationFrame(measure);
    const handleScroll = () => window.requestAnimationFrame(measure);
    carousel.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", measure);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measure);
    resizeObserver?.observe(carousel);

    return () => {
      window.cancelAnimationFrame(frame);
      carousel.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measure);
      resizeObserver?.disconnect();
    };
  }, [carouselRef, contentVersion, measure]);

  const scrollToPage = useCallback(
    (page: number) => {
      const carousel = carouselRef.current;
      if (!carousel || pageCount <= 1) return;

      const metrics = getCarouselMetrics(carousel);
      const boundedPage = Math.max(0, Math.min(page, metrics.pageCount - 1));
      carousel.scrollTo({
        left: metrics.pageOffsets[boundedPage],
        behavior: "smooth"
      });
      setActivePage(boundedPage);
    },
    [carouselRef, pageCount]
  );

  return { activePage, pageCount, scrollToPage };
}
