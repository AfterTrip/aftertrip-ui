import {
  exploreTrips,
  type TripGroup,
  type TripStyle
} from "@/data/explore-trips";

export type TripDetail = {
  slug: string;
  title: string;
  destination: string;
  kicker: string;
  summary: string;
  heroImage: { src: string; alt: string };
  author: string;
  initials: string;
  avatarTone: "coral" | "teal" | "sand";
  duration: string;
  group: TripGroup;
  styles: TripStyle[];
  badges: string[];
  about?: string;
  highlights?: string[];
  itinerary?: Array<{ day: string; title: string; copy: string }>;
  gallery?: Array<{
    src: string;
    alt: string;
    type?: "image" | "video";
    poster?: string;
  }>;
  quickFacts?: Array<{ label: string; value: string }>;
  spend?: {
    label?: string;
    amount: string;
    unit: string;
    level?: string;
    note?: string;
  };
  goodToKnow?: string[];
};

const defaultGallery = [
  {
    src: "/images/cta/share-adventure.png",
    alt: "Green mountain valley trail"
  },
  { src: "/images/trips/thailand.png", alt: "Boat on clear blue water" },
  {
    src: "/images/destinations/switzerland.png",
    alt: "Layered green mountain valley"
  },
  { src: "/images/destinations/thailand.png", alt: "Lush island cliffs" },
  { src: "/images/destinations/bali.png", alt: "Village and temple landscape" }
];

export const tripDetails: TripDetail[] = [
  {
    slug: "meghalaya-clouds-caves-and-living-roots",
    title: "Meghalaya: Clouds, Caves & Living Roots",
    destination: "Meghalaya, India",
    kicker: "Meghalaya",
    summary:
      "A 7-day friends adventure through misty hills, secret caves, crystal-clear rivers and Asia's cleanest village.",
    heroImage: {
      src: "/images/cta/share-adventure.png",
      alt: "Misty green mountain trail with a traveler"
    },
    author: "Anisha Verma",
    initials: "AV",
    avatarTone: "teal",
    duration: "7 Days",
    group: "Friends",
    styles: ["Nature", "Adventure", "Culture"],
    badges: [
      "7 Days",
      "Friends",
      "Nature, Adventure, Culture",
      "INR 24,800 / person"
    ],
    about:
      "Explore the best of Meghalaya with your crew: cave explorations in Mawsmai, sunrise at Shillong Peak, crystal water of Dawki, the living root bridges of Nongriat and the serene charm of Mawlynnong. Perfect mix of adventure, culture and slow travel.",
    highlights: [
      "Living root bridges",
      "Crystal water at Dawki",
      "Mawsmai cave walk",
      "Mawlynnong village"
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Guwahati -> Shillong",
        copy: "Arrive in Guwahati. Scenic drive to Shillong via Umiam Lake."
      },
      {
        day: "Day 2",
        title: "Shillong Local",
        copy: "Explore Shillong's viewpoints, colonial charm and local cafes."
      },
      {
        day: "Day 3",
        title: "Shillong -> Cherrapunji",
        copy: "Drive to Cherrapunji. Visit caves, waterfalls and viewpoints."
      },
      {
        day: "Day 4",
        title: "Cherrapunji -> Dawki",
        copy: "Head to Dawki. Enjoy boating in the Umngot River."
      },
      {
        day: "Day 5",
        title: "Dawki -> Mawlynnong -> Shillong",
        copy: "Visit Mawlynnong, Asia's cleanest village. Return to Shillong."
      },
      {
        day: "Day 6",
        title: "Shillong -> Nongriat (Double Decker Root Bridge)",
        copy: "Trek to Nongriat and back. Iconic living root bridges."
      },
      {
        day: "Day 7",
        title: "Shillong -> Guwahati",
        copy: "Leisure morning. Drive back to Guwahati and depart."
      }
    ],
    gallery: defaultGallery,
    quickFacts: [
      { label: "Destination", value: "Meghalaya, India" },
      { label: "Duration", value: "7 Days" },
      { label: "Group", value: "Friends" },
      { label: "Trip style", value: "Nature, Adventure, Culture" },
      { label: "Budget", value: "INR 24,800 / person" }
    ],
    spend: {
      label: "Shared by traveler",
      amount: "INR 24,800",
      unit: "/ person",
      level: "Mid-range",
      note: "Budget is shared by the traveler and may vary by travel dates."
    },
    goodToKnow: [
      "Carry cash, rain gear and comfy shoes. Network is limited.",
      "ATMs are scarce beyond Shillong.",
      "Respect local culture and keep nature clean."
    ]
  }
];

function fallbackItinerary(duration: string, country: string) {
  const days = Math.max(3, Number(duration.replace(/[^0-9]/g, "")) || 5);
  return Array.from({ length: Math.min(days, 7) }, (_, index) => ({
    day: "Day " + (index + 1),
    title:
      index === 0
        ? "Arrive in " + country
        : index === days - 1
          ? "Slow morning -> Depart"
          : "Local stories and scenic stops",
    copy:
      index === 0
        ? "Settle in, meet your host and take an easy orientation walk."
        : index === days - 1
          ? "Leave room for a final cafe, market stop or viewpoint before departure."
          : "Follow the shared route, keep the pace flexible and save time for unexpected local finds."
  }));
}

export function getTripDetail(slug: string): TripDetail | undefined {
  const explicit = tripDetails.find((trip) => trip.slug === slug);
  if (explicit) return explicit;

  const trip = exploreTrips.find((item) => item.slug === slug);
  if (!trip) return undefined;

  return {
    slug: trip.slug,
    title: trip.title,
    destination: trip.place,
    kicker: trip.country,
    summary:
      "A real traveler itinerary with practical stops, pacing notes and inspiration you can adapt for your own route.",
    heroImage: trip.image,
    author: trip.author,
    initials: trip.initials,
    avatarTone: trip.avatarTone,
    duration: trip.duration,
    group: trip.group,
    styles: trip.styles,
    badges: [
      trip.duration,
      trip.group,
      trip.styles.join(", "),
      trip.price + " / person"
    ],
    about:
      "This traveler-shared route balances memorable sights with enough breathing room for slow mornings, local food and spontaneous detours.",
    highlights: trip.styles.slice(0, 3),
    itinerary: fallbackItinerary(trip.duration, trip.country),
    gallery: [
      trip.image,
      ...defaultGallery.filter((image) => image.src !== trip.image.src)
    ].slice(0, 5),
    quickFacts: [
      { label: "Destination", value: trip.place },
      { label: "Duration", value: trip.duration },
      { label: "Group", value: trip.group },
      { label: "Trip style", value: trip.styles.join(", ") },
      { label: "Budget", value: trip.price + " / person" }
    ],
    spend: {
      label: "Shared by traveler",
      amount: trip.price,
      unit: "/ person",
      level: trip.budgetLabel,
      note: "Budget is shared by the traveler and may vary by travel dates."
    }
  };
}

export function getAllTripSlugs() {
  return exploreTrips.map((trip) => trip.slug);
}
