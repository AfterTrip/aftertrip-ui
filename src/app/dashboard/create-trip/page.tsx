import { CreateTripPage } from "@/components/dashboard/create-trip-page";

export const metadata = {
  title: "Create Trip | AfterTrip",
  description: "Create and publish a useful AfterTrip journey in minutes."
};

export default function DashboardCreateTripRoute() {
  return <CreateTripPage />;
}
