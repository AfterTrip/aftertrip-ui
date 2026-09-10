import type { ExploreTrip } from "@/types/explore-trip";
import type {
  ApiDiscoveryTrip,
  ApiProfile,
  ApiTrip,
  ApiTripEngagement
} from "@/lib/aftertrip-api";
import { publicMediaUrl } from "@/lib/aftertrip-api";
import { formatCount, titleCaseEnum } from "@/lib/formatters";
import type { Trip } from "@/types/trip";

const tripImagePlaceholder = "/brand/aftertrip-mark.svg";

function formatBudgetValue(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

function formatDiscoveryBudget(trip: ApiDiscoveryTrip) {
  const budget = trip.budget;
  if (!budget) return "Budget shared in trip";
  if (budget.mode === "RANGE" && budget.minimum && budget.maximum) {
    return `${formatBudgetValue(budget.minimum, budget.currency)} - ${formatBudgetValue(budget.maximum, budget.currency)}`;
  }
  return budget.amount
    ? formatBudgetValue(budget.amount, budget.currency)
    : "Budget shared in trip";
}

function formatTripBudget(trip: ApiTrip) {
  const currency = trip.budgetCurrency ?? "INR";
  if (trip.budgetMode === "RANGE" && trip.budgetMin && trip.budgetMax) {
    return `${formatBudgetValue(trip.budgetMin, currency)} - ${formatBudgetValue(trip.budgetMax, currency)}`;
  }
  return trip.budgetAmount
    ? formatBudgetValue(trip.budgetAmount, currency)
    : "Budget shared in trip";
}

export function discoveryTripToExploreTrip(
  trip: ApiDiscoveryTrip,
  profile?: ApiProfile,
  engagement?: ApiTripEngagement
): ExploreTrip {
  const amount =
    trip.budget?.mode === "RANGE"
      ? trip.budget.minimum ?? 0
      : trip.budget?.amount ?? 0;
  const name = profile?.displayName || "AfterTrip traveler";

  return {
    slug: trip.slug,
    title: trip.title,
    country: trip.destination.country,
    place: trip.destination.displayName,
    duration: `${trip.durationDays} ${trip.durationDays === 1 ? "day" : "days"}`,
    group: titleCaseEnum(trip.tripGroup) as ExploreTrip["group"],
    styles: trip.styles.map(titleCaseEnum) as ExploreTrip["styles"],
    author: name,
    authorSlug: profile?.slug ?? "traveler",
    authorAvatarUrl:
      publicMediaUrl(profile?.avatarMediaId) ?? profile?.avatarUrl ?? null,
    price: formatDiscoveryBudget(trip),
    views: formatCount(engagement?.views ?? 0),
    likes: formatCount(engagement?.likes ?? 0),
    budgetAmount: amount,
    budgetLabel: "per person",
    image: {
      src: publicMediaUrl(trip.coverMediaId) ?? tripImagePlaceholder,
      alt: `${trip.title} cover photo`
    },
    avatarTone: "teal",
    initials: initials(name)
  };
}

export function discoveryTripToLandingTrip(
  trip: ApiDiscoveryTrip,
  profile?: ApiProfile,
  engagement?: ApiTripEngagement
): Trip {
  return {
    slug: trip.slug,
    title: trip.title,
    country: trip.destination.displayName,
    duration: `${trip.durationDays} ${trip.durationDays === 1 ? "day" : "days"}`,
    author: profile?.displayName ?? "AfterTrip traveler",
    authorInitials: initials(profile?.displayName ?? "AfterTrip traveler"),
    authorAvatarUrl:
      publicMediaUrl(profile?.avatarMediaId) ?? profile?.avatarUrl ?? null,
    rating: "",
    views: formatCount(engagement?.views ?? 0),
    likes: formatCount(engagement?.likes ?? 0),
    image: {
      src: publicMediaUrl(trip.coverMediaId) ?? tripImagePlaceholder,
      alt: `${trip.title} cover photo`
    }
  };
}

export function apiTripToExploreTrip(
  trip: ApiTrip,
  profile?: ApiProfile,
  engagement?: ApiTripEngagement
): ExploreTrip {
  const destination = trip.destination;
  const amount =
    trip.budgetMode === "RANGE" ? trip.budgetMin ?? 0 : trip.budgetAmount ?? 0;
  const name = profile?.displayName ?? "AfterTrip traveler";
  return {
    slug: trip.slug ?? trip.id,
    title: trip.title ?? "Untitled trip",
    country: destination?.country ?? "",
    place: destination?.displayName ?? "Destination",
    duration: `${trip.durationDays} ${trip.durationDays === 1 ? "day" : "days"}`,
    group: titleCaseEnum(trip.tripGroup) as ExploreTrip["group"],
    styles: trip.styles.map(titleCaseEnum) as ExploreTrip["styles"],
    author: name,
    authorSlug: profile?.slug ?? "traveler",
    authorAvatarUrl:
      publicMediaUrl(profile?.avatarMediaId) ?? profile?.avatarUrl ?? null,
    price: formatTripBudget(trip),
    views: formatCount(engagement?.views ?? 0),
    likes: formatCount(engagement?.likes ?? 0),
    budgetAmount: amount,
    budgetLabel: "per person",
    image: {
      src: publicMediaUrl(trip.coverMediaId) ?? tripImagePlaceholder,
      alt: `${trip.title ?? "Trip"} cover photo`
    },
    avatarTone: "teal",
    initials: initials(name)
  };
}

export function ownedTripImage(trip: ApiTrip) {
  return trip.status === "PUBLISHED"
    ? publicMediaUrl(trip.coverMediaId) ?? tripImagePlaceholder
    : tripImagePlaceholder;
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "AT";
}
