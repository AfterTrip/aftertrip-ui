import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Info,
  MapPin,
  Sparkles,
  Users,
  WalletCards
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { TripActions } from "@/components/trip/trip-actions";
import { TripGallery } from "@/components/trip/trip-gallery";
import { TripSectionTabs } from "@/components/trip/trip-section-tabs";
import type { TripDetail } from "@/types/trip-detail";
import {
  getProfiles,
  getPublicMedia,
  getPublicTrip,
  getPublicTripById,
  publicMediaUrl
} from "@/lib/aftertrip-api";
import { initials } from "@/lib/api-adapters";
import { titleCaseEnum } from "@/lib/formatters";
import { SITE_NAME } from "@/lib/constants";

const factIcons = [
  MapPin,
  CalendarDays,
  CalendarDays,
  Users,
  Sparkles,
  WalletCards
];

type TripPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

async function loadPublishedTrip(slugOrId: string) {
  return getPublicTrip(slugOrId).catch(() => getPublicTripById(slugOrId));
}

export async function generateMetadata({
  params
}: TripPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trip = await loadPublishedTrip(slug).catch(() => null);
  if (!trip) return { title: `Trip | ${SITE_NAME}` };

  const title = `${trip.title ?? "Traveler journey"} | ${SITE_NAME}`;
  const description =
    trip.summary ??
    `A real journey to ${trip.destination?.displayName ?? "a new place"}.`;
  const image = publicMediaUrl(trip.coverMediaId);
  return {
    title,
    description,
    alternates: { canonical: `/trips/${slug}` },
    openGraph: {
      title,
      description,
      url: `/trips/${slug}`,
      siteName: SITE_NAME,
      type: "article",
      images: image
        ? [{ url: image, alt: `${trip.title ?? "Trip"} cover photo` }]
        : []
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : []
    }
  };
}

