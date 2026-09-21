"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  BookmarkX,
  Eye,
  Heart,
  Home,
  Map,
  Plus,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ExploreTrip } from "@/types/explore-trip";
import {
  getBookmarks,
  getProfiles,
  getPublicTripById,
  getTripEngagement,
  removeBookmark
} from "@/lib/aftertrip-api";
import { apiTripToExploreTrip } from "@/lib/api-adapters";
import { useAuthenticatedPage } from "@/lib/use-authenticated-page";
import { GENERIC_ERROR_MESSAGE } from "@/lib/user-facing-errors";
import { AccountMenu } from "@/components/layout/account-menu";
import { DashboardBottomNavigation } from "@/components/dashboard/dashboard-bottom-navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { DashboardTripGridSkeleton } from "@/components/ui/page-skeletons";

const sidebarItems = [
  { label: "My Trips", href: "/dashboard", icon: Home },
  { label: "Travel Footprint", href: "/dashboard/travel-footprint", icon: Map },
  {
    label: "Bookmarks",
    href: "/dashboard/bookmarks",
    icon: Bookmark,
    active: true
  },
  { label: "Edit Profile", href: "/dashboard/edit-profile", icon: User }
];

export function BookmarksPage() {
  const authenticated = useAuthenticatedPage();
  const [bookmarkedTrips, setBookmarkedTrips] = useState<
    Array<ExploreTrip & { tripId: string }>
  >([]);
  const [removingTripId, setRemovingTripId] = useState<string>();
  const [message, setMessage] = useState("");
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);

  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    setLoadingBookmarks(true);
    setMessage("");
    getBookmarks()
      .then(async (page) => {
        const loaded = await Promise.all(
          page.content.map(async (bookmark) => {
            try {
              return {
                tripId: bookmark.tripId,
                trip: await getPublicTripById(bookmark.tripId)
              };
            } catch {
              await removeBookmark(bookmark.tripId).catch(() => undefined);
              return null;
            }
          })
        );
        const trips = loaded.filter((item) => item !== null);
        const [profiles, engagement] = await Promise.all([
          getProfiles([...new Set(trips.map(({ trip }) => trip.ownerUserId))]),
          getTripEngagement(trips.map(({ trip }) => trip.id))
        ]);
        if (!active) return;
        setBookmarkedTrips(
          trips.map(({ tripId, trip }) => ({
            ...apiTripToExploreTrip(
              trip,
              profiles.find((profile) => profile.userId === trip.ownerUserId),
              engagement.find((item) => item.tripId === trip.id)
            ),
            tripId
          }))
        );
        setMessage(trips.length ? "" : "No bookmarked trips yet.");
      })
      .catch(() => {
        if (active) setMessage(GENERIC_ERROR_MESSAGE);
      })
      .finally(() => {
        if (active) setLoadingBookmarks(false);
      });
    return () => {
      active = false;
    };
  }, [authenticated]);

  useEffect(() => {
    if (
      !message ||
      message === GENERIC_ERROR_MESSAGE ||
      bookmarkedTrips.length === 0
    )
      return;
    const timeout = window.setTimeout(() => setMessage(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [bookmarkedTrips.length, message]);

  const undoBookmark = async (tripId: string) => {
    setRemovingTripId(tripId);
    try {
      await removeBookmark(tripId);
      const remaining = bookmarkedTrips.filter(
        (trip) => trip.tripId !== tripId
      );
      setBookmarkedTrips(remaining);
      if (!remaining.length) setMessage("No bookmarked trips yet.");
    } catch {
      setMessage(GENERIC_ERROR_MESSAGE);
    } finally {
      setRemovingTripId(undefined);
    }
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
          <Link
            className="dashboard-mobile-bookmarks active"
            href="/dashboard/bookmarks"
            aria-label="Open bookmarks"
            aria-current="page"
          >
            <Bookmark aria-hidden="true" size={21} />
          </Link>
        </div>
      </header>

      <div className="dashboard-shell">
        <aside className="dashboard-sidebar" aria-label="Dashboard sections">
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
        </aside>

        <section
          className="dashboard-content bookmarks-content"
          aria-labelledby="bookmarks-title"
        >
          <div className="bookmarks-heading">
            <p>Saved trips</p>
            <h1 id="bookmarks-title">Bookmarks</h1>
            <span>
              Trips from other travelers that you want to revisit later.
            </span>
          </div>

          <div className="dashboard-trip-grid" aria-label="Bookmarked trips">
            {loadingBookmarks ? (
              <DashboardTripGridSkeleton count={4} />
            ) : message ? (
              <FeedbackMessage
                className="dashboard-api-message feedback-message-grid"
                title={
                  message === GENERIC_ERROR_MESSAGE
                    ? "Could not update bookmarks"
                    : "Bookmarks"
                }
                variant={message === GENERIC_ERROR_MESSAGE ? "error" : "info"}
              >
                {message}
              </FeedbackMessage>
            ) : null}
            {!loadingBookmarks &&
              bookmarkedTrips.map((trip) => (
                <article
                  className="dashboard-trip-card dashboard-bookmark-card"
                  key={trip.tripId}
                >
                  <Link
                    className="dashboard-trip-image"
                    href={`/trips/${trip.slug}`}
                  >
                    <Image
                      src={trip.image.src}
                      alt={trip.image.alt}
                      fill
                      sizes="(max-width: 767px) 116px, (max-width: 1199px) 50vw, 360px"
                    />
                    <span>Bookmarked</span>
                  </Link>
                  <span className="dashboard-trip-body">
                    <span className="dashboard-trip-title-row">
                      <Link href={`/trips/${trip.slug}`}>
                        <h2>{trip.title}</h2>
                      </Link>
                      <button
                        className="dashboard-bookmark-remove"
                        type="button"
                        disabled={removingTripId === trip.tripId}
                        onClick={() => void undoBookmark(trip.tripId)}
                        aria-label={`Remove bookmark for ${trip.title}`}
                      >
                        <BookmarkX aria-hidden="true" size={17} />
                        {removingTripId === trip.tripId
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </span>
                    <p>
                      {trip.place} • {trip.duration} • {trip.group}
                    </p>
                    <p className="dashboard-location">{trip.country}</p>
                    <span className="dashboard-trip-meta">
                      <span>
                        <Eye aria-hidden="true" size={16} />
                        {trip.views} views
                      </span>
                      <span>
                        <Heart aria-hidden="true" size={16} />
                        {trip.likes} likes
                      </span>
                    </span>
                  </span>
                </article>
              ))}
          </div>
        </section>
      </div>

      <DashboardBottomNavigation />
    </main>
  );
}
