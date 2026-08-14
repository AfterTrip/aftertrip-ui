import type { Trip } from "@/types/trip";

export const featuredTrips: Trip[] = [
  {
    slug: "exploring-the-magic-of-switzerland",
    title: "Exploring the Magic of Switzerland",
    country: "Switzerland",
    duration: "7 days",
    author: "Sarah Johnson",
    rating: "4.9",
    views: "2.3K",
    likes: "428",
    image: {
      src: "/images/trips/switzerland.png",
      alt: "Swiss alpine valley with green meadows and snow covered peaks"
    }
  },
  {
    slug: "bali-culture-beaches-and-beyond",
    title: "Bali: Culture, Beaches & Beyond",
    country: "Indonesia",
    duration: "5 days",
    author: "Alex Chen",
    rating: "4.8",
    views: "1.8K",
    likes: "312",
    image: {
      src: "/images/trips/bali.png",
      alt: "Turquoise Bali coastline with palms and white sand"
    }
  },
  {
    slug: "chasing-northern-lights-in-iceland",
    title: "Chasing Northern Lights in Iceland",
    country: "Iceland",
    duration: "10 days",
    author: "Emma Wilson",
    rating: "4.9",
    views: "1.2K",
    likes: "286",
    image: {
      src: "/images/trips/iceland.png",
      alt: "Northern lights over a snowy Icelandic mountain cabin"
    }
  },
  {
    slug: "thailand-offbeat-island-hopping",
    title: "Thailand Offbeat Island Hopping",
    country: "Thailand",
    duration: "6 days",
    author: "Rahul Verma",
    rating: "4.7",
    views: "1.1K",
    likes: "241",
    image: {
      src: "/images/trips/thailand.png",
      alt: "Longtail boat floating between Thai limestone islands"
    }
  }
];
