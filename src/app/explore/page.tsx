import type { Metadata } from "next";
import { ExploreClient } from "./explore-client";

export const metadata: Metadata = {
  title: "Explore Real Trips | AfterTrip",
  description:
    "Explore real completed trips, travel routes, budgets, styles, and destination ideas from the AfterTrip community.",
  alternates: { canonical: "/explore" }
};

type ExplorePageProps = {
  searchParams: Promise<{
    destination?: string | string[];
  }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const destination = Array.isArray(params.destination)
    ? params.destination[0]
    : params.destination;

  return <ExploreClient initialQuery={destination ?? ""} />;
}
