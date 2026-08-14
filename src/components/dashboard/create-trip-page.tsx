"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
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
  Menu,
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
import {
  searchVerifiedPlaces,
  type VerifiedPlace
} from "@/data/verified-places";

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

const profilePhoto = "/images/hero/mountain-lake-traveler.png";

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

const editableTripPrefills: Record<
  string,
  {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    tripGroup: string;
    coverPhoto: MediaItem;
    summary: string;
    styles: string[];
    highlights: string[];
    itineraryDays: ItineraryDay[];
    budgetAmount: string;
  }
> = {
  "meghalaya-road-trip": {
    title: "Meghalaya Road Trip",
    destination: "Meghalaya, India",
    startDate: "2024-05-12",
    endDate: "2024-05-18",
    tripGroup: "Friends",
    coverPhoto: {
      id: "meghalaya-cover",
      url: "/images/cta/share-adventure.png",
      name: "Meghalaya cover",
      kind: "photo"
    },
    summary:
      "A green, slow-paced road trip through misty hills, living roots and quiet villages.",
    styles: ["Road trip", "Nature", "Adventure"],
    highlights: ["Living root bridges", "Dawki river", "Cloudy hill roads"],
    itineraryDays: [
      {
        id: "day-1",
        headline: "Guwahati to Shillong",
        description: "Arrive in Guwahati and drive toward Shillong."
      },
      {
        id: "day-2",
        headline: "Shillong to Cherrapunji",
        description: "Waterfalls, viewpoints and misty cave walks."
      }
    ],
    budgetAmount: "24800"
  },
  "bali-island-of-gods": {
    title: "Bali: Island of Gods",
    destination: "Bali, Indonesia",
    startDate: "2024-04-03",
    endDate: "2024-04-09",
    tripGroup: "Couple",
    coverPhoto: {
      id: "bali-cover",
      url: "/images/trips/bali.png",
      name: "Bali cover",
      kind: "photo"
    },
    summary:
      "A sunny Bali escape with beaches, temples, food stops and relaxed coastal drives.",
    styles: ["Beach", "Culture", "Food"],
    highlights: ["Beach mornings", "Temple sunsets", "Local food"],
    itineraryDays: [
      {
        id: "day-1",
        headline: "Ubud arrival",
        description: "Settle in, walk around local cafes and markets."
      }
    ],
    budgetAmount: "54000"
  },
  "kashmir-in-spring": {
    title: "Kashmir in Spring",
    destination: "Kashmir, India",
    startDate: "2024-03-15",
    endDate: "2024-03-21",
    tripGroup: "Family",
    coverPhoto: {
      id: "kashmir-cover",
      url: "/images/trips/switzerland.png",
      name: "Kashmir cover",
      kind: "photo"
    },
    summary: "Snow peaks, valley views and quiet spring days across Kashmir.",
    styles: ["Nature", "Mountains", "Relaxed"],
    highlights: ["Spring valleys", "Mountain views", "Slow village walks"],
    itineraryDays: [
      {
        id: "day-1",
        headline: "Srinagar arrival",
        description: "Arrive, settle in and take a relaxed evening walk."
      }
    ],
    budgetAmount: "62000"
  },
  "thailand-getaway": {
    title: "Thailand Getaway",
    destination: "Thailand",
    startDate: "2024-02-10",
    endDate: "2024-02-16",
    tripGroup: "Friends",
    coverPhoto: {
      id: "thailand-cover",
      url: "/images/trips/thailand.png",
      name: "Thailand cover",
      kind: "photo"
    },
    summary: "Island hopping, clear water and easy beach days with friends.",
    styles: ["Beach", "Relaxed", "Adventure"],
    highlights: ["Island hopping", "Boat rides", "Turquoise water"],
    itineraryDays: [
      {
        id: "day-1",
        headline: "Island arrival",
        description: "Check in near the beach and keep the first day relaxed."
      }
    ],
    budgetAmount: "68000"
  },
  "munnar-monsoon-escape": {
    title: "Munnar Monsoon Escape",
    destination: "Munnar, Kerala, India",
    startDate: "2024-07-08",
    endDate: "2024-07-12",
    tripGroup: "Solo",
    coverPhoto: {
      id: "munnar-cover",
      url: "/images/destinations/thailand.png",
      name: "Munnar cover",
      kind: "photo"
    },
    summary: "A quiet monsoon escape through tea gardens and misty hill roads.",
    styles: ["Nature", "Mountains", "Relaxed"],
    highlights: ["Tea gardens", "Rainy viewpoints", "Calm stays"],
    itineraryDays: [
      {
        id: "day-1",
        headline: "Arrive in Munnar",
        description: "Check in and explore nearby tea garden viewpoints."
      }
    ],
    budgetAmount: "18000"
  },
  "japan-cherry-blossom": {
    title: "Japan Cherry Blossom",
    destination: "Japan",
    startDate: "2024-04-01",
    endDate: "2024-04-07",
    tripGroup: "Couple",
    coverPhoto: {
      id: "japan-cover",
      url: "/images/destinations/japan.png",
      name: "Japan cover",
      kind: "photo"
    },
    summary:
      "Cherry blossom walks, temple visits and quiet city evenings in Japan.",
    styles: ["Culture", "City", "Food"],
    highlights: ["Cherry blossoms", "Temple walks", "Local trains"],
    itineraryDays: [
      {
        id: "day-1",
        headline: "Tokyo arrival",
        description: "Arrive, settle in and explore a nearby blossom walk."
      }
    ],
    budgetAmount: "115000"
  }
};

