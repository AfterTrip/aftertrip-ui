import { EditProfilePage } from "@/components/dashboard/edit-profile-page";

export const metadata = {
  title: "Edit Profile | AfterTrip",
  description: "Update your AfterTrip profile name."
};

export default function DashboardEditProfileRoute() {
  return <EditProfilePage />;
}
