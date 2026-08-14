"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Bell,
  Bookmark,
  Briefcase,
  CalendarDays,
  ChevronDown,
  Home,
  Leaf,
  Map,
  MapPin,
  Menu,
  Mountain,
  Plus,
  Search,
  ShieldCheck,
  User,
  Users,
  Waves
} from "lucide-react";
import { useEffect, useRef } from "react";

const profilePhoto = "/images/hero/mountain-lake-traveler.png";

const sidebarItems = [
  { label: "My Trips", href: "/dashboard", icon: Home },
  {
    label: "Travel Footprint",
    href: "/dashboard/travel-footprint",
    icon: Map,
    active: true
  },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "Edit Profile", href: "/dashboard/edit-profile", icon: User }
];

const footprintTrips = [
  {
    destination: "Andaman Islands",
    label: "Andaman Islands, India",
    trips: 2,
    days: 8,
    coordinates: { lat: 11.7401, lng: 92.6586 }
  },
  {
    destination: "Goa",
    label: "Goa, India",
    trips: 1,
    days: 4,
    coordinates: { lat: 15.2993, lng: 74.124 }
  },
  {
    destination: "Munnar",
    label: "Munnar, Kerala, India",
    trips: 3,
    days: 9,
    coordinates: { lat: 10.0889, lng: 77.0595 }
  },
  {
    destination: "Meghalaya",
    label: "Meghalaya, India",
    trips: 2,
    days: 7,
    coordinates: { lat: 25.467, lng: 91.3662 }
  },
  {
    destination: "Kashmir",
    label: "Kashmir, India",
    trips: 1,
    days: 7,
    coordinates: { lat: 34.0837, lng: 74.7973 }
  },
  {
    destination: "Bali",
    label: "Bali, Indonesia",
    trips: 3,
    days: 11,
    coordinates: { lat: -8.3405, lng: 115.092 }
  }
];

const travelDna = [
  { label: "Nature", value: 82, icon: Leaf },
  { label: "Adventure", value: 61, icon: Mountain },
  { label: "Mountains", value: 54, icon: Mountain },
  { label: "Beach", value: 38, icon: Waves }
];

const achievements = [
  { label: "First Journey", icon: Briefcase },
  { label: "Mountain Explorer", icon: Mountain },
  { label: "Nature Lover", icon: Leaf },
  { label: "Coast Chaser", icon: Waves },
  { label: "10 Journeys", icon: Award },
  { label: "Verified Mapper", icon: ShieldCheck }
];

const travelWith = [
  { label: "Friends", value: 58 },
  { label: "Family", value: 25 },
  { label: "Solo", value: 13 },
  { label: "Couple", value: 4 }
];

