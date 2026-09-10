"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Eye,
  Bookmark,
  Home,
  ImagePlus,
  Map,
  MapPin,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Sparkles,
  Upload,
  User,
  Users,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createTripDraft,
  deleteTrip,
  deleteMedia,
  getOwnedMedia,
  getOwnedTrip,
  loadOwnedMedia,
  publishTrip,
  resolveLocation,
  searchLocations,
  updateTripBasics,
  updateTripBudget,
  updateTripItinerary,
  updateTripStory,
  uploadMedia,
  type ApiLocationSuggestion,
  type ApiResolvedLocation,
  type ApiTrip
} from "@/lib/aftertrip-api";
import { titleCaseEnum } from "@/lib/formatters";
import { useAuthenticatedPage } from "@/lib/use-authenticated-page";
import { AccountMenu } from "@/components/layout/account-menu";
import { DeleteTripDialog } from "@/components/dashboard/delete-trip-dialog";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type StepId = "basics" | "about" | "itinerary" | "budget" | "review";
type MediaItem = {
  id: string;
  url: string;
  name: string;
  kind: "photo" | "video";
};

type ItineraryDay = {
  id: string;
  headline: string;
  description: string;
};

const contentLimits = {
  summary: 1200,
  goodToKnow: 2000,
  highlight: 160,
  itineraryHeadline: 140,
  itineraryDescription: 2000
} as const;

const sidebarItems = [
  { label: "My Trips", href: "/dashboard", icon: Home },
  { label: "Travel Footprint", href: "/dashboard/travel-footprint", icon: Map },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "Edit Profile", href: "/dashboard/edit-profile", icon: User }
];

const steps: Array<{
  id: StepId;
  title: string;
  subtitle: string;
  icon: typeof MapPin;
  optional?: boolean;
}> = [
  {
    id: "basics",
    title: "Basics",
    subtitle: "Essentials",
    icon: MapPin
  },
  {
    id: "about",
    title: "About Trip",
    subtitle: "Story & style",
    icon: Sparkles
  },
  {
    id: "itinerary",
    title: "Itinerary",
    subtitle: "Day-by-day plan",
    icon: Map,
    optional: true
  },
  {
    id: "budget",
    title: "Budget",
    subtitle: "Budget details",
    icon: CircleDollarSign
  },
  { id: "review", title: "Review", subtitle: "Final check", icon: Eye }
];

const tripGroups = [
  { label: "Solo", icon: User },
  { label: "Friends", icon: Users },
  { label: "Couple", icon: Users },
  { label: "Family", icon: Users },
  { label: "Group", icon: Users },
  { label: "Other", icon: MoreHorizontal }
];

const tripStyleOptions = [
  "Road trip",
  "Trekking",
  "Beach",
  "City",
  "Nature",
  "Adventure",
  "Relaxed",
  "Budget",
  "Luxury",
  "Food",
  "Culture",
  "Mountains",
  "Wildlife",
  "Camping",
  "Spiritual",
  "Nightlife",
  "Winter Escape"
];
const budgetRows = ["Stay", "Transport", "Food", "Activities", "Miscellaneous"];
type CreateTripPageProps = {
  tripId?: string;
};

