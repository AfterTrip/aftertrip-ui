import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  Briefcase,
  CalendarDays,
  Eye,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { PublicProfileMap } from "@/components/profile/public-profile-map";
import { ProfileViewRecorder } from "@/components/profile/profile-view-recorder";
import { SharePageButton } from "@/components/ui/share-page-button";
import type { PublicProfile } from "@/types/public-profile";
import {
  getPublicProfile as loadPublicProfile,
  getPublicProfileViews,
  getPublicTravelFootprint,
  getTripEngagement,
  publicMediaUrl
} from "@/lib/aftertrip-api";
import { formatCount, titleCaseEnum } from "@/lib/formatters";
import { SITE_NAME } from "@/lib/constants";

const PUBLIC_PROFILE_COVER = "/images/hero/mountain-lake-traveler.png";

type TravelerProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: TravelerProfilePageProps) {
  const { slug } = await params;
  const profile = await loadPublicProfile(slug).catch(() => null);
  const description = profile?.tagline ?? "Traveler profile on AfterTrip.";
  const image = profile ? PUBLIC_PROFILE_COVER : undefined;

  return {
    title: profile
      ? `${profile.displayName} | AfterTrip`
      : "Traveler | AfterTrip",
    description,
    alternates: { canonical: `/travelers/${slug}` },
    openGraph: {
      title: profile
        ? `${profile.displayName} on ${SITE_NAME}`
        : `Traveler on ${SITE_NAME}`,
      description,
      url: `/travelers/${slug}`,
      type: "profile",
      images: image
        ? [
            {
              url: image,
              alt: `${profile?.displayName ?? "Traveler"} on AfterTrip`
            }
          ]
        : []
    },
    twitter: {
      card: "summary_large_image",
      title: profile
        ? `${profile.displayName} on ${SITE_NAME}`
        : `Traveler on ${SITE_NAME}`,
      description,
      images: image ? [image] : []
    }
  };
}

