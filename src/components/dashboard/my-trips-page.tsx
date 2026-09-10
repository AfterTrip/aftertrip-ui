"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Eye,
  Heart,
  Home,
  ImagePlus,
  Map,
  Pencil,
  Plus,
  Search,
  Briefcase,
  User,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getMyTrips,
  getOwnProfileViews,
  getTripEngagement,
  deleteTrip,
  loadOwnedMedia,
  publicMediaUrl
} from "@/lib/aftertrip-api";
import { formatCount, formatTripDates } from "@/lib/formatters";
import { useAuthenticatedPage } from "@/lib/use-authenticated-page";
import { AccountMenu } from "@/components/layout/account-menu";
import { DeleteTripDialog } from "@/components/dashboard/delete-trip-dialog";
import { DashboardBottomNavigation } from "@/components/dashboard/dashboard-bottom-navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type TripStatus = "published" | "draft";

type MyTrip = {
  id: string;
  slug: string;
  title: string;
  status: TripStatus;
  image: string;
  alt: string;
  date: string;
  days?: string;
  destination: string;
  views: number;
  likes: number;
  sortTimestamp: number;
  lastEdited?: string;
};

const DEFAULT_TRIP_COVER = "/images/hero/mountain-lake-traveler.png";

const sidebarItems = [
  { label: "My Trips", href: "/dashboard", icon: Home, active: true },
  { label: "Travel Footprint", href: "/dashboard/travel-footprint", icon: Map },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "Edit Profile", href: "/dashboard/edit-profile", icon: User }
];