type CreateTripPageProps = {
  tripId?: string;
};

export function CreateTripPage({ tripId }: CreateTripPageProps = {}) {
  const initialTrip = tripId ? editableTripPrefills[tripId] : undefined;
  const initialDestination = initialTrip
    ? searchVerifiedPlaces(initialTrip.destination)[0]
    : undefined;
  const [stepIndex, setStepIndex] = useState(0);
  const [title, setTitle] = useState(initialTrip?.title ?? "");
  const [destination, setDestination] = useState(
    initialTrip?.destination ?? ""
  );
  const [selectedDestination, setSelectedDestination] = useState<
    VerifiedPlace | undefined
  >(initialDestination);
  const [startDate, setStartDate] = useState(initialTrip?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialTrip?.endDate ?? "");
  const [tripGroup, setTripGroup] = useState(initialTrip?.tripGroup ?? "");
  const [coverPhoto, setCoverPhoto] = useState<MediaItem | undefined>(
    initialTrip?.coverPhoto
  );
  const [summary, setSummary] = useState(initialTrip?.summary ?? "");
  const [selectedTripStyles, setSelectedTripStyles] = useState(
    new Set<string>(initialTrip?.styles ?? [])
  );
  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>(
    initialTrip?.highlights ?? []
  );
  const [goodToKnow, setGoodToKnow] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | undefined>();
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([
    ...(initialTrip?.itineraryDays ?? [
      { id: "day-1", headline: "", description: "" }
    ])
  ]);
  const [budgetMode, setBudgetMode] = useState("Exact amount");
  const [budgetCurrency, setBudgetCurrency] = useState("INR");
  const [budgetAmount, setBudgetAmount] = useState(
    initialTrip?.budgetAmount ?? ""
  );
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [budgetCategories, setBudgetCategories] = useState(
    Object.fromEntries(budgetRows.map((row) => [row, ""]))
  );
  const [autosaveStatus, setAutosaveStatus] = useState("Autosaved");
  const hasMounted = useRef(false);
  const autosaveTimer = useRef<number | undefined>(undefined);

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
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setAutosaveStatus("Saving...");
    const timeout = window.setTimeout(
      () => setAutosaveStatus("Autosaved"),
      500
    );
    return () => window.clearTimeout(timeout);
  }, [
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
    budgetCategories
  ]);

  const markAutosaving = () => {
    setAutosaveStatus("Saving...");
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    autosaveTimer.current = window.setTimeout(
      () => setAutosaveStatus("Autosaved"),
      500
    );
  };

  const addHighlight = () => {
    const next = highlightInput.trim();
    if (!next) return;
    setHighlights((items) => [...items.slice(-4), next]);
    setHighlightInput("");
  };

  const addMedia = (files: FileList | null) => {
    if (!files?.length) return;
    const next = Array.from(files)
      .slice(0, 6)
      .map((file) => ({
        id: file.name + file.lastModified,
        url: URL.createObjectURL(file),
        name: file.name,
        kind: file.type.startsWith("video")
          ? ("video" as const)
          : ("photo" as const)
      }));
    setMedia((items) => [...items, ...next].slice(0, 10));
  };

  const removeMedia = (id: string) => {
    setMedia((items) => {
      const removed = items.find((item) => item.id === id);
      if (removed?.url.startsWith("blob:")) URL.revokeObjectURL(removed.url);
      return items.filter((item) => item.id !== id);
    });
    setPreviewMedia((item) => (item?.id === id ? undefined : item));
  };

  const addCoverPhoto = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image")) return;
    setCoverPhoto({
      id: file.name + file.lastModified,
      url: URL.createObjectURL(file),
      name: file.name,
      kind: "photo"
    });
  };

  const goNext = () =>
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
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
            <p className="autosave-status" aria-live="polite">
              <Check aria-hidden="true" size={18} />
              {autosaveStatus}
            </p>
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
            onInput={markAutosaving}
            onChange={markAutosaving}
            onSubmit={(event) => {
              event.preventDefault();
              goNext();
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
                destination={selectedDestination?.label || destination}
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
                  <button type="button" className="ghost" onClick={goNext}>
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
      <MediaLightbox
        item={previewMedia}
        onClose={() => setPreviewMedia(undefined)}
      />
    </main>
  );
}