export default async function TravelerProfilePage({
  params
}: TravelerProfilePageProps) {
  const { slug } = await params;
  const apiProfile = await loadPublicProfile(slug).catch(() => null);

  if (!apiProfile) notFound();
  const [footprint, views] = await Promise.all([
    getPublicTravelFootprint(slug),
    getPublicProfileViews(slug)
  ]);
  const engagement = await getTripEngagement(
    footprint.journeys.map((journey) => journey.tripId)
  );
  const destinationCoverUrl = (displayName: string) =>
    footprint.journeys
      .filter((journey) => journey.destination === displayName)
      .map(
        (journey) => publicMediaUrl(journey.coverMediaId) ?? journey.coverUrl
      )
      .find(Boolean) ?? PUBLIC_PROFILE_COVER;

  const profile: PublicProfile = {
    slug: apiProfile.slug,
    name: apiProfile.displayName,
    initials: apiProfile.displayName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase(),
    avatarTone: "teal",
    location: apiProfile.location ?? "Location not shared",
    tagline: apiProfile.tagline ?? "Real journeys, thoughtfully shared.",
    coverImage: PUBLIC_PROFILE_COVER,
    photoImage:
      publicMediaUrl(apiProfile.avatarMediaId) ??
      apiProfile.avatarUrl ??
      "/brand/aftertrip-mark.svg",
    travelDays: footprint.summary.travelDays,
    achievements: footprint.summary.achievementsUnlocked,
    achievementBadges: footprint.achievements,
    styles: footprint.travelDna.map((item) => ({
      label: titleCaseEnum(item.key),
      value: item.percentage
    })),
    travelWith: footprint.travelWith.map((item) => ({
      label: titleCaseEnum(item.key),
      value: item.percentage
    })),
    footprint: footprint.destinations.map((destination, index) => ({
      label: destination.name,
      count: destination.trips,
      coverUrl: destinationCoverUrl(destination.displayName),
      x: 20 + ((index * 17) % 65),
      y: 25 + ((index * 13) % 50),
      coordinates: { lat: destination.latitude, lng: destination.longitude }
    })),
    trips: footprint.journeys.map((journey) => {
      const metrics = engagement.find((item) => item.tripId === journey.tripId);
      return {
        slug: journey.slug,
        title: journey.title,
        country: journey.destination,
        place: journey.destination,
        duration: `${journey.durationDays} days`,
        group: titleCaseEnum(
          journey.tripGroup
        ) as PublicProfile["trips"][number]["group"],
        styles: journey.styles.map(
          titleCaseEnum
        ) as PublicProfile["trips"][number]["styles"],
        author: apiProfile.displayName,
        authorSlug: apiProfile.slug,
        price: "",
        views: formatCount(metrics?.views ?? 0),
        likes: formatCount(metrics?.likes ?? 0),
        budgetAmount: 0,
        budgetLabel: "",
        image: {
          src:
            publicMediaUrl(journey.coverMediaId) ??
            journey.coverUrl ??
            PUBLIC_PROFILE_COVER,
          alt: `${journey.title} cover photo`
        },
        avatarTone: "teal",
        initials: apiProfile.displayName.slice(0, 2).toUpperCase()
      };
    }),
    tripCount: footprint.summary.trips,
    views: formatCount(views.views),
    likes: formatCount(engagement.reduce((sum, item) => sum + item.likes, 0))
  };

  return (
    <main id="main-content" className="public-profile-page">
      <ProfileViewRecorder slug={slug} />
      <section className="public-profile-hero" aria-labelledby="profile-title">
        <div className="container public-profile-hero-inner">
          <div className="profile-hero-card">
            <Image
              className="profile-hero-card-image"
              src={profile.coverImage}
              alt=""
              fill
              priority
              sizes="(max-width: 767px) 100vw, 1280px"
              aria-hidden="true"
            />
            <span className="profile-hero-card-overlay" aria-hidden="true" />
            <div className="profile-identity">
              <span className="profile-photo">
                <Image
                  src={profile.photoImage}
                  alt={`${profile.name} profile photo`}
                  fill
                  sizes="140px"
                />
                <small>{profile.initials}</small>
              </span>
              <div>
                <h1 id="profile-title">
                  {profile.name}
                  <ShieldCheck aria-hidden="true" size={22} />
                </h1>
                <p>
                  <MapPin aria-hidden="true" size={17} />
                  {profile.location}
                </p>
                <span>{profile.tagline}</span>
              </div>
            </div>
            <SharePageButton
              className="profile-share-button"
              title={`${profile.name} on AfterTrip`}
              text={profile.tagline}
            />
          </div>
          <div className="profile-stat-row" aria-label="Traveler stats">
            <article>
              <span>
                <Briefcase aria-hidden="true" size={23} />
              </span>
              <strong>{profile.tripCount}</strong>
              <small>Trips</small>
            </article>
            <article>
              <span>
                <CalendarDays aria-hidden="true" size={23} />
              </span>
              <strong>{profile.travelDays}</strong>
              <small>Travel days</small>
            </article>
            <article>
              <span>
                <Eye aria-hidden="true" size={23} />
              </span>
              <strong>{profile.views}</strong>
              <small>Profile views</small>
            </article>
            <article>
              <span>
                <Award aria-hidden="true" size={23} />
              </span>
              <strong>{profile.achievements}</strong>
              <small>Achievements</small>
            </article>
          </div>
        </div>
      </section>

      <section className="container public-profile-content">
        <section className="profile-footprint-card profile-map-panel">
          <div className="profile-section-heading compact">
            <div>
              <p>Travel Footprint</p>
              <h2>Places they explored</h2>
            </div>
          </div>
          <PublicProfileMap places={profile.footprint} />
          <div className="profile-place-list" aria-label="Top places">
            {profile.footprint.map((place) => (
              <span key={place.label}>
                <strong>{place.count}</strong>
                {place.label}
              </span>
            ))}
          </div>
        </section>

        <aside className="public-profile-side" aria-label="Traveler insights">
          <section className="profile-dna-card">
            <div className="profile-section-heading compact">
              <div>
                <p>Travel DNA</p>
                <h2>Their travel personality</h2>
              </div>
              <Sparkles aria-hidden="true" size={21} />
            </div>
            <div className="profile-dna-list">
              {profile.styles.map((style) => (
                <div key={style.label}>
                  <span>{style.label}</span>
                  <strong>{style.value}%</strong>
                  <i>
                    <em style={{ width: `${style.value}%` }} />
                  </i>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-travel-with-card">
            <div className="profile-section-heading compact">
              <div>
                <p>Travel With</p>
                <h2>Who they travel with most</h2>
              </div>
              <Users aria-hidden="true" size={21} />
            </div>
            <div className="profile-companion-list">
              {profile.travelWith.map((item) => (
                <article key={item.label}>
                  <Users aria-hidden="true" size={17} />
                  <span>{item.label}</span>
                  <i>
                    <em style={{ width: `${item.value}%` }} />
                  </i>
                  <strong>{item.value}%</strong>
                </article>
              ))}
            </div>
          </section>

          {profile.achievementBadges.length ? (
            <section className="profile-achievement-card">
              <div>
                <p>Achievements</p>
                <h2>Milestones unlocked</h2>
              </div>
              <div className="profile-achievement-chips">
                {profile.achievementBadges.map((badge) => (
                  <span title={badge.description} key={badge.code}>
                    <Award aria-hidden="true" size={16} />
                    {badge.title}
                  </span>
                ))}
              </div>
            </section>
          ) : null}
        </aside>

        <div className="public-profile-main">
          <div className="profile-section-heading">
            <div>
              <p>Featured journeys</p>
              <h2>{profile.name.split(" ")[0]}&apos;s journeys</h2>
            </div>
            <Link href="/explore">
              View all trips
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="profile-trip-grid">
            {profile.trips.map((trip) => (
              <Link
                className="profile-trip-card"
                href={`/trips/${trip.slug}`}
                key={trip.slug}
              >
                <span className="profile-trip-image">
                  <Image
                    src={trip.image.src}
                    alt={trip.image.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 360px"
                  />
                  <span>{trip.duration}</span>
                </span>
                <span className="profile-trip-body">
                  <strong>{trip.title}</strong>
                  <small>{trip.place}</small>
                  <span className="profile-trip-metrics">
                    <span>
                      <Eye aria-hidden="true" size={15} />
                      {trip.views}
                    </span>
                    <span>
                      <Heart aria-hidden="true" size={15} />
                      {trip.likes}
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="profile-follow-card">
            <Image
              src="/brand/aftertrip-logo-green.png"
              alt=""
              width={132}
              height={44}
              aria-hidden="true"
            />
            <p>
              Follow {profile.name.split(" ")[0]}&apos;s journeys for travel
              inspiration, hidden gems and real travel stories.
            </p>
            <Link href="/explore">
              Explore more
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
