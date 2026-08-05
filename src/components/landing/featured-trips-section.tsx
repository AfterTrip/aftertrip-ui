"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { featuredTrips } from "@/data/featured-trips";
import { SectionHeading } from "@/components/ui/section-heading";
import { IconButton } from "@/components/ui/icon-button";
import { TripCard } from "./trip-card";

export function FeaturedTripsSection() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    const nextIndex = (index + featuredTrips.length) % featuredTrips.length;
    const row = rowRef.current;
    const card = row?.children.item(nextIndex) as HTMLElement | null;
    card?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start"
    });
    setActiveIndex(nextIndex);
  };

  return (
    <section
      className="landing-section featured-section"
      id="featured-trips"
      aria-labelledby="featured-title"
    >
      <div className="container">
        <SectionHeading
          titleId="featured-title"
          title="Featured Trips"
          copy="Handpicked travel stories to inspire your next adventure."
          link={{ label: "View all trips", href: "/explore" }}
        />
        <div className="carousel-shell">
          <div className="trip-grid snap-row" ref={rowRef}>
            {featuredTrips.map((trip, index) => (
              <TripCard key={trip.title} trip={trip} index={index} />
            ))}
          </div>
          <IconButton
            label="Next featured trip"
            className="carousel-next"
            onClick={() => scrollToIndex(activeIndex + 1)}
          >
            <ArrowRight aria-hidden="true" size={22} />
          </IconButton>
        </div>
        <div className="pagination-dots" aria-label="Featured trip pages">
          {featuredTrips.slice(0, 3).map((trip, index) => (
            <button
              type="button"
              className={activeIndex === index ? "active" : undefined}
              aria-label={"Show " + trip.title}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => scrollToIndex(index)}
              key={trip.title}
            />
          ))}
        </div>
        <Link className="mobile-section-link" href="/explore">
          View all
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}
