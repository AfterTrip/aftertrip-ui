import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredTrips } from "@/data/featured-trips";
import { SectionHeading } from "@/components/ui/section-heading";
import { IconButton } from "@/components/ui/icon-button";
import { TripCard } from "./trip-card";

export function FeaturedTripsSection() {
  return (
    <section className="landing-section featured-section" id="featured-trips" aria-labelledby="featured-title">
      <div className="container">
        <SectionHeading
          titleId="featured-title"
          title="Featured Trips"
          copy="Handpicked travel stories to inspire your next adventure."
          link={{ label: "View all trips", href: "#" }}
        />
        <div className="carousel-shell">
          <div className="trip-grid snap-row">
            {featuredTrips.map((trip, index) => (
              <TripCard key={trip.title} trip={trip} index={index} />
            ))}
          </div>
          <IconButton label="Next featured trip" className="carousel-next">
            <ArrowRight aria-hidden="true" size={22} />
          </IconButton>
        </div>
        <div className="pagination-dots" aria-hidden="true">
          <span className="active" />
          <span />
          <span />
        </div>
        <Link className="mobile-section-link" href="#">
          View all
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}
