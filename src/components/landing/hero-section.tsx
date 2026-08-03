import Image from "next/image";
import { TripSearch } from "./trip-search";
import { PlatformStats } from "./platform-stats";

export function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <Image
        src="/images/hero/mountain-lake-traveler.png"
        alt="Traveler facing a calm lake between steep green mountain cliffs"
        fill
        priority
        sizes="100vw"
        className="hero-image"
      />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-copy">
          <h1 id="hero-title">
            Real journeys.
            <br />
            Beautifully shared.
          </h1>
          <p>
            Discover real travel stories from thousands of travelers and plan your next
            unforgettable adventure.
          </p>
        </div>
        <TripSearch />
        <PlatformStats />
      </div>
    </section>
  );
}
