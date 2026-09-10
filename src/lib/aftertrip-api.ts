import { gatewayRequest } from "@/lib/api-client";
import { getAuthenticationSession } from "@/lib/auth-client";

export type TripStatus = "DRAFT" | "PUBLISHED";
export type TripGroup =
  | "SOLO"
  | "FRIENDS"
  | "COUPLE"
  | "FAMILY"
  | "GROUP"
  | "OTHER";
export type TripStyle =
  | "ROAD_TRIP"
  | "TREKKING"
  | "BEACH"
  | "CITY"
  | "NATURE"
  | "ADVENTURE"
  | "RELAXED"
  | "BUDGET"
  | "LUXURY"
  | "FOOD"
  | "CULTURE"
  | "MOUNTAINS"
  | "WILDLIFE"
  | "CAMPING"
  | "SPIRITUAL"
  | "NIGHTLIFE"
  | "WINTER_ESCAPE";
export type BudgetCurrency = "INR" | "USD";
export type BudgetMode = "EXACT" | "RANGE";

export type ApiDestination = {
  provider: string;
  providerPlaceId: string;
  name: string;
  displayName: string;
  locality?: string | null;
  region?: string | null;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};

export type ApiLocationSuggestion = {
  provider: string;
  providerPlaceId: string;
  name: string;
  displayName: string;
  featureType: string;
  region?: string | null;
  country: string;
  countryCode: string;
};

export type ApiResolvedLocation = ApiLocationSuggestion & {
  locality?: string | null;
  latitude: number;
  longitude: number;
};

export type ApiTrip = {
  id: string;
  ownerUserId: string;
  status: TripStatus;
  slug?: string | null;
  title?: string | null;
  destination?: ApiDestination | null;
  startDate?: string | null;
  endDate?: string | null;
  durationDays: number;
  tripGroup?: TripGroup | null;
  coverMediaId?: string | null;
  summary?: string | null;
  styles: TripStyle[];
  highlights: string[];
  goodToKnow?: string | null;
  galleryMediaIds: string[];
  itinerary: Array<{ headline?: string | null; description?: string | null }>;
  budgetMode?: BudgetMode | null;
  budgetCurrency?: BudgetCurrency | null;
  budgetAmount?: number | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  budgetCategories: Record<string, number>;
  completion: {
    basics: boolean;
    story: boolean;
    budget: boolean;
    readyToPublish: boolean;
  };
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type ApiPage<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
};

export type ApiDiscoveryTrip = {
  tripId: string;
  ownerUserId: string;
  slug: string;
  title: string;
  summary?: string | null;
  coverMediaId?: string | null;
  destination: ApiDestination;
  startDate: string;
  endDate: string;
  durationDays: number;
  tripGroup: TripGroup;
  styles: TripStyle[];
  budget?: {
    mode: BudgetMode;
    currency: BudgetCurrency;
    amount?: number | null;
    minimum?: number | null;
    maximum?: number | null;
  } | null;
  publishedAt: string;
};

export type ApiDestinationSummary = ApiDestination & {
  tripCount: number;
  coverMediaId?: string | null;
  latestPublishedAt: string;
};

