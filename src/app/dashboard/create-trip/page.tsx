import { CreateTripPage } from "@/components/dashboard/create-trip-page";

export const metadata = {
  title: "Create Trip | AfterTrip",
  description: "Create and publish a useful AfterTrip journey in minutes."
};

type DashboardCreateTripRouteProps = {
  searchParams?: Promise<{
    trip?: string;
  }>;
};

export default async function DashboardCreateTripRoute({
  searchParams
}: DashboardCreateTripRouteProps) {
  const params = await searchParams;
  return <CreateTripPage tripId={params?.trip} />;
}
