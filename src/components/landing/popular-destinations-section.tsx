"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { DestinationCard } from "./destination-card";
import { getDestinations, publicMediaUrl } from "@/lib/aftertrip-api";
import type { Destination } from "@/types/destination";

export function PopularDestinationsSection() {
  const [items, setItems] = useState<Destination[]>([]);

  useEffect(() => {
    let active = true;
    getDestinations(8)
      .then((page) => {
        if (!active) return;
        setItems(
          page.content.flatMap((destination) => {
            const image = publicMediaUrl(destination.coverMediaId);
            return image
              ? [{
                  name: destination.name,
                  trips: `${destination.tripCount} ${destination.tripCount === 1 ? "trip" : "trips"}`,
                  image: { src: image, alt: `${destination.displayName} travel stories` }
                }]
              : [];
          })
        );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="landing-section destinations-section"
      id="destinations"
      aria-labelledby="destinations-title"
    >
      <div className="container">
        <SectionHeading
          titleId="destinations-title"
          title="Popular Destinations"
          copy="Explore the most loved places by our community."
          link={{ label: "View all destinations", href: "/explore" }}
        />
        {items.length ? (
          <div className="destination-grid snap-row">
            {items.map((destination) => (
              <DestinationCard destination={destination} key={destination.name} />
            ))}
          </div>
        ) : (
          <p className="landing-data-empty">Destinations will appear after trips are published.</p>
        )}
      </div>
    </section>
  );
}
