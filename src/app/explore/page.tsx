import { ExploreClient } from "./explore-client";

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
