import Image from "next/image";
import type { Destination } from "@/types/destination";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="destination-card">
      <Image
        src={destination.image.src}
        alt={destination.image.alt}
        fill
        sizes="(max-width: 767px) 28vw, (max-width: 1279px) 16vw, 180px"
        className="card-image"
      />
      <div>
        <h3>{destination.name}</h3>
        <p>{destination.trips}</p>
      </div>
    </article>
  );
}
