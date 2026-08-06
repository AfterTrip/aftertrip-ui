"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Bell,
  Bike,
  Bookmark,
  Bus,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  CircleDollarSign,
  Eye,
  FileText,
  Home,
  ImagePlus,
  Info,
  Map,
  MapPin,
  Menu,
  MoreHorizontal,
  Pencil,
  Plane,
  Play,
  Plus,
  Route,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  Train,
  Upload,
  User,
  Users,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

type StepId =
  | "basics"
  | "about"
  | "itinerary"
  | "transport"
  | "budget"
  | "review";
type MediaItem = {
  id: string;
  url: string;
  name: string;
  kind: "photo" | "video";
};

const profilePhoto = "/images/hero/mountain-lake-traveler.png";

const sidebarItems = [
  { label: "My Trips", href: "/dashboard", icon: Home },
  { label: "Drafts", href: "/dashboard", icon: FileText },
  { label: "Bookmarks", href: "/dashboard", icon: Bookmark },
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
    subtitle: "Trip essentials",
    icon: MapPin
  },
  {
    id: "about",
    title: "About Trip",
    subtitle: "Vibe & media",
    icon: Sparkles,
    optional: true
  },
  {
    id: "itinerary",
    title: "Itinerary",
    subtitle: "Places & route",
    icon: Map,
    optional: true
  },
  {
    id: "transport",
    title: "Stay & Transport",
    subtitle: "Optional",
    icon: BedDouble,
    optional: true
  },
  {
    id: "budget",
    title: "Budget",
    subtitle: "Optional",
    icon: CircleDollarSign,
    optional: true
  },
  { id: "review", title: "Review", subtitle: "Preview & publish", icon: Eye }
];

const tripGroups = [
  { label: "Solo", icon: User },
  { label: "Friends", icon: Users },
  { label: "Couple", icon: Users },
  { label: "Family", icon: Users },
  { label: "Group", icon: Users },
  { label: "Other", icon: MoreHorizontal }
];

const vibeOptions = [
  "Nature",
  "Adventure",
  "Relaxed",
  "Scenic",
  "Food",
  "Photography",
  "Friends",
  "Hidden gems"
];
const routeStops = [
  "Shillong, Meghalaya",
  "Cherrapunji, Meghalaya",
  "Mawlynnong, Meghalaya",
  "Dawki, Meghalaya"
];
const transportWays = [
  { label: "Self-drive", icon: Car },
  { label: "Cab", icon: Car },
  { label: "Bike", icon: Bike },
  { label: "Bus", icon: Bus },
  { label: "Train", icon: Train },
  { label: "Flight", icon: Plane },
  { label: "Walk", icon: Route }
];
const budgetRows = ["Stay", "Transport", "Food", "Activities", "Miscellaneous"];