export function CreateTripPage({ tripId }: CreateTripPageProps = {}) {
  const authenticated = useAuthenticatedPage();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<
    ApiResolvedLocation | undefined
  >();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripGroup, setTripGroup] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<MediaItem | undefined>();
  const [summary, setSummary] = useState("");
  const [selectedTripStyles, setSelectedTripStyles] = useState(new Set<string>());
  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [goodToKnow, setGoodToKnow] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | undefined>();
  const [tripPreviewOpen, setTripPreviewOpen] = useState(false);
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([
    { id: "day-1", headline: "", description: "" }
  ]);
  const [budgetMode, setBudgetMode] = useState("Exact amount");
  const [budgetCurrency, setBudgetCurrency] = useState("INR");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [budgetCategories, setBudgetCategories] = useState(
    Object.fromEntries(budgetRows.map((row) => [row, ""]))
  );
  const [autosaveStatus, setAutosaveStatus] = useState("Not saved yet");
  const [saveError, setSaveError] = useState("");
  const [activeTripId, setActiveTripId] = useState(tripId);
  const [ready, setReady] = useState(false);
  const initializationStarted = useRef(false);
  const activeTripIdRef = useRef(tripId);
  const draftCreation = useRef<Promise<string> | null>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  const currentStep = steps[stepIndex];
  const duration = useMemo(
    () => getTripDuration(startDate, endDate),
    [startDate, endDate]
  );
  const basicsComplete = Boolean(
    title.trim() &&
      selectedDestination &&
      startDate &&
      endDate &&
      duration &&
      coverPhoto &&
      tripGroup
  );
  const aboutComplete = Boolean(summary.trim() && selectedTripStyles.size > 0);
  const budgetComplete =
    budgetMode === "Exact amount"
      ? Boolean(budgetAmount.trim())
      : Boolean(budgetMin.trim() && budgetMax.trim());
  const requiredComplete = basicsComplete && aboutComplete && budgetComplete;
  const hasDraftContent = Boolean(
    title.trim() ||
      destination.trim() ||
      selectedDestination ||
      startDate ||
      endDate ||
      tripGroup ||
      coverPhoto ||
      summary.trim() ||
      selectedTripStyles.size ||
      highlights.length ||
      goodToKnow.trim() ||
      media.length ||
      itineraryDays.some(
        (day) => day.headline.trim() || day.description.trim()
      ) ||
      budgetMode !== "Exact amount" ||
      budgetCurrency !== "INR" ||
      budgetAmount.trim() ||
      budgetMin.trim() ||
      budgetMax.trim() ||
      Object.values(budgetCategories).some((value) => value.trim())
  );

  const ensureDraftExists = async () => {
    if (activeTripIdRef.current) return activeTripIdRef.current;
    if (draftCreation.current) return draftCreation.current;

    const creation = createTripDraft().then((trip) => {
      activeTripIdRef.current = trip.id;
      setActiveTripId(trip.id);
      router.replace(`/dashboard/create-trip?trip=${trip.id}`);
      return trip.id;
    });
    draftCreation.current = creation;

    try {
      return await creation;
    } finally {
      if (draftCreation.current === creation) draftCreation.current = null;
    }
  };

  const hydrateTrip = async (trip: ApiTrip) => {
    setTitle(trip.title ?? "");
    setDestination(trip.destination?.displayName ?? "");
    setSelectedDestination(
      trip.destination
        ? {
            provider: trip.destination.provider,
            providerPlaceId: trip.destination.providerPlaceId,
            name: trip.destination.name,
            displayName: trip.destination.displayName,
            featureType: "place",
            locality: trip.destination.locality,
            region: trip.destination.region,
            country: trip.destination.country,
            countryCode: trip.destination.countryCode,
            latitude: trip.destination.latitude,
            longitude: trip.destination.longitude
          }
        : undefined
    );
    setStartDate(trip.startDate ?? "");
    setEndDate(trip.endDate ?? "");
    setTripGroup(titleCaseEnum(trip.tripGroup));
    setSummary(trip.summary ?? "");
    setSelectedTripStyles(new Set(trip.styles.map(titleCaseEnum)));
    setHighlights(trip.highlights);
    setGoodToKnow(trip.goodToKnow ?? "");
    setItineraryDays(
      trip.itinerary.length
        ? trip.itinerary.map((day, index) => ({
            id: `day-${index + 1}`,
            headline: day.headline ?? "",
            description: day.description ?? ""
          }))
        : [{ id: "day-1", headline: "", description: "" }]
    );
    setBudgetMode(trip.budgetMode === "RANGE" ? "Budget range" : "Exact amount");
    setBudgetCurrency(trip.budgetCurrency ?? "INR");
    setBudgetAmount(trip.budgetAmount?.toString() ?? "");
    setBudgetMin(trip.budgetMin?.toString() ?? "");
    setBudgetMax(trip.budgetMax?.toString() ?? "");
    setBudgetCategories(
      Object.fromEntries(
        budgetRows.map((row) => [
          row,
          trip.budgetCategories[toApiEnum(row)]?.toString() ?? ""
        ])
      )
    );
    if (trip.coverMediaId) {
      const blob = await loadOwnedMedia(trip.coverMediaId);
      setCoverPhoto({
        id: trip.coverMediaId,
        url: URL.createObjectURL(blob),
        name: "Trip cover",
        kind: "photo"
      });
    }
    if (trip.galleryMediaIds.length) {
      setMedia(
        await Promise.all(
          trip.galleryMediaIds.map(async (mediaId) => {
            const [metadata, blob] = await Promise.all([
              getOwnedMedia(mediaId),
              loadOwnedMedia(mediaId)
            ]);
            return {
              id: mediaId,
              url: URL.createObjectURL(blob),
              name: metadata.originalFilename,
              kind:
                metadata.mediaType === "VIDEO"
                  ? ("video" as const)
                  : ("photo" as const)
            };
          })
        )
      );
    }
  };

  const persistStep = async (step: StepId) => {
    const persistedTripId =
      activeTripIdRef.current ??
      (hasDraftContent ? await ensureDraftExists() : undefined);
    if (!persistedTripId) return;

    if (step === "basics") {
      await updateTripBasics(persistedTripId, {
        title: title.trim() || null,
        destination: selectedDestination
          ? {
              provider: selectedDestination.provider,
              providerPlaceId: selectedDestination.providerPlaceId,
              name: selectedDestination.name,
              displayName: selectedDestination.displayName,
              locality: selectedDestination.locality ?? null,
              region: selectedDestination.region ?? null,
              country: selectedDestination.country,
              countryCode: selectedDestination.countryCode,
              latitude: selectedDestination.latitude,
              longitude: selectedDestination.longitude
            }
          : null,
        startDate: startDate || null,
        endDate: endDate || null,
        coverMediaId: coverPhoto?.id ?? null,
        tripGroup: tripGroup ? toApiEnum(tripGroup) : null
      });
    } else if (step === "about") {
      await updateTripStory(persistedTripId, {
        summary: summary.trim() || null,
        styles: [...selectedTripStyles].map(toApiEnum),
        highlights,
        goodToKnow: goodToKnow.trim() || null,
        galleryMediaIds: media.map((item) => item.id)
      });
    } else if (step === "itinerary") {
      await updateTripItinerary(persistedTripId, {
        days: itineraryDays.map(({ headline, description }) => ({
          headline,
          description
        }))
      });
    } else if (step === "budget") {
      await updateTripBudget(persistedTripId, {
        mode: budgetMode === "Budget range" ? "RANGE" : "EXACT",
        currency: budgetCurrency,
        amount:
          budgetMode === "Exact amount" && budgetAmount
            ? Number(budgetAmount)
            : null,
        minimum:
          budgetMode === "Budget range" && budgetMin ? Number(budgetMin) : null,
        maximum:
          budgetMode === "Budget range" && budgetMax ? Number(budgetMax) : null,
        categories: Object.fromEntries(
          Object.entries(budgetCategories)
            .filter(([, value]) => value)
            .map(([key, value]) => [toApiEnum(key), Number(value)])
        )
      });
    }
  };

  const queuePersist = (step: StepId) => {
    const operation = saveQueue.current
      .catch(() => undefined)
      .then(() => persistStep(step));
    saveQueue.current = operation.catch(() => undefined);
    return operation;
  };

  const showSaveError = (message = "We couldn't save your latest changes. Check your connection and try again.") => {
    setAutosaveStatus("Changes pending");
    setSaveError(message);
  };

  useEffect(() => {
    if (!authenticated || initializationStarted.current) return;
    initializationStarted.current = true;
    void (async () => {
      try {
        if (tripId) {
          activeTripIdRef.current = tripId;
          setActiveTripId(tripId);
          await hydrateTrip(await getOwnedTrip(tripId));
        }
        setReady(true);
        setAutosaveStatus(tripId ? "Autosaved" : "Not saved yet");
      } catch {
        showSaveError("We couldn't open this trip right now. Refresh the page and try again.");
      }
    })();
  }, [authenticated, router, tripId]);

  useEffect(() => {
    if (!ready || (!activeTripId && !hasDraftContent)) return;
    const timeout = window.setTimeout(() => {
      setAutosaveStatus("Saving...");
      void queuePersist(currentStep.id)
        .then(() => {
          setAutosaveStatus("Autosaved");
          setSaveError("");
        })
        .catch(() => showSaveError());
    }, 700);
    return () => window.clearTimeout(timeout);
  // Each listed field is part of the draft snapshot persisted by persistStep.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTripId,
    currentStep.id,
    ready,
    title,
    destination,
    selectedDestination,
    startDate,
    endDate,
    tripGroup,
    coverPhoto,
    summary,
    selectedTripStyles,
    highlightInput,
    highlights,
    goodToKnow,
    media,
    itineraryDays,
    budgetMode,
    budgetCurrency,
    budgetAmount,
    budgetMin,
    budgetMax,
    budgetCategories,
    hasDraftContent
  ]);

  const addHighlight = () => {
    const next = highlightInput.trim();
    if (!next) return;
    setHighlights((items) => [...items.slice(-4), next]);
    setHighlightInput("");
  };

  const addMedia = async (files: FileList | null) => {
    if (!files?.length) return;
    setAutosaveStatus("Uploading media...");
    try {
      const selected = Array.from(files).slice(0, Math.max(0, 10 - media.length));
      const uploaded = await Promise.all(
        selected.map(async (file) => {
          const result = await uploadMedia(file, "TRIP_GALLERY");
          return {
            id: result.id,
            url: URL.createObjectURL(file),
            name: file.name,
            kind: file.type.startsWith("video")
              ? ("video" as const)
              : ("photo" as const)
          };
        })
      );
      setMedia((items) => [...items, ...uploaded].slice(0, 10));
      setAutosaveStatus("Media uploaded");
      setSaveError("");
    } catch {
      showSaveError("We couldn't upload that media. Check the file and your connection, then try again.");
    }
  };

  const removeMedia = (id: string) => {
    setMedia((items) => {
      const removed = items.find((item) => item.id === id);
      if (removed?.url.startsWith("blob:")) URL.revokeObjectURL(removed.url);
      return items.filter((item) => item.id !== id);
    });
    setPreviewMedia((item) => (item?.id === id ? undefined : item));
    void deleteMedia(id).catch(() => undefined);
  };

  const addCoverPhoto = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image")) return;
    setAutosaveStatus("Uploading cover...");
    try {
      const uploaded = await uploadMedia(file, "TRIP_COVER");
      setCoverPhoto({
        id: uploaded.id,
        url: URL.createObjectURL(file),
        name: file.name,
        kind: "photo"
      });
      setAutosaveStatus("Cover uploaded");
      setSaveError("");
    } catch {
      showSaveError("We couldn't upload that cover photo. Check the file and try again.");
    }
  };

  const goNext = async () => {
    if (!activeTripIdRef.current && !hasDraftContent) {
      setAutosaveStatus("Not saved yet");
      setStepIndex((index) => Math.min(index + 1, steps.length - 1));
      return;
    }
    setAutosaveStatus("Saving...");
    try {
      await queuePersist(currentStep.id);
      setAutosaveStatus("Autosaved");
      setSaveError("");
      setStepIndex((index) => Math.min(index + 1, steps.length - 1));
    } catch {
      showSaveError("We couldn't save this section. Your entries are still here, so please try again.");
    }
  };
  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0));
  const jumpTo = (index: number) => setStepIndex(index);

  return (
    <main id="main-content" className="dashboard-page create-trip-page">
      <DashboardTopbar />
      <div className="dashboard-shell create-trip-shell">
        <CreateTripSidebar />
        <section
          className="dashboard-content create-trip-content"
          aria-labelledby="create-trip-title"
        >
          <div className="create-trip-heading">
            <Link href="/dashboard" aria-label="Back to dashboard">
              <ArrowLeft aria-hidden="true" size={24} />
            </Link>
            <div>
              <h1 id="create-trip-title">Create Trip</h1>
              <p>Share your journey. Inspire others.</p>
            </div>
            <div className="create-heading-actions">
              <p className="autosave-status" aria-live="polite">
                <Check aria-hidden="true" size={18} />
                {autosaveStatus}
              </p>
              <button
                className="create-preview-trip"
                type="button"
                onClick={() => setTripPreviewOpen(true)}
              >
                <Eye aria-hidden="true" size={17} />
                Preview
              </button>
              {activeTripId ? (
                <DeleteTripDialog
                  className="create-delete-trip"
                  showLabel
                  tripTitle={title || "Untitled trip"}
                  onDelete={async () => {
                    setReady(false);
                    await deleteTrip(activeTripId);
                    router.replace("/dashboard");
                  }}
                />
              ) : null}
            </div>
          </div>

          <nav className="create-stepper" aria-label="Trip creation steps">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === stepIndex;
              const stepComplete =
                step.id === "basics"
                  ? basicsComplete
                  : step.id === "about"
                    ? aboutComplete
                    : step.id === "budget"
                      ? budgetComplete
                      : true;
              const isDone = index < stepIndex && stepComplete;
              const isIncomplete = index < stepIndex && !stepComplete;
              return (
                <button
                  key={step.id}
                  type="button"
                  className={
                    isActive
                      ? "active"
                      : isDone
                        ? "done"
                        : isIncomplete
                          ? "incomplete"
                          : undefined
                  }
                  onClick={() => jumpTo(index)}
                  aria-current={isActive ? "step" : undefined}
                  data-step={String(index + 1)}
                >
                  <span>
                    {isDone ? (
                      <Check aria-hidden="true" size={19} />
                    ) : (
                      <Icon aria-hidden="true" size={19} />
                    )}
                  </span>
                  <strong>
                    {index + 1}. {step.title}
                  </strong>
                  <small>{step.subtitle}</small>
                </button>
              );
            })}
          </nav>

          <form
            className="create-step-card"
            onSubmit={(event) => {
              event.preventDefault();
              void goNext();
            }}
          >
            {currentStep.id === "basics" ? (
              <BasicsStep
                title={title}
                setTitle={setTitle}
                destination={destination}
                setDestination={setDestination}
                selectedDestination={selectedDestination}
                setSelectedDestination={setSelectedDestination}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                duration={duration}
                tripGroup={tripGroup}
                setTripGroup={setTripGroup}
                addCoverPhoto={addCoverPhoto}
                coverPhoto={coverPhoto}
              />
            ) : null}
            {currentStep.id === "about" ? (
              <AboutStep
                summary={summary}
                setSummary={setSummary}
                selectedTripStyles={selectedTripStyles}
                setSelectedTripStyles={setSelectedTripStyles}
                highlightInput={highlightInput}
                setHighlightInput={setHighlightInput}
                highlights={highlights}
                goodToKnow={goodToKnow}
                setGoodToKnow={setGoodToKnow}
                addHighlight={addHighlight}
                setHighlights={setHighlights}
                addMedia={addMedia}
                media={media}
                removeMedia={removeMedia}
                setPreviewMedia={setPreviewMedia}
              />
            ) : null}
            {currentStep.id === "itinerary" ? (
              <ItineraryStep days={itineraryDays} setDays={setItineraryDays} />
            ) : null}
            {currentStep.id === "budget" ? (
              <BudgetStep
                budgetMode={budgetMode}
                setBudgetMode={setBudgetMode}
                budgetCurrency={budgetCurrency}
                setBudgetCurrency={setBudgetCurrency}
                budgetAmount={budgetAmount}
                setBudgetAmount={setBudgetAmount}
                budgetMin={budgetMin}
                setBudgetMin={setBudgetMin}
                budgetMax={budgetMax}
                setBudgetMax={setBudgetMax}
                budgetCategories={budgetCategories}
                setBudgetCategories={setBudgetCategories}
              />
            ) : null}
            {currentStep.id === "review" ? (
              <ReviewStep
                title={title}
                destination={selectedDestination?.displayName || destination}
                duration={duration}
                coverPhoto={coverPhoto}
                highlights={highlights}
                basicsComplete={basicsComplete}
                aboutComplete={aboutComplete}
                budgetComplete={budgetComplete}
              />
            ) : null}

            <div className="create-actions">
              {stepIndex > 0 ? (
                <button type="button" className="ghost" onClick={goBack}>
                  Back
                </button>
              ) : (
                <span />
              )}
              <div>
                {currentStep.optional && currentStep.id !== "review" ? (
                  <button type="button" className="ghost" onClick={() => void goNext()}>
                    Skip for now
                  </button>
                ) : null}
                {currentStep.id === "review" ? (
                  <button
                    type="button"
                    className="primary"
                    disabled={!requiredComplete}
                    title={
                      requiredComplete
                        ? "Publish trip"
                        : "Complete all required sections before publishing"
                    }
                    onClick={async () => {
                      if (!activeTripId) return;
                      setAutosaveStatus("Publishing...");
                      try {
                        const published = await publishTrip(activeTripId);
                        router.push(`/trips/${published.slug}`);
                      } catch {
                        showSaveError("We couldn't publish this trip right now. Please try again.");
                      }
                    }}
                  >
                    <Sparkles aria-hidden="true" size={19} />
                    Publish Trip
                  </button>
                ) : (
                  <button type="submit" className="primary">
                    Continue
                    <ArrowRight aria-hidden="true" size={20} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>
      </div>
      {saveError ? (
        <aside className="create-save-alert" role="alert" aria-live="assertive">
          <AlertCircle aria-hidden="true" size={21} />
          <div>
            <strong>Your changes need attention</strong>
            <p>{saveError}</p>
          </div>
          <button type="button" onClick={() => setSaveError("")} aria-label="Dismiss save message">
            <X aria-hidden="true" size={18} />
          </button>
        </aside>
      ) : null}
      <MediaLightbox
        item={previewMedia}
        onClose={() => setPreviewMedia(undefined)}
      />
      <TripDraftPreview
        open={tripPreviewOpen}
        onClose={() => setTripPreviewOpen(false)}
        title={title}
        destination={selectedDestination?.displayName || destination}
        duration={duration}
        tripGroup={tripGroup}
        coverPhoto={coverPhoto}
        summary={summary}
        styles={[...selectedTripStyles]}
        highlights={highlights}
        goodToKnow={goodToKnow}
        media={media}
        itineraryDays={itineraryDays}
        budgetMode={budgetMode}
        budgetCurrency={budgetCurrency}
        budgetAmount={budgetAmount}
        budgetMin={budgetMin}
        budgetMax={budgetMax}
        budgetCategories={budgetCategories}
      />
    </main>
  );
}

