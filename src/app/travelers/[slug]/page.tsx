import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Award,
  Briefcase,
  CalendarDays,
  Eye,
  MapPin,
  Share2,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { PublicProfileMap } from "@/components/profile/public-profile-map";
import { getPublicProfile, publicProfiles } from "@/data/public-profiles";

type TravelerProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publicProfiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: TravelerProfilePageProps) {
  const { slug } = await params;
  const profile = getPublicProfile(slug);

  return {
    title: profile ? `${profile.name} | AfterTrip` : "Traveler | AfterTrip",
    description: profile?.tagline ?? "Traveler profile on AfterTrip."
  };
}

export default async function TravelerProfilePage({
  params
}: TravelerProfilePageProps) {
  const { slug } = await params;
  const profile = getPublicProfile(slug);

  if (!profile) notFound();

  return (
    <main id="main-content" className="public-profile-page">
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
            <button className="profile-share-button" type="button">
              <Share2 aria-hidden="true" size={18} />
              Share
            </button>
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
            <div className="profile-map-tabs" aria-label="Map mode">
              <span>Places</span>
              <span>Trips</span>
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
                  <i style={{ width: `${style.value}%` }} />
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

          <section className="profile-achievement-card">
            <div>
              <p>Achievements</p>
              <h2>Milestones unlocked</h2>
            </div>
            <div className="profile-achievement-chips">
              {[
                "First Journey",
                "Mountain Explorer",
                "Nature Lover",
                "Coast Chaser",
                "10 Journeys",
                "Verified Mapper"
              ].map((badge) => (
                <span key={badge}>
                  <Award aria-hidden="true" size={16} />
                  {badge}
                </span>
              ))}
            </div>
          </section>
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
                  <span>
                    <Eye aria-hidden="true" size={15} />
                    {trip.views}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <div className="profile-follow-card">
            <Image
              src="/brand/aftertrip-mark.svg"
              alt=""
              width={38}
              height={38}
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
