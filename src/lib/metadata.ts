import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "./constants";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — Real Journeys, Beautifully Shared`,
  description:
    "Discover real trips, honest budgets, practical advice, hidden places, and completed itineraries shared by travelers around the world.",
  alternates: {
    canonical: SITE_URL
  },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Discover real trips, honest budgets, practical advice, hidden places, and completed itineraries shared by travelers around the world.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/hero/mountain-lake-traveler.png",
        width: 2048,
        height: 1024,
        alt: "Traveler looking across a calm mountain lake"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Discover real trips, honest budgets, practical advice, hidden places, and completed itineraries shared by travelers around the world.",
    images: ["/images/hero/mountain-lake-traveler.png"]
  },
  icons: {
    icon: "/brand/aftertrip-icon.png",
    apple: "/brand/aftertrip-icon.png"
  },
  manifest: "/manifest.webmanifest"
};
