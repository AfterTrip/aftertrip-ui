import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ImageIcon,
  Info,
  MapPin,
  NotebookTabs,
  Sparkles,
  Users,
  WalletCards
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { TripActions } from "@/components/trip/trip-actions";
import { TripGallery } from "@/components/trip/trip-gallery";
import { getAllTripSlugs, getTripDetail } from "@/data/trip-details";

const factIcons = [MapPin, CalendarDays, Users, Sparkles, WalletCards];

type TripPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllTripSlugs().map((slug) => ({ slug }));
}

export default async function TripDetailPage({ params }: TripPageProps) {
  const { slug } = await params;
  const trip = getTripDetail(slug);

  if (!trip) notFound();

  const hasGallery = Boolean(trip.gallery?.length);
  const hasGoodToKnow = Boolean(trip.goodToKnow?.length);
  const hasTravelerNotes = Boolean(trip.highlights?.length || hasGoodToKnow);
  const authorSlug = trip.author.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <main id="main-content" className="trip-detail-page">
      <section className="trip-detail-hero" aria-labelledby="trip-detail-title">
        <Image
          src={trip.heroImage.src}
          alt={trip.heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="trip-detail-hero-image"
        />
        <div className="trip-detail-hero-overlay" />
        <div className="container trip-detail-hero-inner">
          <Link className="trip-back-link" href="/explore">
            <ArrowLeft aria-hidden="true" size={18} />
            Back to all trips
          </Link>
          <p className="trip-kicker">{trip.kicker}</p>
          <h1 id="trip-detail-title">{trip.title}</h1>
          <p>{trip.summary}</p>
          <div className="trip-badges" aria-label="Trip highlights">
            {trip.badges.map((badge, index) => {
              const icons = [CalendarDays, Users, Sparkles, WalletCards];
              const Icon = icons[index] ?? Info;
              return (
                <span key={badge}>
                  <Icon aria-hidden="true" size={16} />
                  {badge}
                </span>
              );
            })}
          </div>
          <TripActions title={trip.title} />
        </div>
      </section>

      <section
        className="container trip-detail-shell"
        aria-label="Trip details"
      >
        <div className="trip-detail-main">
          <div className="trip-author-card">
            <Link
              className="trip-author-profile"
              href={`/travelers/${authorSlug}`}
            >
              <Avatar
                initials={trip.initials}
                tone={trip.avatarTone}
                label={trip.author + " avatar"}
              />
              <div>
                <strong>Trip by {trip.author}</strong>
                <span>{trip.group} journey</span>
              </div>
            </Link>
            <div className="trip-author-stats">
              <span>
                <strong>{trip.duration}</strong>Duration
              </span>
              <span>
                <strong>{trip.group}</strong>Group
              </span>
              <span>
                <strong>{trip.spend?.amount ?? trip.styles[0]}</strong>
                {trip.spend ? "Budget" : "Style"}
              </span>
            </div>
          </div>

          <nav className="trip-mobile-tabs" aria-label="Trip sections">
            <a href="#overview">
              <NotebookTabs aria-hidden="true" size={19} />
              Overview
            </a>
            <a href="#itinerary">
              <CalendarDays aria-hidden="true" size={19} />
              Itinerary
            </a>
            {hasTravelerNotes ? (
              <a href="#tips">
                <Sparkles aria-hidden="true" size={19} />
                Highlights
              </a>
            ) : null}
            {hasGallery ? (
              <a href="#gallery">
                <ImageIcon aria-hidden="true" size={19} />
                Gallery
              </a>
            ) : null}
          </nav>

          {trip.about ? (
            <section className="trip-detail-card trip-about-card" id="overview">
              <h2>
                <Image
                  src="/brand/aftertrip-mark.svg"
                  alt=""
                  width={26}
                  height={26}
                  aria-hidden="true"
                />
                <span>About this trip</span>
              </h2>
              <p>{trip.about}</p>
              <button type="button" className="trip-read-more">
                Read more <ChevronDown aria-hidden="true" size={16} />
              </button>
            </section>
          ) : null}

          {trip.itinerary?.length ? (
            <section
              className="trip-detail-card trip-itinerary-card"
              id="itinerary"
            >
              <h2>Itinerary ({trip.itinerary.length} Days)</h2>
              <ol className="trip-timeline">
                {trip.itinerary.map((item) => (
                  <li key={item.day + item.title}>
                    <span>{item.day}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {hasTravelerNotes ? (
            <section
              className="trip-note-grid trip-highlights-grid"
              id="tips"
              aria-label="Trip highlights and tips"
            >
              {trip.highlights?.length ? (
                <article className="trip-detail-card trip-note-card trip-highlight-card green">
                  <span>
                    <Sparkles aria-hidden="true" size={21} />
                  </span>
                  <div>
                    <h2>Highlights</h2>
                    <p>
                      The moments this traveler felt were worth planning around.
                    </p>
                    <div className="trip-highlight-tags">
                      {trip.highlights.map((highlight) => (
                        <span key={highlight}>{highlight}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ) : null}
              {trip.goodToKnow?.length ? (
                <article className="trip-detail-card trip-note-card trip-highlight-card blue">
                  <span>
                    <Info aria-hidden="true" size={21} />
                  </span>
                  <div>
                    <h2>Good to know</h2>
                    <ul className="trip-note-list">
                      {trip.goodToKnow.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ) : null}
            </section>
          ) : null}

          {trip.spend ? (
            <section className="trip-detail-card trip-mobile-spend">
              <div className="trip-section-title-row">
                <h2>
                  <WalletCards aria-hidden="true" size={22} />
                  Budget shared
                </h2>
                <a href="#spend">See details</a>
              </div>
              {trip.spend.label ? <p>{trip.spend.label}</p> : null}
              <div className="trip-spend-meter">
                <strong>
                  {trip.spend.amount}
                  <span>{trip.spend.unit}</span>
                </strong>
                <i />
                {trip.spend.level ? <em>{trip.spend.level}</em> : null}
              </div>
            </section>
          ) : null}

          {hasGallery ? <TripGallery images={trip.gallery!} /> : null}
        </div>

        <aside
          className="trip-detail-sidebar"
          aria-label="Additional trip details"
        >
          {trip.quickFacts?.length ? (
            <section className="trip-side-card">
              <h2>
                <Info aria-hidden="true" size={20} />
                Quick facts
              </h2>
              <dl>
                {trip.quickFacts.map((fact, index) => {
                  const Icon = factIcons[index] ?? Info;
                  return (
                    <div key={fact.label}>
                      <dt>
                        <Icon aria-hidden="true" size={18} />
                        {fact.label}
                      </dt>
                      <dd>
                        {fact.label === "Trip style" ? (
                          <span className="trip-fact-chips">
                            {trip.styles.map((style) => (
                              <span key={style}>{style}</span>
                            ))}
                          </span>
                        ) : (
                          fact.value
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ) : null}

          {trip.spend ? (
            <section className="trip-side-card" id="spend">
              <h2>
                <WalletCards aria-hidden="true" size={20} />
                Budget shared
              </h2>
              {trip.spend.label ? <p>{trip.spend.label}</p> : null}
              <strong className="trip-side-price">
                {trip.spend.amount}
                <span>{trip.spend.unit}</span>
              </strong>
              {trip.spend.note ? <p>{trip.spend.note}</p> : null}
              <button type="button">
                <ChevronDown aria-hidden="true" size={18} />
              </button>
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
