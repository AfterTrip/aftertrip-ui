import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="loading-shell" aria-label="AfterTrip page loading">
      <Skeleton className="loading-hero" />
      <Skeleton className="loading-strip" />
    </main>
  );
}
