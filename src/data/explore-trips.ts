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
  price: string;
  views: string;
  likes: string;
  budgetAmount: number;
  budgetLabel: string;
  image: {
    src: string;
    alt: string;
  };
  avatarTone: "coral" | "teal" | "sand";
  initials: string;
};

export type ExploreCategory = {
  label: string;
  subtitle: string;
  style?: TripStyle;
  image: string;
};

export const exploreCategories: ExploreCategory[] = [
  {
    label: "All Trips",
    subtitle: "Every shared journey",
    image: "/images/hero/mountain-lake-traveler.png"
  },
  {
    label: "Road trip",
    subtitle: "Routes & scenic stops",
    style: "Road trip",
    image: "/images/destinations/italy.png"
  },
  {
    label: "Nature",
    subtitle: "Forests, valleys & views",
    style: "Nature",
    image: "/images/trips/switzerland.png"
  },
  {
    label: "Beach",
    subtitle: "Coasts & island days",
    style: "Beach",
    image: "/images/trips/bali.png"
  },
  {
    label: "Culture",
    subtitle: "Food, temples & cities",
    style: "Culture",
    image: "/images/destinations/japan.png"
  },
  {
    label: "Adventure",
    subtitle: "Active, wild & memorable",
    style: "Adventure",
    image: "/images/trips/iceland.png"
  }
];

