import { Skeleton } from "@/components/ui/skeleton";

type SkeletonCountProps = {
  count?: number;
};

const repeat = (count: number) =>
  Array.from({ length: count }, (_, index) => index);

export function ExploreTripGridSkeleton({ count = 6 }: SkeletonCountProps) {
  return (
    <>
      {repeat(count).map((index) => (
        <article className="trip-card-skeleton" aria-hidden="true" key={index}>
          <Skeleton className="trip-card-skeleton-image" />
          <div className="trip-card-skeleton-body">
            <Skeleton className="skeleton-line skeleton-line-lg" />
            <Skeleton className="skeleton-line skeleton-line-md" />
            <div className="skeleton-chip-row">
              <Skeleton className="skeleton-chip" />
              <Skeleton className="skeleton-chip" />
              <Skeleton className="skeleton-chip" />
            </div>
          </div>
        </article>
      ))}
    </>
  );
}

export function DashboardTripGridSkeleton({ count = 6 }: SkeletonCountProps) {
  return (
    <>
      {repeat(count).map((index) => (
        <article
          className="dashboard-trip-skeleton"
          aria-hidden="true"
          key={index}
        >
          <Skeleton className="dashboard-trip-skeleton-image" />
          <div className="dashboard-trip-skeleton-body">
            <Skeleton className="skeleton-line skeleton-line-lg" />
            <Skeleton className="skeleton-line skeleton-line-md" />
            <Skeleton className="skeleton-line skeleton-line-sm" />
          </div>
        </article>
      ))}
    </>
  );
}

export function TripDetailPageSkeleton() {
  return (
    <main
      className="trip-detail-page page-skeleton"
      aria-label="Trip details loading"
    >
      <section className="trip-detail-hero trip-detail-hero-skeleton">
        <Skeleton className="page-skeleton-hero-image" />
        <div className="container trip-detail-hero-inner">
          <Skeleton className="skeleton-pill skeleton-pill-sm" />
          <Skeleton className="skeleton-line skeleton-title-line" />
          <Skeleton className="skeleton-line skeleton-line-xl" />
          <div className="skeleton-chip-row">
            <Skeleton className="skeleton-chip" />
            <Skeleton className="skeleton-chip" />
            <Skeleton className="skeleton-chip" />
          </div>
        </div>
      </section>
      <section className="container trip-detail-shell">
        <div className="trip-detail-main">
          <Skeleton className="page-skeleton-panel skeleton-panel-short" />
          <Skeleton className="page-skeleton-panel skeleton-panel-tall" />
          <Skeleton className="page-skeleton-panel skeleton-panel-tall" />
        </div>
        <aside className="trip-detail-side">
          <Skeleton className="page-skeleton-panel skeleton-panel-side" />
        </aside>
      </section>
    </main>
  );
}

export function PublicProfilePageSkeleton() {
  return (
    <main
      className="public-profile-page page-skeleton"
      aria-label="Traveler profile loading"
    >
      <section className="public-profile-hero">
        <div className="container public-profile-hero-inner">
          <Skeleton className="profile-hero-card profile-hero-card-skeleton" />
          <div className="profile-stat-row profile-stat-row-skeleton">
            {repeat(4).map((index) => (
              <Skeleton key={index} />
            ))}
          </div>
        </div>
      </section>
      <section className="container public-profile-content">
        <Skeleton className="page-skeleton-panel skeleton-panel-tall" />
        <aside className="public-profile-side">
          <Skeleton className="page-skeleton-panel skeleton-panel-side" />
          <Skeleton className="page-skeleton-panel skeleton-panel-side" />
        </aside>
      </section>
    </main>
  );
}

export function ExplorePageSkeleton() {
  return (
    <main
      className="explore-page page-skeleton"
      aria-label="Explore trips loading"
    >
      <section className="explore-hero">
        <div className="container explore-hero-inner">
          <Skeleton className="skeleton-pill skeleton-pill-sm" />
          <Skeleton className="skeleton-line skeleton-title-line" />
          <Skeleton className="skeleton-line skeleton-line-xl" />
        </div>
      </section>
      <section className="container explore-layout">
        <Skeleton className="explore-filter-panel page-skeleton-panel" />
        <div className="explore-results-panel">
          <Skeleton className="page-skeleton-toolbar" />
          <div className="explore-trip-grid">
            <ExploreTripGridSkeleton />
          </div>
        </div>
      </section>
    </main>
  );
}

export function DashboardPageSkeleton() {
  return (
    <main
      className="dashboard-page page-skeleton"
      aria-label="Dashboard loading"
    >
      <div className="dashboard-shell dashboard-shell-skeleton">
        <aside className="dashboard-sidebar">
          <Skeleton className="page-skeleton-panel skeleton-panel-side" />
        </aside>
        <section className="dashboard-content">
          <Skeleton className="dashboard-hero-panel dashboard-hero-skeleton" />
          <Skeleton className="page-skeleton-toolbar" />
          <div className="dashboard-trip-grid">
            <DashboardTripGridSkeleton />
          </div>
        </section>
      </div>
    </main>
  );
}

export function FootprintContentSkeleton() {
  return (
    <div
      className="footprint-content-skeleton"
      role="status"
      aria-label="Loading travel footprint"
    >
      <Skeleton className="footprint-profile-card footprint-profile-skeleton" />
      <div className="footprint-grid">
        <Skeleton className="page-skeleton-panel skeleton-panel-tall" />
        <Skeleton className="page-skeleton-panel skeleton-panel-tall" />
      </div>
    </div>
  );
}

export function ProfileEditSkeleton() {
  return (
    <div className="profile-edit-card profile-edit-skeleton" aria-live="polite">
      <Skeleton className="profile-edit-photo-skeleton" />
      <Skeleton className="skeleton-line skeleton-line-lg" />
      <Skeleton className="skeleton-input" />
      <Skeleton className="skeleton-input" />
      <Skeleton className="skeleton-input" />
      <Skeleton className="skeleton-button" />
    </div>
  );
}