function DashboardTopbar() {
  return (
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
      <nav className="dashboard-desktop-nav" aria-label="Dashboard navigation">
        <Link href="/explore">Explore</Link>
        <Link href="/#reviews">Reviews</Link>
        <Link href="/#how-it-works">How it works</Link>
      </nav>
      <div className="dashboard-top-actions">
        <ThemeToggle />
        <AccountMenu variant="dashboard" />
      </div>
      <div className="dashboard-mobile-actions">
        <ThemeToggle />
        <AccountMenu variant="dashboard" />
      </div>
    </header>
  );
}

function CreateTripSidebar() {
  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard sections">
      <nav className="dashboard-side-nav">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.label}>
              <Icon aria-hidden="true" size={22} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function MediaPreview({
  item,
  fallback,
  alt,
  sizes
}: {
  item?: MediaItem;
  fallback: string;
  alt: string;
  sizes: string;
}) {
  const src = item?.url || fallback;

  if (item?.kind === "video") {
    return <video src={src} muted playsInline preload="metadata" />;
  }

  if (src.startsWith("blob:")) {
    return (
      <span
        className="native-photo-preview"
        style={{ backgroundImage: "url(" + src + ")" }}
        role="img"
        aria-label={alt}
      />
    );
  }

  return <Image src={src} alt={alt} fill sizes={sizes} />;
}