export function CreateTripPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripGroup, setTripGroup] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<MediaItem | undefined>();
  const [summary, setSummary] = useState(
    "A misty hill escape with waterfalls, living root bridges and slow local food stops."
  );
  const [selectedVibes, setSelectedVibes] = useState(
    new Set(["Nature", "Adventure", "Scenic"])
  );
  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState([
    "Scenic mountain drives",
    "Living root bridges",
    "Peaceful villages"
  ]);
  const [media, setMedia] = useState<MediaItem[]>([
    {
      id: "cover",
      url: "/images/cta/share-adventure.png",
      name: "Cover photo",
      kind: "photo"
    },
    {
      id: "bali",
      url: "/images/trips/bali.png",
      name: "Beach memory",
      kind: "photo"
    },
    {
      id: "japan",
      url: "/images/destinations/japan.png",
      name: "Temple stop",
      kind: "photo"
    }
  ]);
  const [pace, setPace] = useState("Balanced");
  const [transport, setTransport] = useState("Self-drive");
  const [stayPrivacy, setStayPrivacy] = useState("Share exact stay names");
  const [budgetMode, setBudgetMode] = useState("Exact amount");
  const [visibility, setVisibility] = useState("Public trip");

  const currentStep = steps[stepIndex];
  const duration = useMemo(
    () => getTripDuration(startDate, endDate),
    [startDate, endDate]
  );
  const basicsComplete = Boolean(
    title.trim() &&
      destination.trim() &&
      startDate &&
      endDate &&
      duration &&
      coverPhoto &&
      tripGroup
  );
  const completedSections = useMemo(
    () =>
      steps
        .slice(0, stepIndex)
        .filter((step) => step.id !== "basics" || basicsComplete).length,
    [basicsComplete, stepIndex]
  );

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
            <button type="button">
              <Save aria-hidden="true" size={18} />
              Save as draft
            </button>
          </div>

          <nav className="create-stepper" aria-label="Trip creation steps">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === stepIndex;
              const isDone =
                index < stepIndex && (step.id !== "basics" || basicsComplete);
              const isIncomplete =
                step.id === "basics" && index < stepIndex && !basicsComplete;
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

          {currentStep.optional ? (
            <p className="create-optional-note">
              <Info aria-hidden="true" size={18} />
              Most fields on this step are optional. Add only what helps other
              travelers.
            </p>
          ) : null}

          <form
            className="create-step-card"
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
                selectedVibes={selectedVibes}
                setSelectedVibes={setSelectedVibes}
                highlightInput={highlightInput}
                setHighlightInput={setHighlightInput}
                highlights={highlights}
                addHighlight={addHighlight}
                setHighlights={setHighlights}
                addMedia={addMedia}
                media={media}
              />
            ) : null}
            {currentStep.id === "itinerary" ? (
              <ItineraryStep pace={pace} setPace={setPace} />
            ) : null}
            {currentStep.id === "transport" ? (
              <TransportStep
                transport={transport}
                setTransport={setTransport}
                stayPrivacy={stayPrivacy}
                setStayPrivacy={setStayPrivacy}
              />
            ) : null}
            {currentStep.id === "budget" ? (
              <BudgetStep
                budgetMode={budgetMode}
                setBudgetMode={setBudgetMode}
              />
            ) : null}
            {currentStep.id === "review" ? (
              <ReviewStep
                title={title}
                destination={destination}
                duration={duration}
                media={media}
                coverPhoto={coverPhoto}
                highlights={highlights}
                completedSections={completedSections}
                visibility={visibility}
                setVisibility={setVisibility}
                basicsComplete={basicsComplete}
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
                    disabled={!basicsComplete}
                    title={
                      basicsComplete
                        ? "Publish trip"
                        : "Complete Basics before publishing"
                    }
                  >
                    <Sparkles aria-hidden="true" size={19} />
                    Publish Trip
                  </button>
                ) : (
                  <button type="submit" className="primary">
                    Save & Continue
                    <ArrowRight aria-hidden="true" size={20} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </section>
      </div>
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
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#footer">About</Link>
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

function getTripDuration(startDate: string, endDate: string) {
  if (!startDate || !endDate) return "";
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  if (end < start) return "";
  const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  return days === 1 ? "1 day" : days + " days";
}

function BasicsStep({
  title,
  setTitle,
  destination,
  setDestination,
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
          <span>
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="e.g. Meghalaya, India"
              aria-required="true"
            />
            <MapPin aria-hidden="true" size={20} />
          </span>
          <em>Add country or region</em>
        </label>
        <div className="two-fields travel-date-fields">
          <label>
            Start date *
            <span>
              <CalendarDays aria-hidden="true" size={18} />
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
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
                onChange={(event) => setEndDate(event.target.value)}
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
  selectedVibes,
  setSelectedVibes,
  highlightInput,
  setHighlightInput,
  highlights,
  addHighlight,
  setHighlights,
  addMedia,
  media
}: {
  summary: string;
  setSummary: (value: string) => void;
  selectedVibes: Set<string>;
  setSelectedVibes: (value: Set<string>) => void;
  highlightInput: string;
  setHighlightInput: (value: string) => void;
  highlights: string[];
  addHighlight: () => void;
  setHighlights: (value: string[]) => void;
  addMedia: (files: FileList | null) => void;
  media: MediaItem[];
}) {
  const toggle = (label: string) => {
    const next = new Set(selectedVibes);
    if (next.has(label)) next.delete(label);
    else next.add(label);
    setSelectedVibes(next);
  };
  return (
    <div className="create-two-column">
      <section>
        <h2>Tell people what this trip felt like</h2>
        <p>A short summary, a vibe and a few highlights are enough.</p>
        <label>
          Trip summary{" "}
          <textarea
            value={summary}
            maxLength={300}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Share a short intro about your trip..."
          />
          <small>{summary.length} / 300</small>
        </label>
        <div className="create-chip-section">
          <h3>Trip vibe</h3>
          <div>
            {vibeOptions.map((label) => (
              <button
                type="button"
                className={selectedVibes.has(label) ? "selected" : undefined}
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
          <h3>Top highlights</h3>
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
        <section>
          <h2>Best for</h2>
          <div className="mini-choice-grid">
            {[
              "Friends",
              "Couples",
              "Solo travelers",
              "Families",
              "First timers"
            ].map((item) => (
              <button type="button" key={item}>
                <Users aria-hidden="true" size={17} />
                {item}
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2>Good to know</h2>
          <textarea
            placeholder="Best season, permits, local transport notes..."
            maxLength={300}
          />
        </section>
        <section className="media-upload-panel">
          <h2>Share photos & videos</h2>
          <p>Add the best few. Videos make the trip feel alive.</p>
          <div className="media-strip">
            <label>
              <Upload aria-hidden="true" size={22} />
              Upload
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(event) => addMedia(event.target.files)}
              />
            </label>
            {media.slice(0, 4).map((item) => (
              <article key={item.id}>
                <MediaPreview
                  item={item}
                  fallback="/images/cta/share-adventure.png"
                  alt={item.name}
                  sizes="90px"
                />
                {item.kind === "video" ? (
                  <Play aria-hidden="true" size={18} />
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function ItineraryStep({
  pace,
  setPace
}: {
  pace: string;
  setPace: (value: string) => void;
}) {
  return (
    <div className="create-two-column route-layout">
      <section>
        <h2>Map out the route</h2>
        <p>Add the places in order. Day-wise notes are optional.</p>
        <div className="two-fields">
          <label>
            Start point *
            <span>
              <MapPin aria-hidden="true" size={18} />
              <input defaultValue="Guwahati, Assam" />
              <X aria-hidden="true" size={17} />
            </span>
          </label>
          <label>
            End point *
            <span>
              <MapPin aria-hidden="true" size={18} />
              <input defaultValue="Guwahati, Assam" />
              <X aria-hidden="true" size={17} />
            </span>
          </label>
        </div>
        <div className="route-stops">
          <h3>Stops</h3>
          {routeStops.map((stop, index) => (
            <article key={stop}>
              <MoreHorizontal aria-hidden="true" size={18} />
              <span>{index + 1}</span>
              <strong>{stop}</strong>
              <button type="button">
                <X aria-hidden="true" size={17} />
              </button>
            </article>
          ))}
          <button type="button">
            <Plus aria-hidden="true" size={17} />
            Add stop
          </button>
        </div>
        <div className="create-chip-section">
          <h3>Travel pace</h3>
          <div>
            {["Relaxed", "Balanced", "Packed"].map((item) => (
              <button
                type="button"
                className={pace === item ? "selected" : undefined}
                onClick={() => setPace(item)}
                key={item}
              >
                <Route aria-hidden="true" size={17} />
                {item}
              </button>
            ))}
          </div>
        </div>
        <section className="day-notes">
          <h3>Optional day-wise notes</h3>
          <div>
            {[
              "Guwahati to Shillong",
              "Shillong to Cherrapunji",
              "Cherrapunji to Mawlynnong"
            ].map((item, index) => (
              <article key={item}>
                <strong>Day {index + 1}</strong>
                <b>{item}</b>
                <p>Short note about what made this day useful.</p>
              </article>
            ))}
          </div>
        </section>
      </section>
      <aside>
        <section className="route-preview">
          <h2>Quick route preview</h2>
          {["Guwahati, Assam", ...routeStops, "Guwahati, Assam"].map(
            (stop, index) => (
              <p key={stop + index}>
                <span /> <strong>{stop}</strong>
                <small>
                  {index === 0
                    ? "Start"
                    : index === 5
                      ? "End"
                      : "Stop " + index}
                </small>
              </p>
            )
          )}
          <footer>
            <Car aria-hidden="true" size={17} />7 days • 420 km • Self-drive
          </footer>
        </section>
        <section>
          <h2>Good to know</h2>
          <textarea
            placeholder="Road conditions, permits, local tips..."
            maxLength={300}
          />
        </section>
      </aside>
    </div>
  );
}

function TransportStep({
  transport,
  setTransport,
  stayPrivacy,
  setStayPrivacy
}: {
  transport: string;
  setTransport: (value: string) => void;
  stayPrivacy: string;
  setStayPrivacy: (value: string) => void;
}) {
  return (
    <div className="create-two-column transport-layout">
      <section>
        <h2>How did you get around?</h2>
        <p>Choose only what feels useful to future travelers.</p>
        <div className="icon-choice-grid">
          {transportWays.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                className={transport === item.label ? "selected" : undefined}
                onClick={() => setTransport(item.label)}
                key={item.label}
              >
                <Icon aria-hidden="true" size={19} />
                {item.label}
              </button>
            );
          })}
        </div>
        <label>
          Main transport used
          <select
            value={transport}
            onChange={(event) => setTransport(event.target.value)}
          >
            {transportWays.map((item) => (
              <option key={item.label}>{item.label}</option>
            ))}
          </select>
        </label>
        <label>
          Optional transport notes
          <textarea
            placeholder="Road conditions, tolls, parking, local transport notes..."
            maxLength={300}
          />
        </label>
      </section>
      <aside>
        <section>
          <h2>Stay recommendations</h2>
          <div className="stay-card">
            <Image
              src="/images/destinations/switzerland.png"
              alt="Stay preview"
              width={94}
              height={94}
            />
            <div>
              <strong>The Fern Hill Cottage</strong>
              <p>Near Mall Road • Moderate</p>
              <small>Peaceful place with great valley views.</small>
            </div>
          </div>
          <button type="button" className="add-inline">
            <Plus aria-hidden="true" size={17} />
            Add another stay
          </button>
        </section>
        <section className="create-chip-section">
          <h2>Stay type</h2>
          <div>
            {["Hotel", "Homestay", "Hostel", "Resort", "Camping"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={item === "Hotel" ? "selected" : undefined}
                >
                  <BedDouble aria-hidden="true" size={17} />
                  {item}
                </button>
              )
            )}
          </div>
        </section>
        <section>
          <h2>Privacy control</h2>
          {["Share exact stay names", "Share only area & type"].map((item) => (
            <label className="radio-row" key={item}>
              <input
                type="radio"
                checked={stayPrivacy === item}
                onChange={() => setStayPrivacy(item)}
              />{" "}
              <span>
                {item}
                <small>
                  {item === "Share exact stay names"
                    ? "Helps others find the same places."
                    : "More privacy, still helpful."}
                </small>
              </span>
            </label>
          ))}
        </section>
      </aside>
    </div>
  );
}

function BudgetStep({
  budgetMode,
  setBudgetMode
}: {
  budgetMode: string;
  setBudgetMode: (value: string) => void;
}) {
  return (
    <div className="create-two-column budget-layout">
      <section>
        <h2>Budget</h2>
        <p>
          This is optional. A range is enough if exact numbers feel too much.
        </p>
        <div className="segmented">
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
        <label>
          Total amount
          <span>
            <b>₹</b>
            <input placeholder="e.g. 25000" />
            <select>
              <option>INR</option>
              <option>USD</option>
            </select>
          </span>
        </label>
        <label className="switch-row">
          Per person
          <input type="checkbox" defaultChecked />
        </label>
        <section className="budget-breakdown">
          <h3>Category breakdown</h3>
          {budgetRows.map((row) => (
            <label key={row}>
              <span>{row}</span>
              <input placeholder="₹  e.g. 5000" />
            </label>
          ))}
        </section>
      </section>
      <aside>
        <section className="budget-preview">
          <h2>Budget summary preview</h2>
          <strong>₹20k - ₹25k</strong>
          <p>Per person</p>
          <small>This is an estimated range.</small>
        </section>
        <section className="create-chip-section">
          <h2>Helpful context</h2>
          <div>
            {["Budget-friendly", "Moderate", "Premium"].map((item) => (
              <button type="button" key={item}>
                <CircleDollarSign aria-hidden="true" size={17} />
                {item}
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2>Public visibility</h2>
          <label className="radio-row">
            <input type="radio" defaultChecked />{" "}
            <span>Show exact numbers publicly</span>
          </label>
          <label className="radio-row">
            <input type="radio" /> <span>Show only budget range</span>
          </label>
        </section>
      </aside>
    </div>
  );
}

function ReviewStep({
  title,
  destination,
  duration,
  media,
  coverPhoto,
  highlights,
  completedSections,
  visibility,
  setVisibility,
  basicsComplete
}: {
  title: string;
  destination: string;
  duration: string;
  media: MediaItem[];
  coverPhoto?: MediaItem;
  highlights: string[];
  completedSections: number;
  visibility: string;
  setVisibility: (value: string) => void;
  basicsComplete: boolean;
}) {
  return (
    <div className="create-two-column review-layout">
      <section>
        <h2>Review your trip</h2>
        <p>
          Check the essentials, preview what others will see, and publish when
          ready.
        </p>
        <article className="trip-preview-card">
          <MediaPreview
            item={coverPhoto}
            fallback="/images/cta/share-adventure.png"
            alt="Trip preview"
            sizes="700px"
          />
          <div>
            <span>
              {media[1] ? (
                <MediaPreview
                  item={media[1]}
                  fallback="/images/cta/share-adventure.png"
                  alt="Small preview"
                  sizes="82px"
                />
              ) : null}
            </span>
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
          {steps.slice(0, 5).map((step) => {
            const isMissing = step.id === "basics" && !basicsComplete;
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
        <section>
          <h2>Visibility & sharing</h2>
          {["Public trip", "Unlisted link"].map((item) => (
            <label className="radio-row" key={item}>
              <input
                type="radio"
                checked={visibility === item}
                onChange={() => setVisibility(item)}
              />{" "}
              <span>
                {item}
                <small>
                  {item === "Public trip"
                    ? "Anyone can discover and view your trip."
                    : "Only people with the link can view."}
                </small>
              </span>
            </label>
          ))}
        </section>
      </section>
      <aside>
        <section
          className={
            basicsComplete ? "publish-summary" : "publish-summary missing"
          }
        >
          <h2>Publish summary</h2>
          <div>
            {basicsComplete ? (
              <Check aria-hidden="true" size={22} />
            ) : (
              <X aria-hidden="true" size={22} />
            )}
            <strong>
              {basicsComplete
                ? Math.min(100, 72 + completedSections * 6) + "% complete"
                : "Basics required"}
            </strong>
            <p>
              {basicsComplete
                ? "All essential sections are ready."
                : "Complete Basics before publishing."}
            </p>
            <i />
          </div>
          <p>
            <CalendarDays aria-hidden="true" size={18} />
            Estimated read time <strong>6-8 min</strong>
          </p>
        </section>
        <section>
          <h2>What will be shown publicly</h2>
          {[
            "Cover photo & trip title",
            "Photo and video gallery",
            "Itinerary",
            "Budget",
            "Stays & transport"
          ].map((item) => (
            <p className="public-row" key={item}>
              <ShieldCheck aria-hidden="true" size={18} />
              {item}
            </p>
          ))}
        </section>
        <section
          className={basicsComplete ? "ready-card" : "ready-card missing"}
        >
          <Star aria-hidden="true" size={22} />
          <strong>{basicsComplete ? "Great job!" : "Basics needed"}</strong>
          <p>
            {basicsComplete
              ? "Your trip is ready to inspire other travelers."
              : "Complete title, destination, dates, cover photo and group before publishing."}
          </p>
        </section>
      </aside>
    </div>
  );
}
