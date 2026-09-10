"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { IconButton } from "@/components/ui/icon-button";
import { TripCard } from "./trip-card";
import {
  getProfiles,
  getTripEngagement,
  searchTrips
} from "@/lib/aftertrip-api";
import { discoveryTripToLandingTrip } from "@/lib/api-adapters";
import { useCarouselPagination } from "@/lib/use-carousel-pagination";
import type { Trip } from "@/types/trip";

export function FeaturedTripsSection() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const { activePage, pageCount, scrollToPage } = useCarouselPagination(
    rowRef,
    trips.length
  );

  useEffect(() => {
    let active = true;
    searchTrips({ size: 8 })
      .then(async (page) => {
        if (!page.content.length) {
          if (active) setTrips([]);
          return;
        }
        const [profiles, engagement] = await Promise.all([
          getProfiles([
            ...new Set(page.content.map((trip) => trip.ownerUserId))
          ]),
          getTripEngagement(page.content.map((trip) => trip.tripId))
        ]);
        if (!active) return;
        setTrips(
          page.content.map((trip) =>
            discoveryTripToLandingTrip(
              trip,
              profiles.find((profile) => profile.userId === trip.ownerUserId),
              engagement.find((item) => item.tripId === trip.tripId)
            )
          )
        );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

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
        {trips.length ? (
          <>
            <div className="carousel-shell">
              <div className="trip-grid snap-row" ref={rowRef}>
                {trips.map((trip) => (
                  <TripCard key={trip.slug} trip={trip} />
                ))}
              </div>
              {pageCount > 1 ? (
                <IconButton
                  label="Next featured trips page"
                  className="carousel-next"
                  onClick={() => scrollToPage((activePage + 1) % pageCount)}
                >
                  <ArrowRight aria-hidden="true" size={22} />
                </IconButton>
              ) : null}
            </div>
            {pageCount > 1 ? (
              <div className="pagination-dots" aria-label="Featured trip pages">
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    type="button"
                    className={activePage === index ? "active" : undefined}
                    aria-label={`Show featured trips page ${index + 1}`}
                    aria-current={activePage === index ? "page" : undefined}
                    onClick={() => scrollToPage(index)}
                    key={index}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <p className="landing-data-empty">
            No trips have been published yet.
          </p>
        )}
      </div>
    </section>
  );
}
