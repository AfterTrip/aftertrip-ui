import { destinations } from "@/data/destinations";
import { SectionHeading } from "@/components/ui/section-heading";
import { DestinationCard } from "./destination-card";

export function PopularDestinationsSection() {
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
        <div className="destination-grid snap-row">
          {destinations.map((destination) => (
            <DestinationCard destination={destination} key={destination.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
