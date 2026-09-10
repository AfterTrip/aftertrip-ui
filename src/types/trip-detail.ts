import type { TripGroup, TripStyle } from "@/types/explore-trip";

export type TripDetail = {
  slug: string;
  title: string;
  destination: string;
  kicker: string;
  summary: string;
  heroImage: { src: string; alt: string };
  author: string;
  initials: string;
  authorAvatarUrl?: string | null;
  avatarTone: "coral" | "teal" | "sand";
  duration: string;
  travelDates: string;
  group: TripGroup;
  styles: TripStyle[];
  badges: string[];
  about?: string;
  highlights?: string[];
  itinerary?: Array<{ day: string; title: string; copy: string }>;
  gallery?: Array<{
    src: string;
    alt: string;
    type: "image" | "video";
    poster?: string;
  }>;
  quickFacts?: Array<{ label: string; value: string }>;
  spend?: {
    label?: string;
    amount: string;
    unit: string;
    level?: string;
    note?: string;
    categories?: Array<{ label: string; amount: string }>;
  };
  goodToKnow?: string[];
};
