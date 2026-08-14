import Image from "next/image";
import Link from "next/link";
import { Eye, Heart } from "lucide-react";
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
    <Link className="trip-card" href={`/trips/${trip.slug}`}>
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
          <span className="trip-card-metrics">
            <Eye aria-hidden="true" size={15} />
            {trip.views ?? "1.2K"}
            <Heart aria-hidden="true" size={15} />
            {trip.likes ?? "240"}
          </span>
        </div>
      </div>
    </Link>
  );
}