export function TravelFootprintPage() {
  const totalTrips = footprintTrips.reduce(
    (sum, place) => sum + place.trips,
    0
  );
  const travelDays = footprintTrips.reduce((sum, place) => sum + place.days, 0);
  const totalAchievements = 50;
  const unlockedAchievements = achievements.length;

  return (
    <main id="main-content" className="dashboard-page footprint-page">
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
          <section
            className="dashboard-share-card footprint-side-card"
            aria-label="Travel footprint prompt"
          >
            <div className="dashboard-share-illustration" aria-hidden="true">
              <i />
              <span />
            </div>
            <h2>Every journey leaves a mark.</h2>
            <p>Verified destinations become your personal travel map.</p>
            <Link href="/dashboard/create-trip">
              <Plus aria-hidden="true" size={18} />
              Publish Trip
            </Link>
          </section>
        </aside>

        <section
          className="dashboard-content footprint-content"
          aria-labelledby="footprint-title"
        >
          <section className="footprint-profile-card">
            <Image
              src="/images/cta/share-adventure.png"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 1100px"
              aria-hidden="true"
            />
            <div>
              <span
                className="footprint-avatar"
                style={{ backgroundImage: "url(" + profilePhoto + ")" }}
                aria-hidden="true"
              />
              <div>
                <h1 id="footprint-title">
                  Sreehari P <ShieldCheck aria-hidden="true" size={20} />
                </h1>
                <p>
                  <MapPin aria-hidden="true" size={17} />
                  Kochi, Kerala, India
                </p>
                <strong>Exploring the world, one journey at a time.</strong>
              </div>
            </div>
          </section>

          <div className="footprint-summary" aria-label="Travel summary">
            <article>
              <Briefcase aria-hidden="true" size={24} />
              <strong>{totalTrips}</strong>
              <span>Trips</span>
            </article>
            <article>
              <CalendarDays aria-hidden="true" size={24} />
              <strong>{travelDays}</strong>
              <span>Travel Days</span>
            </article>
            <article>
              <Award aria-hidden="true" size={24} />
              <strong>
                {unlockedAchievements}/{totalAchievements}
              </strong>
              <span>Achievements unlocked</span>
            </article>
          </div>

          <div className="footprint-grid">
            <section className="footprint-map-card">
              <div className="footprint-section-heading">
                <div>
                  <h2>Travel Footprint</h2>
                  <p>Coordinates from verified destinations in your trips.</p>
                </div>
                <span>Map View</span>
              </div>
              <FootprintMap places={footprintTrips} />
            </section>

            <aside className="footprint-insights" aria-label="Travel insights">
              <section className="footprint-card">
                <h2>Travel DNA</h2>
                <p>Your travel personality from published trips.</p>
                <div className="footprint-bars">
                  {travelDna.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article key={item.label}>
                        <Icon aria-hidden="true" size={20} />
                        <span>{item.label}</span>
                        <strong>{item.value}%</strong>
                        <i style={{ width: `${item.value}%` }} />
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="footprint-card">
                <h2>Achievements</h2>
                <p>Milestones unlocked from your journeys.</p>
                <div className="footprint-achievements">
                  {achievements.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article key={item.label}>
                        <span>
                          <Icon aria-hidden="true" size={22} />
                        </span>
                        {item.label}
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="footprint-card">
                <h2>Travel with</h2>
                <p>Who you travel with most.</p>
                <div className="footprint-companions">
                  {travelWith.map((item) => (
                    <article key={item.label}>
                      <Users aria-hidden="true" size={18} />
                      <span>{item.label}</span>
                      <i>
                        <em style={{ width: `${item.value}%` }} />
                      </i>
                      <strong>{item.value}%</strong>
                    </article>
                  ))}
                </div>
              </section>
            </aside>
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
        <Link href="/dashboard/bookmarks">
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

function FootprintMap({ places }: { places: typeof footprintTrips }) {
  const mapNode = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !mapNode.current) return;

    let cancelled = false;
    let cleanup = () => {};

    async function loadMapbox() {
      const mapboxgl = await import("mapbox-gl");
      if (cancelled || !mapNode.current) return;

      mapboxgl.default.accessToken = token;
      const map = new mapboxgl.default.Map({
        container: mapNode.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        center: [78.9629, 20.5937],
        zoom: 3.2,
        minZoom: 2.4,
        maxZoom: 10,
        attributionControl: false,
        cooperativeGestures: true
      });

      map.addControl(
        new mapboxgl.default.NavigationControl({ showCompass: false }),
        "bottom-right"
      );

      const markers = places.map((place) => {
        const element = document.createElement("button");
        element.type = "button";
        element.className = "footprint-mapbox-marker";
        element.textContent = String(place.trips);
        element.setAttribute(
          "aria-label",
          `${place.label}, ${place.trips} trips`
        );

        return new mapboxgl.default.Marker({ element })
          .setLngLat([place.coordinates.lng, place.coordinates.lat])
          .setPopup(
            new mapboxgl.default.Popup({
              closeButton: false,
              offset: 18
            }).setHTML(
              `<strong>${place.destination}</strong><span>${place.days} travel days</span>`
            )
          )
          .addTo(map);
      });

      cleanup = () => {
        markers.forEach((marker) => marker.remove());
        map.remove();
      };
    }

    void loadMapbox();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [places, token]);

  return (
    <div
      className={
        token
          ? "footprint-map footprint-mapbox"
          : "footprint-map footprint-mapbox is-missing-token"
      }
      aria-label="Verified destination Mapbox map"
    >
      <div ref={mapNode} className="footprint-mapbox-canvas" />
      {!token ? (
        <div className="footprint-mapbox-empty">
          <Map aria-hidden="true" size={30} />
          <strong>Mapbox token needed</strong>
          <span>Add NEXT_PUBLIC_MAPBOX_TOKEN to show your live footprint.</span>
        </div>
      ) : null}
    </div>
  );
}