export const exploreTrips: ExploreTrip[] = [
  {
    slug: "meghalaya-clouds-caves-and-living-roots",
    title: "Meghalaya: Clouds, Caves & Living Roots",
    country: "India",
    place: "Meghalaya, India",
    duration: "7 days",
    group: "Friends",
    styles: ["Nature", "Adventure", "Culture"],
    author: "Anisha Verma",
    authorSlug: "anisha-verma",
    price: "INR 24,800",
    views: "2.6K",
    likes: "521",
    budgetAmount: 300,
    budgetLabel: "Moderate",
    image: {
      src: "/images/cta/share-adventure.png",
      alt: "Misty green mountain trail with a traveler"
    },
    avatarTone: "teal",
    initials: "AV"
  },
  {
    slug: "exploring-the-magic-of-switzerland",
    title: "Exploring the Magic of Switzerland",
    country: "Switzerland",
    place: "Switzerland",
    duration: "7 days",
    group: "Couple",
    styles: ["Nature", "Mountains", "Relaxed"],
    author: "Sarah Johnson",
    authorSlug: "sarah-johnson",
    price: "$620",
    views: "2.3K",
    likes: "428",
    budgetAmount: 620,
    budgetLabel: "Moderate",
    image: {
      src: "/images/trips/switzerland.png",
      alt: "Swiss alpine valley with mountains and green villages"
    },
    avatarTone: "coral",
    initials: "SJ"
  },
  {
    slug: "bali-culture-beaches-and-beyond",
    title: "Bali: Culture, Beaches & Beyond",
    country: "Indonesia",
    place: "Bali, Indonesia",
    duration: "5 days",
    group: "Friends",
    styles: ["Beach", "Culture", "Food"],
    author: "Alex Chen",
    authorSlug: "alex-chen",
    price: "$540",
    views: "1.8K",
    likes: "312",
    budgetAmount: 540,
    budgetLabel: "Budget",
    image: {
      src: "/images/trips/bali.png",
      alt: "Turquoise Bali beach with palms and white sand"
    },
    avatarTone: "sand",
    initials: "AC"
  },
  {
    slug: "chasing-northern-lights-in-iceland",
    title: "Chasing Northern Lights in Iceland",
    country: "Iceland",
    place: "Iceland",
    duration: "10 days",
    group: "Solo",
    styles: ["Adventure", "Nature", "Winter Escape"],
    author: "Emma Wilson",
    authorSlug: "emma-wilson",
    price: "$1,120",
    views: "1.2K",
    likes: "286",
    budgetAmount: 1120,
    budgetLabel: "Moderate",
    image: {
      src: "/images/trips/iceland.png",
      alt: "Northern lights over snowy Icelandic mountains"
    },
    avatarTone: "teal",
    initials: "EW"
  },
  {
    slug: "thailand-offbeat-island-hopping",
    title: "Thailand Offbeat Island Hopping",
    country: "Thailand",
    place: "Thailand",
    duration: "6 days",
    group: "Friends",
    styles: ["Beach", "Adventure", "Budget"],
    author: "Rahul Verma",
    authorSlug: "rahul-verma",
    price: "$680",
    views: "1.1K",
    likes: "241",
    budgetAmount: 680,
    budgetLabel: "Budget",
    image: {
      src: "/images/trips/thailand.png",
      alt: "Longtail boat near Thailand limestone islands"
    },
    avatarTone: "coral",
    initials: "RV"
  },
  {
    slug: "swiss-villages-and-scenic-trains",
    title: "Swiss Villages & Scenic Trains",
    country: "Switzerland",
    place: "Switzerland",
    duration: "8 days",
    group: "Family",
    styles: ["Mountains", "Nature", "Road trip"],
    author: "Sarah Johnson",
    authorSlug: "sarah-johnson",
    price: "$1,380",
    views: "1.6K",
    likes: "364",
    budgetAmount: 1380,
    budgetLabel: "Luxury",
    image: {
      src: "/images/destinations/switzerland.png",
      alt: "Alpine Swiss valley and mountain village"
    },
    avatarTone: "teal",
    initials: "SJ"
  },
  {
    slug: "japan-traditions-and-hidden-paths",
    title: "Japan: Traditions & Hidden Paths",
    country: "Japan",
    place: "Japan",
    duration: "7 days",
    group: "Couple",
    styles: ["Culture", "Food", "Spiritual"],
    author: "Moya Tanaka",
    authorSlug: "moya-tanaka",
    price: "$1,150",
    views: "980",
    likes: "209",
    budgetAmount: 1150,
    budgetLabel: "Moderate",
    image: {
      src: "/images/destinations/japan.png",
      alt: "Japanese pagoda with Mount Fuji at sunset"
    },
    avatarTone: "sand",
    initials: "MT"
  },
  {
    slug: "italy-coastlines-cities-and-culinary-delights",
    title: "Italy: Coastlines, Cities & Culinary Delights",
    country: "Italy",
    place: "Italy",
    duration: "9 days",
    group: "Couple",
    styles: ["City", "Food", "Culture"],
    author: "Luca Rossi",
    authorSlug: "luca-rossi",
    price: "$980",
    views: "1.4K",
    likes: "334",
    budgetAmount: 980,
    budgetLabel: "Moderate",
    image: {
      src: "/images/destinations/italy.png",
      alt: "Italian coastline city in warm evening light"
    },
    avatarTone: "coral",
    initials: "LR"
  },
  {
    slug: "iceland-waterfalls-glaciers-and-northern-lights",
    title: "Iceland: Waterfalls, Glaciers & Northern Lights",
    country: "Iceland",
    place: "Iceland",
    duration: "6 days",
    group: "Group",
    styles: ["Adventure", "Nature", "Winter Escape"],
    author: "Emma Wilson",
    authorSlug: "emma-wilson",
    price: "$1,120",
    views: "1.7K",
    likes: "391",
    budgetAmount: 1120,
    budgetLabel: "Moderate",
    image: {
      src: "/images/destinations/iceland.png",
      alt: "Icelandic winter landscape beneath green aurora"
    },
    avatarTone: "teal",
    initials: "EW"
  },
  {
    slug: "new-zealand-epic-roads-and-raw-beauty",
    title: "New Zealand: Epic Roads & Raw Beauty",
    country: "New Zealand",
    place: "New Zealand",
    duration: "10 days",
    group: "Solo",
    styles: ["Road trip", "Adventure", "Nature"],
    author: "Jack Thompson",
    authorSlug: "jack-thompson",
    price: "$1,460",
    views: "870",
    likes: "188",
    budgetAmount: 1460,
    budgetLabel: "Luxury",
    image: {
      src: "/images/hero/mountain-lake-traveler.png",
      alt: "Mountain lake road trip landscape with a traveler"
    },
    avatarTone: "sand",
    initials: "JT"
  }
];