function DashboardTopbar() {
  return (
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
      <nav className="dashboard-desktop-nav" aria-label="Dashboard navigation">
        <Link href="/explore">Explore</Link>
        <Link href="/#reviews">Reviews</Link>
        <Link href="/#how-it-works">How it works</Link>
      </nav>
      <div className="dashboard-top-actions">
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
  selectedDestination?: VerifiedPlace;
  setSelectedDestination: (value: VerifiedPlace | undefined) => void;
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
  const destinationOptions = searchVerifiedPlaces(destination);
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
        <label>
          Destination *
          <span className="verified-place-field">
            <input
              value={destination}
              onChange={(event) => {
                setDestination(event.target.value);
                setSelectedDestination(undefined);
              }}
              placeholder="Search and select a real place"
              aria-required="true"
              aria-invalid={Boolean(destination && !selectedDestination)}
            />
            <MapPin aria-hidden="true" size={20} />
          </span>
          <em>
            {selectedDestination
              ? `Verified coordinates: ${selectedDestination.coordinates.lat.toFixed(4)}, ${selectedDestination.coordinates.lng.toFixed(4)}`
              : "Select a verified result. Free-typed locations cannot be published."}
          </em>
          {destination && !selectedDestination ? (
            <div className="verified-place-results">
              {destinationOptions.length ? (
                destinationOptions.map((place) => (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDestination(place);
                      setDestination(place.label);
                    }}
                    key={place.id}
                  >
                    <MapPin aria-hidden="true" size={17} />
                    <span>
                      <strong>{place.label}</strong>
                      <small>
                        {place.coordinates.lat.toFixed(4)},{" "}
                        {place.coordinates.lng.toFixed(4)}
                      </small>
                    </span>
                  </button>
                ))
              ) : (
                <p>
                  No verified place found. Backend map search will handle wider
                  coverage later.
                </p>
              )}
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
                fallback="/images/cta/share-adventure.png"
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
      <section className="create-chip-section">
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
            maxLength={300}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Share a short intro about your trip..."
            aria-required="true"
          />
          <small>{summary.length} / 300</small>
        </label>
        <div className="create-chip-section">
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
            maxLength={300}
          />
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
                    fallback="/images/cta/share-adventure.png"
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
                  maxLength={80}
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
                  maxLength={240}
                />
                <small>{day.description.length} / 240</small>
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
          fallback="/images/cta/share-adventure.png"
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
