import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronDown,
  CloudSun,
  Heart,
  ImageIcon,
  Info,
  MapPin,
  NotebookTabs,
  Share2,
  ShieldAlert,
  Sparkles,
  Star,
  Users,
  WalletCards
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { TripGallery } from "@/components/trip/trip-gallery";
import {
  getAllTripSlugs,
  getTripDetail,
  type DetailNote
} from "@/data/trip-details";

const factIcons = [
  MapPin,
  CalendarDays,
  Users,
  CloudSun,
  Sparkles,
  CheckCircle2
];

const noteIcons: Record<DetailNote["tone"], typeof Sparkles> = {
  green: Sparkles,
  red: ShieldAlert,
  blue: Car
};

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
  const hasNotes = Boolean(trip.notes?.length);

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
              const icons = [CalendarDays, Users, CalendarDays, WalletCards];
              const Icon = icons[index] ?? Info;
              return (
                <span key={badge}>
                  <Icon aria-hidden="true" size={16} />
                  {badge}
                </span>
              );
            })}
          </div>
          <div className="trip-hero-actions" aria-label="Trip actions">
            <button type="button">
              <Heart aria-hidden="true" size={22} />
              Save
            </button>
            <button type="button">
              <Share2 aria-hidden="true" size={22} />
              Share
            </button>
          </div>
        </div>
      </section>

      <section
        className="container trip-detail-shell"
        aria-label="Trip details"
      >
        <div className="trip-detail-main">
          <div className="trip-author-card">
            <div className="trip-author-profile">
              <Avatar
                initials={trip.initials}
                tone={trip.avatarTone}
                label={trip.author + " avatar"}
              />
              <div>
                <strong>Trip by {trip.author}</strong>
                <span>
                  <Star aria-hidden="true" size={18} fill="currentColor" />
                  {trip.rating}
                </span>
              </div>
            </div>
            <div className="trip-author-stats">
              {trip.views ? (
                <span>
                  <strong>{trip.views}</strong>Views
                </span>
              ) : null}
              {trip.saves ? (
                <span>
                  <strong>{trip.saves}</strong>Saves
                </span>
              ) : null}
              {trip.recommendation ? (
                <span>
                  <strong>{trip.recommendation}</strong>Would recommend
                </span>
              ) : null}
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
            {hasGallery ? (
              <a href="#gallery">
                <ImageIcon aria-hidden="true" size={19} />
                Gallery
              </a>
            ) : null}
            {hasNotes || trip.practicalTips?.length ? (
              <a href="#tips">
                <Sparkles aria-hidden="true" size={19} />
                Tips
              </a>
            ) : null}
            {trip.transport ? (
              <a href="#transport">
                <Car aria-hidden="true" size={19} />
                Transport
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

          {trip.spend ? (
            <section className="trip-detail-card trip-mobile-spend">
              <div className="trip-section-title-row">
                <h2>
                  <WalletCards aria-hidden="true" size={22} />
                  Approx. spend <small>(optional)</small>
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

          {hasNotes ? (
            <section
              className="trip-note-grid"
              id="tips"
              aria-label="Trip notes"
            >
              {trip.notes!.map((note) => {
                const Icon = noteIcons[note.tone];
                return (
                  <article
                    className={"trip-note-card " + note.tone}
                    key={note.title}
                  >
                    <span>
                      <Icon aria-hidden="true" size={22} />
                    </span>
                    <div>
                      <h2>
                        {note.title}{" "}
                        {note.optional ? <small>(optional)</small> : null}
                      </h2>
                      <p>{note.body}</p>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : null}

          {trip.transport ? (
            <section
              className="trip-detail-card trip-transport-card"
              id="transport"
            >
              <div>
                <span>
                  <Car aria-hidden="true" size={23} />
                </span>
                <div>
                  <h2>
                    {trip.transport.title} <small>(optional)</small>
                  </h2>
                  <p>{trip.transport.body}</p>
                </div>
              </div>
              <button type="button">View details</button>
            </section>
          ) : null}
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
                      <dd>{fact.value}</dd>
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
                Approx. spend <small>(optional)</small>
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

          {trip.practicalTips?.length ? (
            <section className="trip-side-card" id="tips-sidebar">
              <h2>
                <NotebookTabs aria-hidden="true" size={20} />
                Practical tips <small>(optional)</small>
              </h2>
              <ul>
                {trip.practicalTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
              <button type="button" className="trip-add-tip">
                Add your tips
              </button>
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