export function MyTripsPage() {
  const authenticated = useAuthenticatedPage();
  const [activeTab, setActiveTab] = useState<TripStatus>("published");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const [trips, setTrips] = useState<MyTrip[]>([]);
  const [profileViews, setProfileViews] = useState(0);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    const ownedCoverUrls: string[] = [];
    void (async () => {
      try {
        const [tripPage, views] = await Promise.all([getMyTrips(), getOwnProfileViews()]);
        const published = tripPage.content.filter((trip) => trip.status === "PUBLISHED");
        const [engagement, draftCoverEntries] = await Promise.all([
          getTripEngagement(published.map((trip) => trip.id)),
          Promise.all(
            tripPage.content
              .filter((trip) => trip.status === "DRAFT" && trip.coverMediaId)
              .map(async (trip) => {
                try {
                  const blob = await loadOwnedMedia(trip.coverMediaId!);
                  const url = URL.createObjectURL(blob);
                  ownedCoverUrls.push(url);
                  return [trip.id, url] as const;
                } catch {
                  return null;
                }
              })
          )
        ]);
        if (!active) return;
        const draftCovers = new globalThis.Map(
          draftCoverEntries.filter((entry): entry is readonly [string, string] => entry !== null)
        );
        setProfileViews(views.views);
        setTrips(
          tripPage.content.map((trip) => {
            const metrics = engagement.find((item) => item.tripId === trip.id);
            return {
              id: trip.id,
              slug: trip.slug ?? trip.id,
              title: trip.title || "Untitled trip",
              status: trip.status === "PUBLISHED" ? "published" : "draft",
              image:
                (trip.status === "DRAFT" ? draftCovers.get(trip.id) : undefined) ??
                (trip.status === "PUBLISHED" ? publicMediaUrl(trip.coverMediaId) : undefined) ??
                DEFAULT_TRIP_COVER,
              alt: `${trip.title || "Trip"} cover photo`,
              date: formatTripDates(trip.startDate, trip.endDate),
              days: trip.durationDays ? `${trip.durationDays} days` : undefined,
              destination: trip.destination?.displayName || "Destination not set",
              views: metrics?.views ?? 0,
              likes: metrics?.likes ?? 0,
              sortTimestamp: new Date(
                trip.publishedAt ?? trip.updatedAt ?? trip.createdAt
              ).getTime(),
              lastEdited: `Updated ${new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(trip.updatedAt))}`
            };
          })
        );
      } catch {
        if (active) setLoadError("We couldn't load your trips right now. Please try again.");
      }
    })();
    return () => {
      active = false;
      ownedCoverUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [authenticated]);

  const summary = [
    {
      label: "Trips",
      value: String(trips.filter((trip) => trip.status === "published").length),
      caption: "Published",
      icon: Briefcase
    },
    {
      label: "Drafts",
      value: String(trips.filter((trip) => trip.status === "draft").length),
      caption: "Unpublished",
      icon: Pencil
    },
    { label: "Views", value: formatCount(profileViews), caption: "Profile", icon: Eye }
  ];

  const visibleTrips = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = trips.filter((trip) => {
      const matchesTab = trip.status === activeTab;
      const matchesSearch =
        !normalized ||
        [trip.title, trip.destination]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesTab && matchesSearch;
    });

    return [...filtered].sort((first, second) => {
      if (sort === "popular") {
        return (
          second.likes - first.likes ||
          second.views - first.views ||
          second.sortTimestamp - first.sortTimestamp
        );
      }

      return sort === "oldest"
        ? first.sortTimestamp - second.sortTimestamp
        : second.sortTimestamp - first.sortTimestamp;
    });
  }, [activeTab, query, sort, trips]);

  const removeTrip = async (tripId: string) => {
    await deleteTrip(tripId);
    setTrips((current) => current.filter((trip) => trip.id !== tripId));
  };

  return (
    <main id="main-content" className="dashboard-page">
      <header className="dashboard-topbar" aria-label="Dashboard header">
        <Link className="dashboard-brand" href="/" aria-label="AfterTrip home">
          <Image
            src="/brand/aftertrip-logo-green.png"
            alt=""
            width={160}
            height={53}
            priority
            aria-hidden="true"
          />
        </Link>
        <nav
          className="dashboard-desktop-nav"
          aria-label="Dashboard navigation"
        >
          <Link href="/explore">Explore</Link>
          <Link href="/#reviews">Reviews</Link>
          <Link href="/#how-it-works">How it works</Link>
        </nav>
        <div className="dashboard-top-actions">
          <ThemeToggle />
          <Link
            className="dashboard-create-button"
            href="/dashboard/create-trip"
          >
            <Plus aria-hidden="true" size={18} />
            Publish Trip
          </Link>
          <AccountMenu variant="dashboard" />
        </div>
        <div className="dashboard-mobile-actions">
          <ThemeToggle />
        </div>
      </header>

      <div className="dashboard-shell">
        <aside className="dashboard-sidebar" aria-label="My trips sections">
          <nav className="dashboard-side-nav">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className={item.active ? "active" : undefined}
                  href={item.href}
                  key={item.label}
                >
                  <Icon aria-hidden="true" size={22} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <section
            className="dashboard-share-card"
            aria-label="Create trip prompt"
          >
            <div className="dashboard-share-illustration" aria-hidden="true">
              <i />
              <span />
            </div>
            <h2>Share your journey</h2>
            <p>Inspire others by publishing your next trip.</p>
            <Link href="/dashboard/create-trip">
              <Plus aria-hidden="true" size={18} />
              Publish Trip
            </Link>
          </section>
        </aside>

        <section
          className="dashboard-content"
          aria-labelledby="dashboard-title"
        >
          <div className="dashboard-hero-panel">
            <Image
              className="dashboard-hero-image"
              src="/images/hero/mountain-lake-traveler.png"
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 100vw, 1200px"
              aria-hidden="true"
            />
            <div className="dashboard-hero-copy">
              <h1 id="dashboard-title">My Trips</h1>
              <p>Your journeys, memories and stories.</p>
            </div>
            <div
              className="dashboard-summary-card"
              aria-label="Trip account summary"
            >
              {summary.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.label}>
                    <span>
                      <Icon aria-hidden="true" size={24} />
                    </span>
                    <strong>{item.value}</strong>
                    <p>{item.label}</p>
                    <small>{item.caption}</small>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="dashboard-controls">
            <div
              className="dashboard-tabs"
              role="tablist"
              aria-label="Trip status"
            >
              <button
                aria-selected={activeTab === "published"}
                role="tab"
                type="button"
                onClick={() => setActiveTab("published")}
              >
                Published
              </button>
              <button
                aria-selected={activeTab === "draft"}
                role="tab"
                type="button"
                onClick={() => setActiveTab("draft")}
              >
                Drafts
              </button>
            </div>
            <div className="dashboard-search-sort">
              <label className="dashboard-search-field">
                <Search aria-hidden="true" size={20} />
                <span className="sr-only">Search my trips</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search my trips..."
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X aria-hidden="true" size={18} />
                  </button>
                ) : null}
              </label>
              <label className="dashboard-sort-field">
                <span>Sort:</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Sort trips"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Popular</option>
                  <option value="oldest">Oldest</option>
                </select>
              </label>
            </div>
          </div>

          {loadError ? <p className="dashboard-api-error" role="alert">{loadError}</p> : null}
          <div
            className="dashboard-trip-grid"
            role="list"
            aria-label="My trip results"
            aria-live="polite"
          >
            {visibleTrips.length ? (
              visibleTrips.map((trip) => (
                <article className="dashboard-trip-card" role="listitem" key={trip.id}>
                  <div className="dashboard-trip-image">
                    {trip.status === "published" ? (
                      <Link
                        className="dashboard-trip-image-link"
                        href={`/trips/${trip.slug}`}
                        aria-label={`View published trip ${trip.title}`}
                      >
                        <Image
                          src={trip.image}
                          alt={trip.alt}
                          fill
                          sizes="(max-width: 767px) 116px, (max-width: 1199px) 50vw, 360px"
                        />
                      </Link>
                    ) : (
                      <Image
                        src={trip.image}
                        alt={trip.alt}
                        fill
                        sizes="(max-width: 767px) 116px, (max-width: 1199px) 50vw, 360px"
                      />
                    )}
                    <span>
                      {trip.status === "published" ? "Published" : "Draft"}
                    </span>
                    <div className="dashboard-card-actions">
                      <Link
                        className="dashboard-card-edit"
                        href={`/dashboard/create-trip?trip=${trip.id}`}
                        aria-label={`Edit ${trip.title}`}
                      >
                        <Pencil aria-hidden="true" size={15} />
                        Edit
                      </Link>
                      <DeleteTripDialog
                        className="dashboard-card-delete"
                        tripTitle={trip.title}
                        onDelete={() => removeTrip(trip.id)}
                      />
                    </div>
                  </div>
                  <div className="dashboard-trip-body">
                    <div className="dashboard-trip-title-row">
                      {trip.status === "published" ? (
                        <h2>
                          <Link href={`/trips/${trip.slug}`}>{trip.title}</Link>
                        </h2>
                      ) : (
                        <h2>{trip.title}</h2>
                      )}
                    </div>
                    <p>
                      {trip.date}
                      {trip.days ? <span> • {trip.days}</span> : null}
                      {trip.lastEdited ? (
                        <span> • {trip.lastEdited}</span>
                      ) : null}
                    </p>
                    <p className="dashboard-location">{trip.destination}</p>
                    {trip.status === "published" ? (
                      <div className="dashboard-published-footer">
                        <div className="dashboard-trip-meta">
                          <span>
                            <Eye aria-hidden="true" size={16} />
                            {formatCount(trip.views)}
                          </span>
                          <span>
                            <Heart aria-hidden="true" size={16} />
                            {formatCount(trip.likes)}
                          </span>
                        </div>
                        <Link
                          className="dashboard-view-trip"
                          href={`/trips/${trip.slug}`}
                        >
                          <Eye aria-hidden="true" size={15} />
                          View trip
                        </Link>
                      </div>
                    ) : (
                      <Link
                        className="dashboard-edit-link"
                        href={`/dashboard/create-trip?trip=${trip.id}`}
                      >
                        Continue editing
                      </Link>
                    )}
                    <div className="dashboard-mobile-card-actions">
                      <Link
                        href={`/dashboard/create-trip?trip=${trip.id}`}
                        aria-label={`Edit ${trip.title}`}
                      >
                        <Pencil aria-hidden="true" size={15} />
                        Edit
                      </Link>
                      <DeleteTripDialog
                        className="dashboard-mobile-delete"
                        tripTitle={trip.title}
                        onDelete={() => removeTrip(trip.id)}
                        showLabel
                      />
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="dashboard-empty-state">
                <Search aria-hidden="true" size={28} />
                <h2>No trips found</h2>
                <p>Try another search or switch tabs.</p>
              </div>
            )}
          </div>

          <section className="dashboard-limits-card">
            <span>
              <ImagePlus aria-hidden="true" size={34} />
            </span>
            <div>
              <h2>Create without limits</h2>
              <p>Unlimited trips, photos and stories. Yours forever.</p>
              <Link href="/dashboard/create-trip">Learn more</Link>
            </div>
          </section>
        </section>
      </div>

      <DashboardBottomNavigation />
    </main>
  );
}
