"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Bookmark,
  Briefcase,
  CalendarDays,
  Home,
  Leaf,
  Map,
  MapPin,
  Mountain,
  Plus,
  ShieldCheck,
  User,
  Users,
  Waves
} from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  getOwnProfile,
  getOwnTravelFootprint,
  publicMediaUrl
} from "@/lib/aftertrip-api";
import { titleCaseEnum } from "@/lib/formatters";
import { useAuthenticatedPage } from "@/lib/use-authenticated-page";
import { AccountMenu } from "@/components/layout/account-menu";
import { DashboardBottomNavigation } from "@/components/dashboard/dashboard-bottom-navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const profilePhoto = "";
const DEFAULT_TRIP_COVER = "/images/hero/mountain-lake-traveler.png";

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

type FootprintPlace = {
  destination: string;
  label: string;
  trips: number;
  days: number;
  coverUrl: string;
  coordinates: { lat: number; lng: number };
};

type DnaItem = { label: string; value: number; icon: typeof Leaf };
type AchievementItem = { label: string; icon: typeof Award };
type CompanionItem = { label: string; value: number };

export function TravelFootprintPage() {
  const authenticated = useAuthenticatedPage();
  const [places, setPlaces] = useState<FootprintPlace[]>([]);
  const [dna, setDna] = useState<DnaItem[]>([]);
  const [unlocked, setUnlocked] = useState<AchievementItem[]>([]);
  const [companions, setCompanions] = useState<CompanionItem[]>([]);
  const [totalTrips, setTotalTrips] = useState(0);
  const [travelDays, setTravelDays] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState({
    name: "Traveler",
    location: "",
    tagline: "",
    avatar: profilePhoto,
    cover: DEFAULT_TRIP_COVER
  });
  const [message, setMessage] = useState("");
  const totalAchievements = 50;
  const unlockedAchievements = unlocked.length;

  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    Promise.all([getOwnTravelFootprint(), getOwnProfile()])
      .then(([footprint, ownProfile]) => {
        if (!active) return;
        setTotalTrips(footprint.summary.trips);
        setTravelDays(footprint.summary.travelDays);
        setPlaces(
          footprint.destinations.map((destination) => {
            const destinationJourneys = footprint.journeys.filter(
              (journey) => journey.destination === destination.displayName
            );
            const coverUrl =
              destinationJourneys
                .map(
                  (journey) =>
                    publicMediaUrl(journey.coverMediaId) ?? journey.coverUrl
                )
                .find(Boolean) ?? DEFAULT_TRIP_COVER;

            return {
              destination: destination.name,
              label: destination.displayName,
              trips: destination.trips,
              days: destinationJourneys.reduce(
                (sum, journey) => sum + journey.durationDays,
                0
              ),
              coverUrl,
              coordinates: {
                lat: destination.latitude,
                lng: destination.longitude
              }
            };
          })
        );
        setDna(
          footprint.travelDna.slice(0, 5).map((item) => ({
            label: titleCaseEnum(item.key),
            value: item.percentage,
            icon: item.key === "BEACH" ? Waves : item.key === "NATURE" ? Leaf : Mountain
          }))
        );
        setUnlocked(
          footprint.achievements.map((item) => ({
            label: item.title,
            icon: item.code.includes("MOUNTAIN")
              ? Mountain
              : item.code.includes("COAST")
                ? Waves
                : item.code.includes("NATURE")
                  ? Leaf
                  : Award
          }))
        );
        setCompanions(
          footprint.travelWith.map((item) => ({
            label: titleCaseEnum(item.key),
            value: item.percentage
          }))
        );
        setProfile({
          name: ownProfile.displayName,
          location: ownProfile.location ?? "",
          tagline: ownProfile.tagline ?? "",
          avatar:
            publicMediaUrl(ownProfile.avatarMediaId) ??
            ownProfile.avatarUrl ??
            profilePhoto,
          cover:
            publicMediaUrl(ownProfile.coverMediaId) ??
            ownProfile.coverUrl ??
            DEFAULT_TRIP_COVER
        });
      })
      .catch((error) => {
        if (active) setMessage(error instanceof Error ? error.message : "Could not load your travel footprint.");
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [authenticated]);

  if (!authenticated) {
    return (
      <main id="main-content" className="dashboard-page footprint-page">
        <DashboardBottomNavigation />
      </main>
    );
  }

  return (
    <main id="main-content" className="dashboard-page footprint-page">
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
          {!loaded && !message ? (
            <section className="footprint-loading-card" aria-live="polite">
              <h1 id="footprint-title" className="sr-only">
                Travel Footprint
              </h1>
              <strong>Loading your travel footprint...</strong>
              <span>Getting your latest profile and published trip map.</span>
            </section>
          ) : (
            <>
              <section className="footprint-profile-card">
                <Image
                  src={profile.cover}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 1100px"
                  aria-hidden="true"
                />
                <div>
                  <span
                    className={`footprint-avatar${profile.avatar ? " has-photo" : " profile-initials"}`}
                    style={profile.avatar ? { backgroundImage: "url(" + profile.avatar + ")" } : undefined}
                    aria-hidden="true"
                  >
                    {profile.avatar ? null : profile.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <h1 id="footprint-title">
                      {profile.name} <ShieldCheck aria-hidden="true" size={20} />
                    </h1>
                    <p>
                      <MapPin aria-hidden="true" size={17} />
                      {profile.location || "Location not shared"}
                    </p>
                    {profile.tagline ? <strong>{profile.tagline}</strong> : null}
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
                  </div>
                  {message ? <p className="dashboard-api-error" role="alert">{message}</p> : null}
                  <FootprintMap places={places} />
                </section>

                <aside className="footprint-insights" aria-label="Travel insights">
                  <section className="footprint-card">
                    <h2>Travel DNA</h2>
                    <p>Your travel personality from published trips.</p>
                    <div className="footprint-bars">
                      {dna.map((item) => {
                        const Icon = item.icon;
                        return (
                          <article key={item.label}>
                            <Icon aria-hidden="true" size={20} />
                            <span>{item.label}</span>
                            <strong>{item.value}%</strong>
                            <i
                              style={
                                { "--bar-value": `${item.value}%` } as CSSProperties
                              }
                            />
                          </article>
                        );
                      })}
                    </div>
                  </section>

                  <section className="footprint-card">
                    <h2>Achievements</h2>
                    <p>Milestones unlocked from your journeys.</p>
                    <div className="footprint-achievements">
                      {unlocked.map((item) => {
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
                      {companions.map((item) => (
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
            </>
          )}
        </section>
      </div>

      <DashboardBottomNavigation />
    </main>
  );
}

function FootprintMap({ places }: { places: FootprintPlace[] }) {
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
      mapNode.current.replaceChildren();
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
        element.className = place.coverUrl
          ? "footprint-mapbox-marker has-cover"
          : "footprint-mapbox-marker";
        if (place.coverUrl) {
          element.style.backgroundImage = `url(${place.coverUrl})`;
        } else {
          element.textContent = String(place.trips);
        }
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