export default async function TripDetailPage({ params }: TripPageProps) {
  const { slug } = await params;
  const tripRecord = await loadPublishedTrip(slug).catch(() => null);

  if (!tripRecord) notFound();
  const [profile, galleryMetadata] = await Promise.all([
    getProfiles([tripRecord.ownerUserId]).then((profiles) => profiles[0]),
    Promise.all(
      tripRecord.galleryMediaIds.map((mediaId) =>
        getPublicMedia(mediaId).catch(() => null)
      )
    )
  ]);
  const trip = toTripDetail(tripRecord, profile, galleryMetadata);

  const hasGallery = Boolean(trip.gallery?.length);
  const hasGoodToKnow = Boolean(trip.goodToKnow?.length);
  const hasTravelerNotes = Boolean(trip.highlights?.length || hasGoodToKnow);
  const authorSlug =
    profile?.slug ?? trip.author.toLowerCase().replace(/[^a-z0-9]+/g, "-");

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
          <TripActions
            title={trip.title}
            tripId={tripRecord.id}
            shareText={`${trip.summary} ${trip.destination}`}
          />
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
                src={trip.authorAvatarUrl}
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

          <TripSectionTabs
            hasTravelerNotes={hasTravelerNotes}
            hasGallery={hasGallery}
          />

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
              <BudgetBreakdown categories={trip.spend.categories} />
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
              <BudgetBreakdown categories={trip.spend.categories} />
            </section>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

function toTripDetail(
  trip: Awaited<ReturnType<typeof getPublicTrip>>,
  profile: Awaited<ReturnType<typeof getProfiles>>[number] | undefined,
  galleryMetadata: Array<Awaited<ReturnType<typeof getPublicMedia>> | null>
): TripDetail {
  const duration = `${trip.durationDays} ${trip.durationDays === 1 ? "Day" : "Days"}`;
  const group = titleCaseEnum(trip.tripGroup) as TripDetail["group"];
  const styles = trip.styles.map(titleCaseEnum) as TripDetail["styles"];
  const travelDates = formatTravelDates(trip.startDate, trip.endDate);
  const budgetValue =
    trip.budgetMode === "RANGE"
      ? `${formatMoney(trip.budgetMin, trip.budgetCurrency)} - ${formatMoney(trip.budgetMax, trip.budgetCurrency)}`
      : formatMoney(trip.budgetAmount, trip.budgetCurrency);
  const badges = [duration, group, travelDates, budgetValue].filter(
    Boolean
  ) as string[];

  return {
    slug: trip.slug ?? trip.id,
    title: trip.title ?? "Untitled trip",
    destination: trip.destination?.displayName ?? "Destination",
    kicker: trip.destination?.name ?? trip.destination?.country ?? "Journey",
    summary: trip.summary ?? "A real journey shared by an AfterTrip traveler.",
    heroImage: {
      src: publicMediaUrl(trip.coverMediaId) ?? "/brand/aftertrip-mark.svg",
      alt: `${trip.title ?? "Trip"} cover photo`
    },
    author: profile?.displayName ?? "AfterTrip traveler",
    initials: initials(profile?.displayName ?? "AfterTrip traveler"),
    authorAvatarUrl:
      publicMediaUrl(profile?.avatarMediaId) ?? profile?.avatarUrl ?? null,
    avatarTone: "teal",
    duration,
    travelDates,
    group,
    styles,
    badges,
    about: trip.summary ?? undefined,
    highlights: trip.highlights,
    itinerary: trip.itinerary.map((day, index) => ({
      day: `Day ${index + 1}`,
      title: day.headline ?? `Day ${index + 1}`,
      copy: day.description ?? ""
    })),
    gallery: galleryMetadata.flatMap((media) =>
      media
        ? [
            {
              src: publicMediaUrl(media.id)!,
              alt:
                media.originalFilename ||
                `${trip.title ?? "Trip"} gallery media`,
              type:
                media.mediaType === "VIDEO"
                  ? ("video" as const)
                  : ("image" as const)
            }
          ]
        : []
    ),
    quickFacts: [
      trip.destination
        ? { label: "Destination", value: trip.destination.displayName }
        : null,
      travelDates ? { label: "Travel dates", value: travelDates } : null,
      { label: "Duration", value: duration },
      trip.tripGroup ? { label: "Group", value: group } : null,
      styles.length ? { label: "Trip style", value: styles.join(", ") } : null,
      budgetValue ? { label: "Budget", value: `${budgetValue} / person` } : null
    ].filter((fact): fact is { label: string; value: string } => Boolean(fact)),
    spend: budgetValue
      ? {
          label: "Shared by traveler",
          amount: budgetValue,
          unit: "/ person",
          note: "Budget is shared by the traveler and may vary by travel dates.",
          categories: Object.entries(trip.budgetCategories)
            .filter(([, amount]) => Number(amount) > 0)
            .map(([category, amount]) => ({
              label: titleCaseEnum(category),
              amount: formatMoney(amount, trip.budgetCurrency)
            }))
        }
      : undefined,
    goodToKnow: trip.goodToKnow
      ? trip.goodToKnow
          .split(/\n+/)
          .map((note) => note.trim())
          .filter(Boolean)
      : undefined
  };
}

function BudgetBreakdown({
  categories
}: {
  categories?: Array<{ label: string; amount: string }>;
}) {
  if (!categories?.length) return null;
  return (
    <div className="trip-budget-breakdown">
      <h3>Category breakdown</h3>
      <dl>
        {categories.map((category) => (
          <div key={category.label}>
            <dt>{category.label}</dt>
            <dd>{category.amount}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function formatTravelDates(startDate?: string | null, endDate?: string | null) {
  if (!startDate || !endDate) return "";
  const format = (value: string) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(`${value}T00:00:00Z`));
  return `${format(startDate)} - ${format(endDate)}`;
}

function formatMoney(amount?: number | null, currency?: string | null) {
  if (amount === null || amount === undefined || !currency) return "";
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}
