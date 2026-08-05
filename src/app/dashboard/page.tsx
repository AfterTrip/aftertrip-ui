import { MyTripsPage } from "@/components/dashboard/my-trips-page";

export const metadata = {
  title: "My Trips | AfterTrip",
  description: "Manage your AfterTrip journeys, drafts and saved trips."
};

export default function DashboardPage() {
  return <MyTripsPage />;
}
