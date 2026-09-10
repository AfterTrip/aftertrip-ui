import type { TripStyle } from "@/types/explore-trip";

export type ExploreCategory = {
  label: string;
  subtitle: string;
  style?: TripStyle;
  image: string;
};

export const exploreCategories: ExploreCategory[] = [
  { label: "All Trips", subtitle: "Every shared journey", image: "/images/hero/mountain-lake-traveler.png" },
  { label: "Road trip", subtitle: "Routes & scenic stops", style: "Road trip", image: "/images/destinations/italy.png" },
  { label: "Nature", subtitle: "Forests, valleys & views", style: "Nature", image: "/images/trips/switzerland.png" },
  { label: "Beach", subtitle: "Coasts & island days", style: "Beach", image: "/images/trips/bali.png" },
  { label: "Culture", subtitle: "Food, temples & cities", style: "Culture", image: "/images/destinations/japan.png" },
  { label: "Adventure", subtitle: "Active, wild & memorable", style: "Adventure", image: "/images/trips/iceland.png" }
];
