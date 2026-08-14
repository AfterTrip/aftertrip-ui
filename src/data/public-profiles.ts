import { exploreTrips, type ExploreTrip } from "@/data/explore-trips";

type ProfileSeed = {
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
  styles: Array<{ label: string; value: number }>;
  travelWith: Array<{ label: string; value: number }>;
  footprint: Array<{
    label: string;
    count: number;
    x: number;
    y: number;
    coordinates: {
      lat: number;
      lng: number;
    };
  }>;
};

const profileSeeds: ProfileSeed[] = [
  {
    slug: "anisha-verma",
    name: "Anisha Verma",
    initials: "AV",
    avatarTone: "teal",
    location: "Shillong, Meghalaya, India",
    tagline:
      "Chasing mist, slow roads and honest local stories across Northeast India.",
    coverImage: "/images/cta/share-adventure.png",
    photoImage: "/images/hero/mountain-lake-traveler.png",
    travelDays: 46,
    achievements: 12,
    styles: [
      { label: "Nature", value: 84 },
      { label: "Adventure", value: 68 },
      { label: "Culture", value: 54 }
    ],
    travelWith: [
      { label: "Friends", value: 58 },
      { label: "Solo", value: 22 },
      { label: "Group", value: 14 },
      { label: "Couple", value: 6 }
    ],
    footprint: [
      {
        label: "Meghalaya",
        count: 4,
        x: 64,
        y: 34,
        coordinates: { lat: 25.467, lng: 91.3662 }
      },
      {
        label: "Assam",
        count: 2,
        x: 57,
        y: 42,
        coordinates: { lat: 26.2006, lng: 92.9376 }
      },
      {
        label: "Sikkim",
        count: 1,
        x: 51,
        y: 28,
        coordinates: { lat: 27.533, lng: 88.5122 }
      }
    ]
  },
  {
    slug: "sarah-johnson",
    name: "Sarah Johnson",
    initials: "SJ",
    avatarTone: "coral",
    location: "Zurich, Switzerland",
    tagline: "Alpine villages, train routes and calm mountain days.",
    coverImage: "/images/trips/switzerland.png",
    photoImage: "/images/trips/switzerland.png",
    travelDays: 38,
    achievements: 10,
    styles: [
      { label: "Mountains", value: 88 },
      { label: "Nature", value: 72 },
      { label: "Relaxed", value: 48 }
    ],
    travelWith: [
      { label: "Couple", value: 45 },
      { label: "Family", value: 28 },
      { label: "Solo", value: 17 },
      { label: "Friends", value: 10 }
    ],
    footprint: [
      {
        label: "Switzerland",
        count: 5,
        x: 47,
        y: 40,
        coordinates: { lat: 46.8182, lng: 8.2275 }
      },
      {
        label: "Italy",
        count: 1,
        x: 52,
        y: 58,
        coordinates: { lat: 41.8719, lng: 12.5674 }
      },
      {
        label: "Austria",
        count: 1,
        x: 62,
        y: 46,
        coordinates: { lat: 47.5162, lng: 14.5501 }
      }
    ]
  },
  {
    slug: "alex-chen",
    name: "Alex Chen",
    initials: "AC",
    avatarTone: "sand",
    location: "Singapore",
    tagline: "Warm beaches, food lanes and practical island itineraries.",
    coverImage: "/images/trips/bali.png",
    photoImage: "/images/trips/bali.png",
    travelDays: 29,
    achievements: 8,
    styles: [
      { label: "Beach", value: 78 },
      { label: "Food", value: 64 },
      { label: "Culture", value: 51 }
    ],
    travelWith: [
      { label: "Friends", value: 44 },
      { label: "Couple", value: 32 },
      { label: "Solo", value: 14 },
      { label: "Family", value: 10 }
    ],
    footprint: [
      {
        label: "Bali",
        count: 3,
        x: 55,
        y: 63,
        coordinates: { lat: -8.3405, lng: 115.092 }
      },
      {
        label: "Singapore",
        count: 2,
        x: 46,
        y: 50,
        coordinates: { lat: 1.3521, lng: 103.8198 }
      },
      {
        label: "Thailand",
        count: 1,
        x: 38,
        y: 40,
        coordinates: { lat: 15.87, lng: 100.9925 }
      }
    ]
  },
  {
    slug: "emma-wilson",
    name: "Emma Wilson",
    initials: "EW",
    avatarTone: "teal",
    location: "Reykjavik, Iceland",
    tagline:
      "Winter roads, northern lights and routes that respect wild weather.",
    coverImage: "/images/trips/iceland.png",
    photoImage: "/images/trips/iceland.png",
    travelDays: 34,
    achievements: 11,
    styles: [
      { label: "Winter Escape", value: 82 },
      { label: "Adventure", value: 69 },
      { label: "Nature", value: 58 }
    ],
    travelWith: [
      { label: "Solo", value: 52 },
      { label: "Friends", value: 28 },
      { label: "Group", value: 12 },
      { label: "Couple", value: 8 }
    ],
    footprint: [
      {
        label: "Iceland",
        count: 5,
        x: 48,
        y: 28,
        coordinates: { lat: 64.9631, lng: -19.0208 }
      },
      {
        label: "Norway",
        count: 1,
        x: 60,
        y: 35,
        coordinates: { lat: 60.472, lng: 8.4689 }
      },
      {
        label: "Scotland",
        count: 1,
        x: 42,
        y: 45,
        coordinates: { lat: 56.4907, lng: -4.2026 }
      }
    ]
  },
  {
    slug: "rahul-verma",
    name: "Rahul Verma",
    initials: "RV",
    avatarTone: "coral",
    location: "Bangkok, Thailand",
    tagline: "Budget-friendly islands, boats and easygoing group escapes.",
    coverImage: "/images/trips/thailand.png",
    photoImage: "/images/trips/thailand.png",
    travelDays: 22,
    achievements: 7,
    styles: [
      { label: "Beach", value: 76 },
      { label: "Budget", value: 62 },
      { label: "Adventure", value: 49 }
    ],
    travelWith: [
      { label: "Friends", value: 63 },
      { label: "Group", value: 21 },
      { label: "Solo", value: 11 },
      { label: "Couple", value: 5 }
    ],
    footprint: [
      {
        label: "Thailand",
        count: 4,
        x: 46,
        y: 48,
        coordinates: { lat: 15.87, lng: 100.9925 }
      },
      {
        label: "Vietnam",
        count: 1,
        x: 56,
        y: 45,
        coordinates: { lat: 14.0583, lng: 108.2772 }
      },
      {
        label: "Malaysia",
        count: 1,
        x: 43,
        y: 62,
        coordinates: { lat: 4.2105, lng: 101.9758 }
      }
    ]
  },
  {
    slug: "moya-tanaka",
    name: "Moya Tanaka",
    initials: "MT",
    avatarTone: "sand",
    location: "Kyoto, Japan",
    tagline:
      "Temples, food streets and quiet traditions beyond the obvious route.",
    coverImage: "/images/destinations/japan.png",
    photoImage: "/images/destinations/japan.png",
    travelDays: 31,
    achievements: 9,
    styles: [
      { label: "Culture", value: 81 },
      { label: "Food", value: 66 },
      { label: "Spiritual", value: 44 }
    ],
    travelWith: [
      { label: "Couple", value: 40 },
      { label: "Solo", value: 30 },
      { label: "Friends", value: 20 },
      { label: "Family", value: 10 }
    ],
    footprint: [
      {
        label: "Japan",
        count: 4,
        x: 64,
        y: 42,
        coordinates: { lat: 36.2048, lng: 138.2529 }
      },
      {
        label: "South Korea",
        count: 1,
        x: 54,
        y: 38,
        coordinates: { lat: 35.9078, lng: 127.7669 }
      },
      {
        label: "Taiwan",
        count: 1,
        x: 49,
        y: 55,
        coordinates: { lat: 23.6978, lng: 120.9605 }
      }
    ]
  },
  {
    slug: "luca-rossi",
    name: "Luca Rossi",
    initials: "LR",
    avatarTone: "coral",
    location: "Naples, Italy",
    tagline: "Coastal cities, generous meals and walkable culture-first plans.",
    coverImage: "/images/destinations/italy.png",
    photoImage: "/images/destinations/italy.png",
    travelDays: 27,
    achievements: 8,
    styles: [
      { label: "Food", value: 79 },
      { label: "City", value: 61 },
      { label: "Culture", value: 56 }
    ],
    travelWith: [
      { label: "Couple", value: 38 },
      { label: "Friends", value: 28 },
      { label: "Solo", value: 22 },
      { label: "Family", value: 12 }
    ],
    footprint: [
      {
        label: "Italy",
        count: 4,
        x: 49,
        y: 54,
        coordinates: { lat: 41.8719, lng: 12.5674 }
      },
      {
        label: "France",
        count: 1,
        x: 39,
        y: 44,
        coordinates: { lat: 46.2276, lng: 2.2137 }
      },
      {
        label: "Greece",
        count: 1,
        x: 62,
        y: 63,
        coordinates: { lat: 39.0742, lng: 21.8243 }
      }
    ]
  },
  {
    slug: "jack-thompson",
    name: "Jack Thompson",
    initials: "JT",
    avatarTone: "sand",
    location: "Queenstown, New Zealand",
    tagline: "Long roads, raw landscapes and practical solo-travel notes.",
    coverImage: "/images/hero/mountain-lake-traveler.png",
    photoImage: "/images/hero/mountain-lake-traveler.png",
    travelDays: 24,
    achievements: 6,
    styles: [
      { label: "Road trip", value: 86 },
      { label: "Adventure", value: 64 },
      { label: "Nature", value: 53 }
    ],
    travelWith: [
      { label: "Solo", value: 68 },
      { label: "Friends", value: 18 },
      { label: "Group", value: 9 },
      { label: "Couple", value: 5 }
    ],
    footprint: [
      {
        label: "New Zealand",
        count: 3,
        x: 58,
        y: 70,
        coordinates: { lat: -40.9006, lng: 174.886 }
      },
      {
        label: "Australia",
        count: 1,
        x: 43,
        y: 56,
        coordinates: { lat: -25.2744, lng: 133.7751 }
      },
      {
        label: "Fiji",
        count: 1,
        x: 68,
        y: 47,
        coordinates: { lat: -17.7134, lng: 178.065 }
      }
    ]
  }
];

export type PublicProfile = ProfileSeed & {
  trips: ExploreTrip[];
  tripCount: number;
  views: string;
  likes: string;
};

function parseMetric(value: string) {
  const normalized = value.trim().toLowerCase();
  const number = Number(normalized.replace(/[^0-9.]/g, ""));
  if (normalized.endsWith("k")) return number * 1000;
  return number;
}

function formatMetric(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return String(Math.round(value));
}

export const publicProfiles: PublicProfile[] = profileSeeds.map((profile) => {
  const trips = exploreTrips.filter((trip) => trip.authorSlug === profile.slug);
  return {
    ...profile,
    trips,
    tripCount: trips.length,
    views: formatMetric(
      trips.reduce((total, trip) => total + parseMetric(trip.views), 0)
    ),
    likes: formatMetric(
      trips.reduce((total, trip) => total + parseMetric(trip.likes), 0)
    )
  };
});

export function getPublicProfile(slug: string) {
  return publicProfiles.find((profile) => profile.slug === slug);
}
