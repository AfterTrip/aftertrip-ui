export type TripGroup =
  | "Solo"
  | "Friends"
  | "Couple"
  | "Family"
  | "Group"
  | "Other";

export type TripStyle =
  | "Road trip"
  | "Trekking"
  | "Beach"
  | "City"
  | "Nature"
  | "Adventure"
  | "Relaxed"
  | "Budget"
  | "Luxury"
  | "Food"
  | "Culture"
  | "Mountains"
  | "Wildlife"
  | "Camping"
  | "Spiritual"
  | "Nightlife"
  | "Winter Escape";

export type ExploreTrip = {
  slug: string;
  title: string;
  country: string;
  place: string;
  duration: string;
  group: TripGroup;
  styles: TripStyle[];
  author: string;
  authorSlug: string;
  authorAvatarUrl?: string | null;
  price: string;
  views: string;
  likes: string;
  budgetAmount: number;
  budgetLabel: string;
  image: { src: string; alt: string };
  avatarTone: "coral" | "teal" | "sand";
  initials: string;
};