export type ApiProfile = {
  userId: string;
  slug: string;
  displayName: string;
  location?: string | null;
  tagline?: string | null;
  avatarMediaId?: string | null;
  avatarUrl?: string | null;
  coverMediaId?: string | null;
  coverUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export const PROFILE_UPDATED_EVENT = "aftertrip:profile-updated";
export const COMMUNITY_RATING_UPDATED_EVENT =
  "aftertrip:community-rating-updated";

export type ApiTripEngagement = {
  tripId: string;
  views: number;
  likes: number;
  likedByMe: boolean;
};

export type ApiCommunityReview = {
  userId: string;
  authorSlug: string;
  displayName: string;
  location?: string | null;
  avatarMediaId?: string | null;
  avatarUrl?: string | null;
  rating: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type ApiTravelFootprint = {
  summary: {
    trips: number;
    travelDays: number;
    destinations: number;
    countries: number;
    achievementsUnlocked: number;
  };
  destinations: Array<ApiDestination & { trips: number }>;
  travelDna: Array<{ key: string; trips: number; percentage: number }>;
  travelWith: Array<{ key: string; trips: number; percentage: number }>;
  achievements: Array<{ code: string; title: string; description: string }>;
  journeys: Array<{
    tripId: string;
    slug: string;
    title: string;
    coverMediaId?: string | null;
    coverUrl?: string | null;
    destination: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    tripGroup: TripGroup;
    styles: TripStyle[];
  }>;
};

export type ApiMedia = {
  id: string;
  purpose: "TRIP_COVER" | "TRIP_GALLERY" | "PROFILE_AVATAR" | "PROFILE_COVER";
  mediaType: "IMAGE" | "VIDEO";
  visibility: "PRIVATE" | "PUBLIC";
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  durationMs?: number | null;
  contentUrl: string;
  createdAt: string;
};

export type TripSearch = {
  q?: string;
  destinationPlaceId?: string;
  countryCode?: string;
  tripGroups?: TripGroup[];
  styles?: TripStyle[];
  minDurationDays?: number;
  maxDurationDays?: number;
  budgetCurrency?: BudgetCurrency;
  minBudget?: number;
  maxBudget?: number;
  sort?:
    | "NEWEST"
    | "OLDEST"
    | "BUDGET_LOW_TO_HIGH"
    | "BUDGET_HIGH_TO_LOW"
    | "DURATION_SHORT_TO_LONG"
    | "DURATION_LONG_TO_SHORT";
  page?: number;
  size?: number;
};

export const publicMediaUrl = (mediaId?: string | null) =>
  mediaId ? `/api/v1/media/public/${mediaId}/content` : null;

export async function searchTrips(search: TripSearch = {}) {
  const query = queryString(search);
  return gatewayRequest<ApiPage<ApiDiscoveryTrip>>(
    `/api/v1/discovery/trips${query}`
  );
}

export async function getDestinations(size = 12) {
  return gatewayRequest<ApiPage<ApiDestinationSummary>>(
    `/api/v1/destinations?size=${size}`
  );
}

export async function getPublicTrip(slug: string) {
  return gatewayRequest<ApiTrip>(
    `/api/v1/trips/public/${encodeURIComponent(slug)}`
  );
}

export async function getPublicTripById(tripId: string) {
  return gatewayRequest<ApiTrip>(`/api/v1/trips/public/by-id/${tripId}`);
}

export async function getMyTrips(status?: TripStatus) {
  const suffix = status ? `?status=${status}&size=50` : "?size=50";
  return gatewayRequest<ApiPage<ApiTrip>>(`/api/v1/trips/mine${suffix}`, {
    authenticated: true
  });
}

export async function createTripDraft() {
  return gatewayRequest<ApiTrip>("/api/v1/trips", {
    method: "POST",
    authenticated: true
  });
}

export async function getOwnedTrip(tripId: string) {
  return gatewayRequest<ApiTrip>(`/api/v1/trips/${tripId}`, {
    authenticated: true
  });
}

export async function searchLocations(query: string, signal?: AbortSignal) {
  return gatewayRequest<ApiLocationSuggestion[]>(
    `/api/v1/locations/search?q=${encodeURIComponent(query)}&limit=6`,
    { authenticated: true, signal }
  );
}

export async function resolveLocation(
  providerPlaceId: string,
  signal?: AbortSignal
) {
  return gatewayRequest<ApiResolvedLocation>(
    `/api/v1/locations/resolve?id=${encodeURIComponent(providerPlaceId)}`,
    { authenticated: true, signal }
  );
}

export async function updateTripBasics(tripId: string, body: unknown) {
  return gatewayRequest<ApiTrip>(`/api/v1/trips/${tripId}/basics`, {
    method: "PUT",
    authenticated: true,
    body
  });
}

export async function updateTripStory(tripId: string, body: unknown) {
  return gatewayRequest<ApiTrip>(`/api/v1/trips/${tripId}/story`, {
    method: "PUT",
    authenticated: true,
    body
  });
}

export async function updateTripItinerary(tripId: string, body: unknown) {
  return gatewayRequest<ApiTrip>(`/api/v1/trips/${tripId}/itinerary`, {
    method: "PUT",
    authenticated: true,
    body
  });
}

export async function updateTripBudget(tripId: string, body: unknown) {
  return gatewayRequest<ApiTrip>(`/api/v1/trips/${tripId}/budget`, {
    method: "PUT",
    authenticated: true,
    body
  });
}

export async function publishTrip(tripId: string) {
  return gatewayRequest<ApiTrip>(`/api/v1/trips/${tripId}/publish`, {
    method: "POST",
    authenticated: true
  });
}

export async function deleteTrip(tripId: string) {
  return gatewayRequest<void>(`/api/v1/trips/${tripId}`, {
    method: "DELETE",
    authenticated: true
  });
}

export async function uploadMedia(file: File, purpose: ApiMedia["purpose"]) {
  const form = new FormData();
  form.append("file", file);
  return gatewayRequest<ApiMedia>(
    `/api/v1/media?purpose=${encodeURIComponent(purpose)}`,
    { method: "POST", authenticated: true, body: form }
  );
}

export async function loadOwnedMedia(mediaId: string) {
  return gatewayRequest<Blob>(`/api/v1/media/${mediaId}/content`, {
    authenticated: true
  });
}

export async function getOwnedMedia(mediaId: string) {
  return gatewayRequest<ApiMedia>(`/api/v1/media/${mediaId}`, {
    authenticated: true
  });
}

export async function deleteMedia(mediaId: string) {
  return gatewayRequest<void>(`/api/v1/media/${mediaId}`, {
    method: "DELETE",
    authenticated: true
  });
}

export async function getPublicMedia(mediaId: string) {
  return gatewayRequest<ApiMedia>(`/api/v1/media/public/${mediaId}`);
}

export async function getOwnProfile() {
  return gatewayRequest<ApiProfile>("/api/v1/profiles/me", {
    authenticated: true
  });
}

export async function updateOwnProfile(body: {
  displayName: string;
  location?: string | null;
  tagline?: string | null;
  avatarMediaId?: string | null;
  coverMediaId?: string | null;
}) {
  const profile = await gatewayRequest<ApiProfile>("/api/v1/profiles/me", {
    method: "PUT",
    authenticated: true,
    body
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(PROFILE_UPDATED_EVENT, { detail: profile })
    );
  }
  return profile;
}

export async function getPublicProfile(slug: string) {
  return gatewayRequest<ApiProfile>(
    `/api/v1/profiles/${encodeURIComponent(slug)}`
  );
}

export async function getProfiles(userIds: string[]) {
  if (!userIds.length) return [];
  const response = await gatewayRequest<{ content: ApiProfile[] }>(
    `/api/v1/profiles?userIds=${userIds.map(encodeURIComponent).join(",")}`
  );
  return response.content;
}

export async function getTripEngagement(tripIds: string[]) {
  if (!tripIds.length) return [];
  const response = await gatewayRequest<{ content: ApiTripEngagement[] }>(
    `/api/v1/engagement/trips?tripIds=${tripIds.map(encodeURIComponent).join(",")}`,
    { authenticated: Boolean(getAuthenticationSession()) }
  );
  return response.content;
}

export async function recordTripView(tripId: string, visitorId?: string) {
  return gatewayRequest<ApiTripEngagement>(
    `/api/v1/engagement/trips/${tripId}/views`,
    {
      method: "POST",
      body: visitorId ? { visitorId } : undefined
    }
  );
}

export async function likeTrip(tripId: string) {
  return gatewayRequest<ApiTripEngagement>(
    `/api/v1/engagement/trips/${tripId}/like`,
    {
      method: "PUT",
      authenticated: true
    }
  );
}

export async function unlikeTrip(tripId: string) {
  return gatewayRequest<ApiTripEngagement>(
    `/api/v1/engagement/trips/${tripId}/like`,
    {
      method: "DELETE",
      authenticated: true
    }
  );
}

export async function getBookmarks() {
  return gatewayRequest<ApiPage<{ tripId: string; createdAt: string }>>(
    "/api/v1/bookmarks?size=50",
    { authenticated: true }
  );
}

export async function getBookmarkStatus(tripId: string) {
  return gatewayRequest<{ tripId: string; bookmarked: boolean }>(
    `/api/v1/bookmarks/${tripId}/status`,
    { authenticated: true }
  );
}

export async function addBookmark(tripId: string) {
  return gatewayRequest<{ tripId: string; createdAt: string }>(
    `/api/v1/bookmarks/${tripId}`,
    { method: "PUT", authenticated: true }
  );
}

export async function removeBookmark(tripId: string) {
  return gatewayRequest<void>(`/api/v1/bookmarks/${tripId}`, {
    method: "DELETE",
    authenticated: true
  });
}

export async function getOwnTravelFootprint() {
  return gatewayRequest<ApiTravelFootprint>(
    "/api/v1/profiles/me/travel-footprint",
    {
      authenticated: true
    }
  );
}

export async function getPublicTravelFootprint(slug: string) {
  return gatewayRequest<ApiTravelFootprint>(
    `/api/v1/profiles/${encodeURIComponent(slug)}/travel-footprint`
  );
}

export async function getOwnProfileViews() {
  return gatewayRequest<{ slug: string; views: number }>(
    "/api/v1/profiles/me/views",
    {
      authenticated: true
    }
  );
}

export async function getPublicProfileViews(slug: string) {
  return gatewayRequest<{ slug: string; views: number }>(
    `/api/v1/profiles/${encodeURIComponent(slug)}/views`
  );
}

export async function recordProfileView(slug: string, visitorId?: string) {
  return gatewayRequest<{ slug: string; views: number }>(
    `/api/v1/profiles/${encodeURIComponent(slug)}/views`,
    { method: "POST", body: visitorId ? { visitorId } : undefined }
  );
}

export async function getCommunityReviews(page = 0, size = 12) {
  return gatewayRequest<ApiPage<ApiCommunityReview>>(
    `/api/v1/community-reviews?page=${page}&size=${size}`
  );
}

export async function getCommunityReviewSummary() {
  return gatewayRequest<{
    averageRating: number;
    reviewCount: number;
    distribution: Record<string, number>;
  }>("/api/v1/community-reviews/summary");
}

export async function getTravelerStatistics() {
  return gatewayRequest<{ registeredTravelers: number }>("/api/v1/users/stats");
}

export async function getOwnCommunityReview() {
  return gatewayRequest<ApiCommunityReview>("/api/v1/community-reviews/me", {
    authenticated: true
  });
}

export async function saveCommunityReview(rating: number, note?: string) {
  const review = await gatewayRequest<ApiCommunityReview>(
    "/api/v1/community-reviews/me",
    {
      method: "PUT",
      authenticated: true,
      body: { rating, note: note?.trim() || null }
    }
  );
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COMMUNITY_RATING_UPDATED_EVENT));
  }
  return review;
}

function queryString(search: TripSearch) {
  const params = new URLSearchParams();
  Object.entries(search).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, String(item)));
    } else {
      params.set(key, String(value));
    }
  });
  const value = params.toString();
  return value ? `?${value}` : "";
}
