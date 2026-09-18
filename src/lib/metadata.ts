import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHARE_IMAGE,
  SITE_SHARE_IMAGE_HEIGHT,
  SITE_SHARE_IMAGE_WIDTH,
  SITE_TAGLINE,
  SITE_URL
} from "./constants";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: `${SITE_NAME} — Real Journeys, Beautifully Shared`,
  description: SITE_DESCRIPTION,
  keywords: [
    "AfterTrip",
    "after trip",
    "travel stories",
    "real trip itineraries",
    "travel footprints",
    "trip sharing",
    "travel community",
    "travel budget"
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "travel",
  alternates: {
    canonical: SITE_URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: SITE_SHARE_IMAGE,
        width: SITE_SHARE_IMAGE_WIDTH,
        height: SITE_SHARE_IMAGE_HEIGHT,
        alt: "AfterTrip travel sharing preview with coastal journeys and trip cards"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [SITE_SHARE_IMAGE]
  },
  icons: {
    icon: "/brand/aftertrip-icon.png",
    apple: "/brand/aftertrip-icon.png"
  },
  manifest: "/manifest.webmanifest"
};
