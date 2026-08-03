import Image from "next/image";
import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { Trip } from "@/types/trip";

type TripCardProps = {
  trip: Trip;
  index: number;
};

const avatarTones = ["coral", "sand", "teal", "coral"] as const;
const authorInitials = ["SJ", "AC", "EW", "RV"] as const;

export function TripCard({ trip, index }: TripCardProps) {
  return (
    <article className="trip-card">
      <Image
        src={trip.image.src}
        alt={trip.image.alt}
        fill
        sizes="(max-width: 767px) 82vw, (max-width: 1279px) 25vw, 280px"
        className="card-image"
      />
      <span className="duration-badge">{trip.duration}</span>
      <div className="trip-card-content">
        <h3>{trip.title}</h3>
        <p>{trip.country}</p>
        <div className="trip-meta">
          <span>
            <Avatar
              initials={authorInitials[index] ?? "AT"}
              tone={avatarTones[index] ?? "teal"}
              label={`${trip.author} avatar`}
            />
            By {trip.author}
          </span>
          <span className="rating">
            <Star aria-hidden="true" size={16} fill="currentColor" />
            {trip.rating}
          </span>
        </div>
      </div>
    </article>
  );
}
