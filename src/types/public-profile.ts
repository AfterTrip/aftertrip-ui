import type { ExploreTrip } from "@/types/explore-trip";

export type PublicProfile = {
  slug: string;
  name: string;
  initials: string;
  avatarTone: ExploreTrip["avatarTone"];
  location: string;
  tagline: string;
  coverImage: string;
  photoImage: string;
  travelDays: number;
  achievements: number;
  achievementBadges: Array<{
    code: string;
    title: string;
    description: string;
  }>;
  styles: Array<{ label: string; value: number }>;
  travelWith: Array<{ label: string; value: number }>;
  footprint: Array<{
    label: string;
    count: number;
    coverUrl: string;
    x: number;
    y: number;
    coordinates: { lat: number; lng: number };
  }>;
  trips: ExploreTrip[];
  tripCount: number;
  views: string;
  likes: string;
};
