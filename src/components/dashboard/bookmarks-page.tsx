"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Bookmark,
  Briefcase,
  ChevronDown,
  Eye,
  Heart,
  Home,
  Map,
  Menu,
  Plus,
  Search,
  User
} from "lucide-react";
import { exploreTrips } from "@/data/explore-trips";

const profilePhoto = "/images/hero/mountain-lake-traveler.png";

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

const bookmarkedTrips = exploreTrips.slice(0, 6);

export function BookmarksPage() {
  return (
    <main id="main-content" className="dashboard-page">
      <header className="dashboard-topbar" aria-label="Dashboard header">
        <Link className="dashboard-brand" href="/" aria-label="AfterTrip home">
          <Image
            src="/brand/aftertrip-mark.svg"
            alt=""
            width={38}
            height={38}
            priority
            aria-hidden="true"
          />
          <span>AfterTrip</span>
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
          <Link
            className="dashboard-create-button"
            href="/dashboard/create-trip"
          >
            <Plus aria-hidden="true" size={18} />
            Publish Trip
          </Link>
          <button
            className="dashboard-icon-button"
            type="button"
            aria-label="Notifications"
          >
            <Bell aria-hidden="true" size={22} />
          </button>
          <Link
            className="dashboard-profile-button"
            href="/dashboard/edit-profile"
            aria-label="Open edit profile"
          >
            <span
              style={{ backgroundImage: "url(" + profilePhoto + ")" }}
              aria-hidden="true"
            />
            <ChevronDown aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="dashboard-mobile-actions">
          <button
            className="dashboard-icon-button"
            type="button"
            aria-label="Notifications"
          >
            <Bell aria-hidden="true" size={21} />
          </button>
          <button
            className="dashboard-icon-button"
            type="button"
            aria-label="Open menu"
          >
            <Menu aria-hidden="true" size={25} />
          </button>
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
            {bookmarkedTrips.map((trip) => (
              <Link
                className="dashboard-trip-card dashboard-bookmark-card"
                href={`/trips/${trip.slug}`}
                key={trip.slug}
              >
                <span className="dashboard-trip-image">
                  <Image
                    src={trip.image.src}
                    alt={trip.image.alt}
                    fill
                    sizes="(max-width: 767px) 116px, (max-width: 1199px) 50vw, 360px"
                  />
                  <span>Bookmarked</span>
                  <span className="dashboard-bookmark-icon" aria-hidden="true">
                    <Bookmark size={18} />
                  </span>
                </span>
                <span className="dashboard-trip-body">
                  <span className="dashboard-trip-title-row">
                    <h2>{trip.title}</h2>
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
              </Link>
            ))}
          </div>
        </section>
      </div>

      <nav
        className="dashboard-bottom-nav"
        aria-label="Mobile dashboard navigation"
      >
        <Link href="/explore">
          <Search aria-hidden="true" size={22} />
          Explore
        </Link>
        <Link className="active" href="/dashboard/bookmarks">
          <Bookmark aria-hidden="true" size={22} />
          Bookmarks
        </Link>
        <Link className="create" href="/dashboard/create-trip">
          <Plus aria-hidden="true" size={28} />
          <span>Publish Trip</span>
        </Link>
        <Link href="/dashboard">
          <Briefcase aria-hidden="true" size={22} />
          My Trips
        </Link>
        <Link href="/dashboard/edit-profile">
          <User aria-hidden="true" size={22} />
          Profile
        </Link>
      </nav>
    </main>
  );
}