function MediaLightbox({
  item,
  onClose
}: {
  item?: MediaItem;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <div
      className="gallery-lightbox create-media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Uploaded media preview"
    >
      <button
        className="gallery-lightbox-backdrop"
        type="button"
        aria-label="Dismiss media preview"
        onClick={onClose}
      />
      <div className="gallery-lightbox-panel">
        <div className="gallery-lightbox-topbar">
          <p>
            <span>{item.kind === "video" ? "Video" : "Photo"}</span>
            {item.name}
          </p>
          <button
            className="gallery-close"
            type="button"
            aria-label="Close media preview"
            onClick={onClose}
          >
            <X aria-hidden="true" size={24} />
          </button>
        </div>
        <figure>
          {item.kind === "video" ? (
            <video src={item.url} controls autoPlay playsInline />
          ) : item.url.startsWith("blob:") ? (
            <span
              className="native-media-lightbox-image"
              style={{ backgroundImage: "url(" + item.url + ")" }}
              role="img"
              aria-label={item.name}
            />
          ) : (
            <Image src={item.url} alt={item.name} fill sizes="100vw" priority />
          )}
        </figure>
      </div>
    </div>
  );
}

function TripDraftPreview({
  open,
  onClose,
  title,
  destination,
  duration,
  tripGroup,
  coverPhoto,
  summary,
  styles,
  highlights,
  goodToKnow,
  media,
  itineraryDays,
  budgetMode,
  budgetCurrency,
  budgetAmount,
  budgetMin,
  budgetMax,
  budgetCategories
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  destination: string;
  duration: string;
  tripGroup: string;
  coverPhoto?: MediaItem;
  summary: string;
  styles: string[];
  highlights: string[];
  goodToKnow: string;
  media: MediaItem[];
  itineraryDays: ItineraryDay[];
  budgetMode: string;
  budgetCurrency: string;
  budgetAmount: string;
  budgetMin: string;
  budgetMax: string;
  budgetCategories: Record<string, string>;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  if (!open) return null;

  const completedDays = itineraryDays.filter(
    (day) => day.headline.trim() || day.description.trim()
  );
  const categoryRows = Object.entries(budgetCategories).filter(
    ([, value]) => value.trim()
  );
  const formatMoney = (value: string) => {
    const amount = Number(value);
    if (!value || !Number.isFinite(amount)) return "";
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: budgetCurrency,
      maximumFractionDigits: 0
    }).format(amount);
  };
  const budgetLabel =
    budgetMode === "Budget range"
      ? [formatMoney(budgetMin), formatMoney(budgetMax)].filter(Boolean).join(" - ")
      : formatMoney(budgetAmount);

  return (
    <div
      className="trip-draft-preview-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-draft-preview-title"
    >
      <button
        className="trip-draft-preview-backdrop"
        type="button"
        onClick={onClose}
        aria-label="Close trip preview"
      />
      <section className="trip-draft-preview-dialog">
        <header className="trip-draft-preview-toolbar">
          <div>
            <Eye aria-hidden="true" size={18} />
            <span>
              <strong>Traveler preview</strong>
              <small>Only you can see this draft</small>
            </span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close trip preview">
            <X aria-hidden="true" size={21} />
          </button>
        </header>

        <div className="trip-draft-preview-scroll">
          <section className="trip-draft-preview-hero">
            <MediaPreview
              item={coverPhoto}
              fallback="/images/hero/mountain-lake-traveler.png"
              alt="Trip cover preview"
              sizes="1100px"
            />
            <span className="trip-draft-preview-shade" aria-hidden="true" />
            <div>
              <small>{destination || "Destination not added yet"}</small>
              <h2 id="trip-draft-preview-title">{title || "Your trip title"}</h2>
              {summary.trim() ? <p>{summary}</p> : null}
              <nav aria-label="Draft trip essentials">
                {duration ? <span><CalendarDays aria-hidden="true" size={15} />{duration}</span> : null}
                {tripGroup ? <span><Users aria-hidden="true" size={15} />{tripGroup}</span> : null}
                {budgetLabel ? <span><CircleDollarSign aria-hidden="true" size={15} />{budgetLabel} / person</span> : null}
              </nav>
            </div>
          </section>

          <div className="trip-draft-preview-content">
            <div className="trip-draft-preview-primary">
              {summary.trim() ? (
                <section className="trip-draft-preview-section">
                  <p className="trip-draft-preview-eyebrow">About this trip</p>
                  <p>{summary}</p>
                  {styles.length ? (
                    <div className="trip-draft-preview-chips">
                      {styles.map((style) => <span key={style}>{style}</span>)}
                    </div>
                  ) : null}
                </section>
              ) : null}

              {completedDays.length ? (
                <section className="trip-draft-preview-section">
                  <p className="trip-draft-preview-eyebrow">Itinerary</p>
                  <div className="trip-draft-preview-itinerary">
                    {completedDays.map((day, index) => (
                      <article key={day.id}>
                        <span>Day {index + 1}</span>
                        <div>
                          <strong>{day.headline || "A day on the journey"}</strong>
                          {day.description ? <p>{day.description}</p> : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {highlights.length || goodToKnow.trim() ? (
                <section className="trip-draft-preview-section">
                  <p className="trip-draft-preview-eyebrow">Traveler notes</p>
                  {highlights.length ? (
                    <div className="trip-draft-preview-highlights">
                      {highlights.map((highlight) => (
                        <span key={highlight}><Check aria-hidden="true" size={15} />{highlight}</span>
                      ))}
                    </div>
                  ) : null}
                  {goodToKnow.trim() ? (
                    <div className="trip-draft-preview-note">
                      <strong>Good to know</strong>
                      <p>{goodToKnow}</p>
                    </div>
                  ) : null}
                </section>
              ) : null}

              {media.length ? (
                <section className="trip-draft-preview-section">
                  <p className="trip-draft-preview-eyebrow">Photos and videos</p>
                  <div className="trip-draft-preview-media">
                    {media.slice(0, 6).map((item) => (
                      <figure key={item.id}>
                        <MediaPreview item={item} fallback="" alt={item.name} sizes="240px" />
                        {item.kind === "video" ? <Play aria-hidden="true" size={22} /> : null}
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <aside>
              <section className="trip-draft-preview-section">
                <p className="trip-draft-preview-eyebrow">Quick facts</p>
                <dl>
                  <div><dt>Destination</dt><dd>{destination || "Not added"}</dd></div>
                  <div><dt>Duration</dt><dd>{duration || "Not added"}</dd></div>
                  <div><dt>Trip group</dt><dd>{tripGroup || "Not added"}</dd></div>
                  {styles.length ? <div><dt>Style</dt><dd>{styles.join(", ")}</dd></div> : null}
                </dl>
              </section>
              {budgetLabel ? (
                <section className="trip-draft-preview-section">
                  <p className="trip-draft-preview-eyebrow">Budget per person</p>
                  <strong className="trip-draft-preview-budget">{budgetLabel}</strong>
                  {categoryRows.length ? (
                    <dl className="trip-draft-preview-breakdown">
                      {categoryRows.map(([label, value]) => (
                        <div key={label}><dt>{label}</dt><dd>{formatMoney(value)}</dd></div>
                      ))}
                    </dl>
                  ) : null}
                </section>
              ) : null}
            </aside>
          </div>

          {!summary.trim() && !completedDays.length && !media.length ? (
            <div className="trip-draft-preview-empty">
              <Sparkles aria-hidden="true" size={22} />
              <strong>Your journey is taking shape</strong>
              <p>Add your story, itinerary, or media and it will appear here instantly.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function getTripDuration(startDate: string, endDate: string) {
  if (!startDate || !endDate) return "";
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  if (end < start) return "";
  const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  return days === 1 ? "1 day" : days + " days";
}

function numericOnly(value: string) {
  return value.replace(/\D/g, "");
}

function toApiEnum(value: string) {
  return value.trim().toUpperCase().replaceAll(" ", "_");
}

function getTodayInputDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function clampPastDate(value: string, maxDate: string) {
  if (!value) return "";
  return value > maxDate ? maxDate : value;
}

function BasicsStep({
  title,
  setTitle,
  destination,
  setDestination,
  selectedDestination,
  setSelectedDestination,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  duration,
  tripGroup,
  setTripGroup,
  addCoverPhoto,
  coverPhoto
}: {
  title: string;
  setTitle: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  selectedDestination?: ApiResolvedLocation;
  setSelectedDestination: (value: ApiResolvedLocation | undefined) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  duration: string;
  tripGroup: string;
  setTripGroup: (value: string) => void;
  addCoverPhoto: (files: FileList | null) => void;
  coverPhoto?: MediaItem;
}) {
  const todayDate = getTodayInputDate();
  const [destinationOptions, setDestinationOptions] = useState<ApiLocationSuggestion[]>([]);
  const [searchingDestination, setSearchingDestination] = useState(false);
  const [resolvingDestination, setResolvingDestination] = useState("");
  const [destinationError, setDestinationError] = useState("");

  useEffect(() => {
    const query = destination.trim();
    if (selectedDestination || query.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setSearchingDestination(true);
      setDestinationError("");
      searchLocations(query, controller.signal)
        .then(setDestinationOptions)
        .catch((error) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setDestinationOptions([]);
          setDestinationError(
            error instanceof Error ? error.message : "Could not search locations."
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearchingDestination(false);
        });
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [destination, selectedDestination]);

  const chooseDestination = async (suggestion: ApiLocationSuggestion) => {
    setResolvingDestination(suggestion.providerPlaceId);
    setDestinationError("");
    try {
      const resolved = await resolveLocation(suggestion.providerPlaceId);
      setSelectedDestination(resolved);
      setDestination(resolved.displayName);
      setDestinationOptions([]);
    } catch (error) {
      setDestinationError(
        error instanceof Error ? error.message : "Could not verify that location."
      );
    } finally {
      setResolvingDestination("");
    }
  };
  const updateStartDate = (value: string) => {
    const nextDate = clampPastDate(value, todayDate);
    setStartDate(nextDate);
    if (endDate && nextDate && endDate < nextDate) {
      setEndDate("");
    }
  };
  const updateEndDate = (value: string) => {
    const nextDate = clampPastDate(value, todayDate);
    setEndDate(startDate && nextDate < startDate ? "" : nextDate);
  };

  return (
    <div className="create-basics-grid">
      <section>
        <h2>Let&apos;s start with the basics</h2>
        <p>
          All basics are required before publishing, but you can fill them in
          any order.
        </p>
        <label>
          Trip Title *
          <span>
            <input
              value={title}
              maxLength={80}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Magical Meghalaya Escape"
              aria-required="true"
            />{" "}
            <small>{title.length} / 80</small>
          </span>
        </label>
        <label className="destination-picker">
          Destination *
          <span className="verified-place-field">
            <input
              value={destination}
              onChange={(event) => {
                const nextDestination = event.target.value;
                setDestination(nextDestination);
                setSelectedDestination(undefined);
                setDestinationOptions([]);
                setSearchingDestination(nextDestination.trim().length >= 2);
                setDestinationError("");
              }}
              placeholder="Search and select a real place"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="destination-results"
              aria-expanded={Boolean(destinationOptions.length || searchingDestination || destinationError)}
              aria-required="true"
              aria-invalid={Boolean(destination && !selectedDestination)}
            />
            <MapPin aria-hidden="true" size={20} />
          </span>
          <em>
            {selectedDestination
              ? `Verified location • ${selectedDestination.latitude.toFixed(4)}, ${selectedDestination.longitude.toFixed(4)}`
              : destination.trim().length < 2
                ? "Type at least 2 characters, then select a verified result."
                : "Select a result. Free-typed locations cannot be published."}
          </em>
          {destination.trim().length >= 2 && !selectedDestination ? (
            <div className="verified-place-results" id="destination-results" role="listbox">
              {searchingDestination ? (
                <p className="location-search-status">Searching locations...</p>
              ) : destinationError ? (
                <p className="location-search-error" role="alert">{destinationError}</p>
              ) : destinationOptions.length ? (
                destinationOptions.map((place) => (
                  <button
                    type="button"
                    role="option"
                    aria-selected="false"
                    disabled={Boolean(resolvingDestination)}
                    onClick={() => void chooseDestination(place)}
                    key={place.providerPlaceId}
                  >
                    <MapPin aria-hidden="true" size={17} />
                    <span>
                      <strong>{place.displayName}</strong>
                      <small>
                        {resolvingDestination === place.providerPlaceId
                          ? "Verifying location..."
                          : `${place.featureType.replaceAll("_", " ")} • ${place.countryCode}`}
                      </small>
                    </span>
                  </button>
                ))
              ) : destination.trim().length >= 2 ? (
                <p>
                  No matching location found. Try a city, region, country, or full address.
                </p>
              ) : null}
              <small className="mapbox-attribution">Powered by Mapbox</small>
            </div>
          ) : null}
        </label>
        <div className="two-fields travel-date-fields">
          <label>
            Start date *
            <span>
              <CalendarDays aria-hidden="true" size={18} />
              <input
                type="date"
                value={startDate}
                max={todayDate}
                onChange={(event) => updateStartDate(event.target.value)}
                aria-required="true"
              />
            </span>
          </label>
          <label>
            End date *
            <span>
              <CalendarDays aria-hidden="true" size={18} />
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                max={todayDate}
                onChange={(event) => updateEndDate(event.target.value)}
                aria-required="true"
              />
            </span>
          </label>
        </div>
        <label className="duration-display">
          Duration *
          <span className={duration ? undefined : "empty"} aria-live="polite">
            <strong>{duration}</strong>
          </span>
        </label>
      </section>
      <section className="cover-upload">
        <h2>Cover photo *</h2>
        <p>Choose one clear photo that represents the trip.</p>
        <div>
          <label>
            <ImagePlus aria-hidden="true" size={26} />
            <strong>Upload photo</strong>
            <small>JPG, PNG or WEBP up to 10MB</small>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => addCoverPhoto(event.target.files)}
              aria-required="true"
            />
          </label>
          <article className={coverPhoto ? undefined : "empty-cover-preview"}>
            {coverPhoto ? (
              <MediaPreview
                item={coverPhoto}
                fallback="/brand/aftertrip-mark.svg"
                alt="Cover preview"
                sizes="360px"
              />
            ) : (
              <div>
                <ImagePlus aria-hidden="true" size={28} />
                <strong>No cover selected</strong>
              </div>
            )}
            <label className="cover-change-button">
              <Pencil aria-hidden="true" size={17} />
              Change
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => addCoverPhoto(event.target.files)}
                aria-label="Change cover photo"
              />
            </label>
          </article>
        </div>
      </section>
      <section className="create-chip-section trip-group-section">
        <h2>Trip group *</h2>
        <p>Who did you travel with?</p>
        <div>
          {tripGroups.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                className={tripGroup === item.label ? "selected" : undefined}
                key={item.label}
                onClick={() => setTripGroup(item.label)}
                aria-pressed={tripGroup === item.label}
              >
                <Icon aria-hidden="true" size={18} />
                {item.label}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AboutStep({
  summary,
  setSummary,
  selectedTripStyles,
  setSelectedTripStyles,
  highlightInput,
  setHighlightInput,
  highlights,
  goodToKnow,
  setGoodToKnow,
  addHighlight,
  setHighlights,
  addMedia,
  removeMedia,
  setPreviewMedia,
  media
}: {
  summary: string;
  setSummary: (value: string) => void;
  selectedTripStyles: Set<string>;
  setSelectedTripStyles: (value: Set<string>) => void;
  highlightInput: string;
  setHighlightInput: (value: string) => void;
  highlights: string[];
  goodToKnow: string;
  setGoodToKnow: (value: string) => void;
  addHighlight: () => void;
  setHighlights: (value: string[]) => void;
  addMedia: (files: FileList | null) => void;
  removeMedia: (id: string) => void;
  setPreviewMedia: (item: MediaItem) => void;
  media: MediaItem[];
}) {
  const toggle = (label: string) => {
    const next = new Set(selectedTripStyles);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    setSelectedTripStyles(next);
  };
  return (
    <div className="create-two-column">
      <section>
        <h2>Tell people what this trip felt like</h2>
        <p>Add a short summary and pick at least one trip style.</p>
        <label>
          Trip summary *
          <textarea
            value={summary}
            maxLength={contentLimits.summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Share a short intro about your trip..."
            aria-required="true"
          />
          <small>{summary.length} / {contentLimits.summary}</small>
        </label>
        <div className="create-chip-section trip-style-section">
          <h3>Trip style *</h3>
          <p>What kind of experience was this?</p>
          <div>
            {tripStyleOptions.map((label) => (
              <button
                type="button"
                className={
                  selectedTripStyles.has(label) ? "selected" : undefined
                }
                key={label}
                onClick={() => toggle(label)}
                aria-pressed={selectedTripStyles.has(label)}
              >
                <Sparkles aria-hidden="true" size={17} />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="highlight-builder">
          <h3>Top highlights (optional)</h3>
          <div>
            <input
              value={highlightInput}
              maxLength={contentLimits.highlight}
              onChange={(event) => setHighlightInput(event.target.value)}
              placeholder="e.g. Sunrise at Tiger's Nest"
            />
            <button type="button" onClick={addHighlight}>
              Add
            </button>
          </div>
          <p>
            {highlights.map((item) => (
              <span key={item}>
                {item}
                <button
                  type="button"
                  onClick={() =>
                    setHighlights(
                      highlights.filter((highlight) => highlight !== item)
                    )
                  }
                >
                  <X aria-hidden="true" size={13} />
                </button>
              </span>
            ))}
          </p>
        </div>
      </section>
      <aside>
        <section className="good-to-know-card">
          <h2>Good to know (optional)</h2>
          <textarea
            value={goodToKnow}
            onChange={(event) => setGoodToKnow(event.target.value)}
            placeholder="Best season, permits, local tips..."
            maxLength={contentLimits.goodToKnow}
          />
          <small>{goodToKnow.length} / {contentLimits.goodToKnow}</small>
        </section>
        <section className="media-upload-panel">
          <h2>Share photos & videos (optional)</h2>
          <p>Add the best few. Videos make the trip feel alive.</p>
          <div className="media-strip">
            <label>
              <Upload aria-hidden="true" size={22} />
              Upload
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(event) => {
                  addMedia(event.target.files);
                  event.currentTarget.value = "";
                }}
              />
            </label>
            {media.slice(0, 6).map((item) => (
              <article key={item.id}>
                <button
                  className="media-preview-trigger"
                  type="button"
                  aria-label={"Preview " + item.name}
                  onClick={() => setPreviewMedia(item)}
                >
                  <MediaPreview
                    item={item}
                    fallback="/brand/aftertrip-mark.svg"
                    alt={item.name}
                    sizes="90px"
                  />
                  {item.kind === "video" ? (
                    <Play aria-hidden="true" size={18} />
                  ) : null}
                </button>
                <button
                  className="media-remove-button"
                  type="button"
                  aria-label={"Remove " + item.name}
                  onClick={() => removeMedia(item.id)}
                >
                  <X aria-hidden="true" size={14} />
                </button>
              </article>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function ItineraryStep({
  days,
  setDays
}: {
  days: ItineraryDay[];
  setDays: (value: ItineraryDay[]) => void;
}) {
  const updateDay = (
    id: string,
    field: "headline" | "description",
    value: string
  ) => {
    setDays(
      days.map((day) => (day.id === id ? { ...day, [field]: value } : day))
    );
  };

  const addDay = () => {
    setDays([
      ...days,
      { id: "day-" + Date.now(), headline: "", description: "" }
    ]);
  };

  const removeDay = (id: string) => {
    setDays(days.length === 1 ? days : days.filter((day) => day.id !== id));
  };

  return (
    <section className="itinerary-builder">
      <div>
        <h2>Day-by-day itinerary (optional)</h2>
        <p>Add a simple headline and short note for each day.</p>
      </div>
      <div className="itinerary-day-list">
        {days.map((day, index) => (
          <article key={day.id}>
            <span>Day {index + 1}</span>
            <div>
              <label>
                Headline (optional)
                <input
                  value={day.headline}
                  onChange={(event) =>
                    updateDay(day.id, "headline", event.target.value)
                  }
                  placeholder="e.g. Shillong to Cherrapunji"
                  maxLength={contentLimits.itineraryHeadline}
                />
              </label>
              <label>
                Description (optional)
                <textarea
                  value={day.description}
                  onChange={(event) =>
                    updateDay(day.id, "description", event.target.value)
                  }
                  placeholder="What happened this day? Add the route, moments, tips, or places you loved."
                  maxLength={contentLimits.itineraryDescription}
                />
                <small>
                  {day.description.length} / {contentLimits.itineraryDescription}
                </small>
              </label>
            </div>
            {days.length > 1 ? (
              <button
                type="button"
                aria-label={"Remove day " + (index + 1)}
                onClick={() => removeDay(day.id)}
              >
                <X aria-hidden="true" size={17} />
              </button>
            ) : null}
          </article>
        ))}
      </div>
      <button className="add-itinerary-day" type="button" onClick={addDay}>
        <Plus aria-hidden="true" size={17} />
        Add another day
      </button>
    </section>
  );
}

function BudgetStep({
  budgetMode,
  setBudgetMode,
  budgetCurrency,
  setBudgetCurrency,
  budgetAmount,
  setBudgetAmount,
  budgetMin,
  setBudgetMin,
  budgetMax,
  setBudgetMax,
  budgetCategories,
  setBudgetCategories
}: {
  budgetMode: string;
  setBudgetMode: (value: string) => void;
  budgetCurrency: string;
  setBudgetCurrency: (value: string) => void;
  budgetAmount: string;
  setBudgetAmount: (value: string) => void;
  budgetMin: string;
  setBudgetMin: (value: string) => void;
  budgetMax: string;
  setBudgetMax: (value: string) => void;
  budgetCategories: Record<string, string>;
  setBudgetCategories: (value: Record<string, string>) => void;
}) {
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const updateCategory = (row: string, value: string) => {
    setBudgetCategories({ ...budgetCategories, [row]: value });
  };

  return (
    <section className="budget-form">
      <div>
        <h2>Budget</h2>
        <p>
          Add either an exact amount or a range. All budget values are per
          person.
        </p>
      </div>
      <div className="budget-top-row">
        <div
          className="segmented budget-mode-toggle"
          aria-label="Budget entry type"
        >
          <button
            type="button"
            className={budgetMode === "Exact amount" ? "selected" : undefined}
            onClick={() => setBudgetMode("Exact amount")}
          >
            Exact amount
          </button>
          <button
            type="button"
            className={budgetMode === "Budget range" ? "selected" : undefined}
            onClick={() => setBudgetMode("Budget range")}
          >
            Budget range
          </button>
        </div>
        <div
          className="budget-currency-field"
          onBlur={(event) => {
            const nextFocus =
              event.relatedTarget instanceof Node ? event.relatedTarget : null;
            if (!nextFocus || !event.currentTarget.contains(nextFocus)) {
              setCurrencyOpen(false);
            }
          }}
        >
          <span>Currency *</span>
          <button
            type="button"
            className="budget-currency-trigger"
            aria-haspopup="listbox"
            aria-expanded={currencyOpen}
            onClick={() => setCurrencyOpen((open) => !open)}
          >
            {budgetCurrency}
            <ChevronDown aria-hidden="true" size={18} />
          </button>
          {currencyOpen ? (
            <div className="budget-currency-menu" role="listbox">
              {["INR", "USD"].map((currency) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={budgetCurrency === currency}
                  className={budgetCurrency === currency ? "selected" : ""}
                  key={currency}
                  onClick={() => {
                    setBudgetCurrency(currency);
                    setCurrencyOpen(false);
                  }}
                >
                  {currency}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {budgetMode === "Exact amount" ? (
        <label className="budget-field budget-total-field">
          Total amount (per person) *
          <span>
            <input
              value={budgetAmount}
              onChange={(event) =>
                setBudgetAmount(numericOnly(event.target.value))
              }
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g. 25000"
              aria-required="true"
            />
          </span>
        </label>
      ) : (
        <div className="budget-range-fields">
          <label className="budget-field">
            Minimum budget (per person) *
            <span>
              <input
                value={budgetMin}
                onChange={(event) =>
                  setBudgetMin(numericOnly(event.target.value))
                }
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 20000"
                aria-required="true"
              />
            </span>
          </label>
          <label className="budget-field">
            Maximum budget (per person) *
            <span>
              <input
                value={budgetMax}
                onChange={(event) =>
                  setBudgetMax(numericOnly(event.target.value))
                }
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 30000"
                aria-required="true"
              />
            </span>
          </label>
        </div>
      )}
      <section className="budget-breakdown">
        <div>
          <h3>Category breakdown (optional)</h3>
          <p>Optional, but useful for travelers who want a quick cost split.</p>
        </div>
        <div>
          {budgetRows.map((row) => (
            <label key={row}>
              <span>{row}</span>
              <input
                value={budgetCategories[row] || ""}
                onChange={(event) =>
                  updateCategory(row, numericOnly(event.target.value))
                }
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 5000"
              />
            </label>
          ))}
        </div>
      </section>
    </section>
  );
}

function ReviewStep({
  title,
  destination,
  duration,
  coverPhoto,
  highlights,
  basicsComplete,
  aboutComplete,
  budgetComplete
}: {
  title: string;
  destination: string;
  duration: string;
  coverPhoto?: MediaItem;
  highlights: string[];
  basicsComplete: boolean;
  aboutComplete: boolean;
  budgetComplete: boolean;
}) {
  return (
    <section className="review-layout review-only">
      <div>
        <h2>Review your trip</h2>
        <p>
          Check the essentials before publishing. Published trips are visible to
          everyone.
        </p>
      </div>
      <article className="trip-preview-card">
        <MediaPreview
          item={coverPhoto}
          fallback="/images/hero/mountain-lake-traveler.png"
          alt="Trip preview"
          sizes="700px"
        />
        <div>
          <h3>{title || "Untitled trip"}</h3>
          <p>
            {destination || "Destination missing"} •{" "}
            {duration || "Dates missing"}
          </p>
          <div>
            {highlights.slice(0, 4).map((item) => (
              <small key={item}>{item}</small>
            ))}
          </div>
        </div>
      </article>
      <div className="review-checklist">
        {steps
          .filter((step) => step.id !== "review")
          .map((step) => {
            const isMissing =
              (step.id === "basics" && !basicsComplete) ||
              (step.id === "about" && !aboutComplete) ||
              (step.id === "budget" && !budgetComplete);
            const Icon = step.icon;
            return (
              <p className={isMissing ? "missing" : undefined} key={step.id}>
                <Icon aria-hidden="true" size={18} />
                <strong>{step.title}</strong>
                <span>{isMissing ? "Required" : "Completed"}</span>
                {isMissing ? (
                  <X aria-hidden="true" size={17} />
                ) : (
                  <Check aria-hidden="true" size={17} />
                )}
              </p>
            );
          })}
      </div>
    </section>
  );
}
