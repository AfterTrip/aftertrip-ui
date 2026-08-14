import { BookmarksPage } from "@/components/dashboard/bookmarks-page";

export const metadata = {
  title: "Bookmarks | AfterTrip",
  description: "Saved trips from the AfterTrip community."
};

export default function DashboardBookmarksRoute() {
  return <BookmarksPage />;
}
