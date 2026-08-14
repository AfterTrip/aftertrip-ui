"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Bookmark,
  ChevronDown,
  Eye,
  Heart,
  Home,
  ImagePlus,
  Map,
  Menu,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Briefcase,
  User,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

type TripStatus = "published" | "draft";

type MyTrip = {
  id: string;
  title: string;
  status: TripStatus;
  image: string;
  alt: string;
  date: string;
  days?: string;
  destination: string;
  views?: string;
  likes?: string;
  lastEdited?: string;
};

const trips: MyTrip[] = [
  {
    id: "meghalaya-road-trip",
    title: "Meghalaya Road Trip",
    status: "published",
    image: "/images/cta/share-adventure.png",
    alt: "Green mountain road in Meghalaya",
    date: "May 12 - May 18, 2024",
    days: "6 days",
    destination: "Meghalaya, India",
    views: "2.3K",
    likes: "421"
  },
  {
    id: "bali-island-of-gods",
    title: "Bali: Island of Gods",
    status: "published",
    image: "/images/trips/bali.png",
    alt: "Aerial view of a Bali beach",
    date: "Apr 3 - Apr 9, 2024",
    days: "7 days",
    destination: "Bali, Indonesia",
    views: "1.8K",
    likes: "316"
  },
  {
    id: "kashmir-in-spring",
    title: "Kashmir in Spring",
    status: "published",
    image: "/images/trips/switzerland.png",
    alt: "Snowy mountain valley similar to Kashmir in spring",
    date: "Mar 15 - Mar 21, 2024",
    days: "7 days",
    destination: "Kashmir, India",
    views: "1.2K",
    likes: "244"
  },
  {
    id: "thailand-getaway",
    title: "Thailand Getaway",
    status: "published",
    image: "/images/trips/thailand.png",
    alt: "Clear turquoise water around Thai islands",
    date: "Feb 10 - Feb 16, 2024",
    days: "6 days",
    destination: "Thailand",
    views: "1.1K",
    likes: "219"
  },
  {
    id: "munnar-monsoon-escape",
    title: "Munnar Monsoon Escape",
    status: "draft",
    image: "/images/destinations/thailand.png",
    alt: "Misty green hills and water in a tropical landscape",
    date: "Draft",
    destination: "Kerala, India",
    lastEdited: "Last edited 2 days ago"
  },
  {
    id: "japan-cherry-blossom",
    title: "Japan Cherry Blossom",
    status: "draft",
    image: "/images/destinations/japan.png",
    alt: "Japanese pagoda near Mount Fuji at sunset",
    date: "Draft",
    destination: "Japan",
    lastEdited: "Last edited 5 days ago"
  }
];

const summary = [
  { label: "Trips", value: "7", caption: "Published", icon: Briefcase },
  { label: "Drafts", value: "2", caption: "Unpublished", icon: Pencil },
  { label: "Views", value: "12.4K", caption: "Profile", icon: Eye }
];

const sidebarItems = [
  { label: "My Trips", href: "/dashboard", icon: Home, active: true },
  { label: "Travel Footprint", href: "/dashboard/travel-footprint", icon: Map },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "Edit Profile", href: "/dashboard/edit-profile", icon: User }
];

export function MyTripsPage() {
  const [activeTab, setActiveTab] = useState<TripStatus>("published");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const profilePhoto = "/images/hero/mountain-lake-traveler.png";

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

    return sort === "oldest" ? [...filtered].reverse() : filtered;
  }, [activeTab, query, sort]);

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
          <button
            className="dashboard-profile-button"
            type="button"
            aria-label="Open profile menu"
          >
            <span
              style={{ backgroundImage: "url(" + profilePhoto + ")" }}
              aria-hidden="true"
            />
            <ChevronDown aria-hidden="true" size={18} />
          </button>
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
            <div>
              <h1 id="dashboard-title">My Trips</h1>
              <p>Your journeys, memories and stories.</p>
            </div>
            <div className="dashboard-scene" aria-hidden="true">
              <span className="sun" />
              <span className="bird one" />
              <span className="bird two" />
              <span className="ridge far" />
              <span className="ridge near" />
              <span className="tree a" />
              <span className="tree b" />
              <span className="tree c" />
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
                  <option value="oldest">Oldest</option>
                </select>
              </label>
              <button
                className="dashboard-filter-button"
                type="button"
                aria-label="Open filters"
              >
                <SlidersHorizontal aria-hidden="true" size={22} />
              </button>
            </div>
          </div>

          <div className="dashboard-trip-grid" aria-live="polite">
            {visibleTrips.length ? (
              visibleTrips.map((trip) => (
                <article className="dashboard-trip-card" key={trip.id}>
                  <div className="dashboard-trip-image">
                    <Image
                      src={trip.image}
                      alt={trip.alt}
                      fill
                      sizes="(max-width: 767px) 116px, (max-width: 1199px) 50vw, 360px"
                    />
                    <span>
                      {trip.status === "published" ? "Published" : "Draft"}
                    </span>
                    <Link
                      className="dashboard-card-edit"
                      href={`/dashboard/create-trip?trip=${trip.id}`}
                      aria-label={`Edit ${trip.title}`}
                    >
                      <Pencil aria-hidden="true" size={15} />
                      Edit
                    </Link>
                  </div>
                  <div className="dashboard-trip-body">
                    <div className="dashboard-trip-title-row">
                      <h2>{trip.title}</h2>
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
                      <div className="dashboard-trip-meta">
                        <span>
                          <Eye aria-hidden="true" size={16} />
                          {trip.views}
                        </span>
                        <span>
                          <Heart aria-hidden="true" size={16} />
                          {trip.likes}
                        </span>
                      </div>
                    ) : (
                      <Link
                        className="dashboard-edit-link"
                        href={`/dashboard/create-trip?trip=${trip.id}`}
                      >
                        Continue editing
                      </Link>
                    )}
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

      <nav
        className="dashboard-bottom-nav"
        aria-label="Mobile dashboard navigation"
      >
        <Link href="/explore">
          <Search aria-hidden="true" size={22} />
          Explore
        </Link>
        <Link href="/dashboard/bookmarks">
          <Bookmark aria-hidden="true" size={22} />
          Bookmarks
        </Link>
        <Link className="create" href="/dashboard/create-trip">
          <Plus aria-hidden="true" size={28} />
          <span>Publish Trip</span>
        </Link>
        <Link className="active" href="/dashboard">
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
