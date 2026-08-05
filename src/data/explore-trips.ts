export type ExploreTrip = {
  slug: string;
  title: string;
  country: string;
  place: string;
  duration: string;
  author: string;
  rating: string;
  price: string;
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
  image: string;
};

export const exploreCategories: ExploreCategory[] = [
  {
    label: "All Trips",
    subtitle: "All Adventures",
    image: "/images/hero/mountain-lake-traveler.png"
  },
  {
    label: "Mountains",
    subtitle: "High Altitude Escapes",
    image: "/images/trips/switzerland.png"
  },
  {
    label: "Beaches",
    subtitle: "Sun, Sand & Sea",
    image: "/images/trips/bali.png"
  },
  {
    label: "Road Trips",
    subtitle: "Scenic Drives",
    image: "/images/destinations/italy.png"
  },
  {
    label: "Winter",
    subtitle: "Snow & Ice",
    image: "/images/trips/iceland.png"
  },
  {
    label: "Backpacking",
    subtitle: "Light, Wild & Free",
    image: "/images/trips/thailand.png"
  }
];

export const exploreTrips: ExploreTrip[] = [
  {
    slug: "meghalaya-clouds-caves-and-living-roots",
    title: "Meghalaya: Clouds, Caves & Living Roots",
    country: "India",
    place: "Meghalaya, India",
    duration: "7 days",
    author: "Anisha Verma",
    rating: "4.8",
    price: "₹24,800",
    budgetLabel: "Mid-range",
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
    author: "Sarah Johnson",
    rating: "4.9",
    price: "$620",
    budgetLabel: "Mid-range",
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
    author: "Alex Chen",
    rating: "4.8",
    price: "$540",
    budgetLabel: "Budget-friendly",
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
    author: "Emma Wilson",
    rating: "4.9",
    price: "$1,120",
    budgetLabel: "Mid-range",
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
    author: "Rahul Verma",
    rating: "4.7",
    price: "$680",
    budgetLabel: "Budget-friendly",
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
    author: "Sarah Johnson",
    rating: "4.9",
    price: "$1,380",
    budgetLabel: "Mid-range",
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
    author: "Moya Tanaka",
    rating: "4.9",
    price: "$1,150",
    budgetLabel: "Culture-rich",
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
    author: "Luca Rossi",
    rating: "4.8",
    price: "$980",
    budgetLabel: "City break",
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
    author: "Emma Wilson",
    rating: "4.9",
    price: "$1,120",
    budgetLabel: "Adventure",
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
    author: "Jack Thompson",
    rating: "4.9",
    price: "$1,460",
    budgetLabel: "Road trip",
    image: {
      src: "/images/hero/mountain-lake-traveler.png",
      alt: "Mountain lake road trip landscape with a traveler"
    },
    avatarTone: "sand",
    initials: "JT"
  }
];
