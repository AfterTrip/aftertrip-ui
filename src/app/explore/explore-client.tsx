"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Compass,
  Grid2X2,
  Heart,
  List,
  Map,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Tags,
  WalletCards
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  exploreCategories,
  exploreTrips,
  type ExploreTrip
} from "@/data/explore-trips";

const quickFilters = [
  { label: "Anytime", icon: CalendarDays },
  { label: "Budget", icon: WalletCards },
  { label: "Trip type", icon: Tags },
  { label: "Season", icon: Sun },
  { label: "Hidden gems", icon: Sparkles }
] as const;

const durationOptions = [
  "Any",
  "1-3 days",
  "4-7 days",
  "1-2 weeks",
  "2+ weeks"
];
const tripTypes = [
  "All Types",
  "Solo",
  "Couples",
  "Family",
  "Group",
  "Backpacking",
  "Road Trip",
  "Luxury"
];
const styles = [
  "Adventure",
  "Relaxation",
  "Culture",
  "Nature",
  "Food & Drink",
  "Photography",
  "Off the Beaten Path",
  "City Break"
];

const categoryCountries: Record<string, string[]> = {
  "All Trips": [],
  Mountains: ["Switzerland", "New Zealand"],
  Beaches: ["Indonesia", "Thailand"],
  "Road Trips": ["Italy", "New Zealand"],
  Winter: ["Iceland"],
  Backpacking: ["Thailand", "Indonesia"]
};

const tripTypeRules: Record<string, (trip: ExploreTrip) => boolean> = {
  "All Types": () => true,
  Solo: (trip) => ["Iceland", "Japan", "New Zealand"].includes(trip.country),
  Couples: (trip) =>
    ["Indonesia", "Italy", "Switzerland"].includes(trip.country),
  Family: (trip) => ["Switzerland", "Japan", "Thailand"].includes(trip.country),
  Group: (trip) => ["Thailand", "Indonesia", "Italy"].includes(trip.country),
  Backpacking: (trip) =>
    ["Thailand", "Indonesia", "New Zealand"].includes(trip.country),
  "Road Trip": (trip) =>
    trip.title.includes("Road") ||
    trip.country === "Italy" ||
    trip.country === "New Zealand",
  Luxury: (trip) => tripPrice(trip) >= 1000
};

const styleRules: Record<string, (trip: ExploreTrip) => boolean> = {
  Adventure: (trip) =>
    ["Iceland", "New Zealand", "Switzerland", "Thailand"].includes(
      trip.country
    ),
  Relaxation: (trip) =>
    ["Indonesia", "Thailand", "Italy"].includes(trip.country),
  Culture: (trip) => ["Japan", "Indonesia", "Italy"].includes(trip.country),
  Nature: (trip) =>
    ["Switzerland", "Iceland", "New Zealand", "Thailand"].includes(
      trip.country
    ),
  "Food & Drink": (trip) =>
    trip.country === "Italy" ||
    trip.country === "Japan" ||
    trip.country === "Indonesia",
  Photography: (trip) => Number(trip.rating) >= 4.8,
  "Off the Beaten Path": (trip) =>
    trip.title.includes("Offbeat") ||
    trip.title.includes("Hidden") ||
    trip.title.includes("Raw"),
  "City Break": (trip) =>
    trip.budgetLabel.toLowerCase().includes("city") ||
    trip.country === "Italy" ||
    trip.country === "Japan"
};

function tripDays(trip: ExploreTrip) {
  return Number(trip.duration.replace(/[^0-9]/g, ""));
}

function matchesDuration(trip: ExploreTrip, duration: string) {
  const days = tripDays(trip);
  if (duration === "1-3 days") return days <= 3;
  if (duration === "4-7 days") return days >= 4 && days <= 7;
  if (duration === "1-2 weeks") return days >= 7 && days <= 14;
  if (duration === "2+ weeks") return days >= 14;
  return true;
}

function tripPrice(trip: ExploreTrip) {
  return Number(trip.price.replace(/[^0-9]/g, ""));
}

function ExploreTripCard({ trip }: { trip: ExploreTrip }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="explore-trip-card">
      <Link
        className="explore-trip-link"
        href={`/trips/${trip.slug}`}
        aria-label={`Open ${trip.title}`}
      >
        <Image
          src={trip.image.src}
          alt={trip.image.alt}
          fill
          sizes="(max-width: 767px) 44vw, 28vw"
          className="explore-card-image"
        />
        <div className="explore-card-overlay" />
        <span className="explore-duration">{trip.duration}</span>
      </Link>
      <button
        className={saved ? "favorite-trip is-saved" : "favorite-trip"}
        type="button"
        aria-label={(saved ? "Remove " : "Save ") + trip.title}
        aria-pressed={saved}
        onClick={() => setSaved((value) => !value)}
      >
        <Heart
          aria-hidden="true"
          fill={saved ? "currentColor" : "none"}
          size={24}
        />
      </button>
      <Link className="explore-card-content" href={`/trips/${trip.slug}`}>
        <h2>{trip.title}</h2>
        <p className="trip-place">{trip.place}</p>
        <div className="explore-card-meta">
          <span>
            <Avatar
              initials={trip.initials}
              tone={trip.avatarTone}
              label={trip.author + " avatar"}
            />
            By {trip.author}
          </span>
          <span className="explore-rating">
            <Star aria-hidden="true" fill="currentColor" size={16} />
            {trip.rating}
          </span>
          <strong>{trip.price}</strong>
        </div>
        <div className="mobile-budget-row">
          <span>$$$</span>
          <i />
          {trip.budgetLabel}
        </div>
      </Link>
    </article>
  );
}

export function ExploreClient({
  initialQuery = ""
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All Trips");
  const [activeQuickFilter, setActiveQuickFilter] = useState("Anytime");
  const [duration, setDuration] = useState("Any");
  const [tripType, setTripType] = useState("All Types");
  const [travelStyle, setTravelStyle] = useState("");
  const [budget, setBudget] = useState(5000);
  const [rating, setRating] = useState(4);
  const [hiddenGems, setHiddenGems] = useState(true);
  const [budgetFriendly, setBudgetFriendly] = useState(false);
  const [familyFriendly, setFamilyFriendly] = useState(false);
  const [sortBy, setSortBy] = useState("Newest");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [visibleCount, setVisibleCount] = useState(6);

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("All Trips");
    setActiveQuickFilter("Anytime");
    setDuration("Any");
    setTripType("All Types");
    setTravelStyle("");
    setBudget(5000);
    setRating(4);
    setHiddenGems(true);
    setBudgetFriendly(false);
    setFamilyFriendly(false);
    setSortBy("Newest");
    setVisibleCount(6);
  };

  const filteredTrips = useMemo(() => {
    const allowedCountries = categoryCountries[activeCategory] ?? [];
    const normalizedQuery = query.trim().toLowerCase();
    const results = exploreTrips.filter((trip) => {
      const matchesQuery =
        !normalizedQuery ||
        [trip.title, trip.country, trip.place, trip.author].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );
      const matchesCategory =
        allowedCountries.length === 0 ||
        allowedCountries.includes(trip.country);
      const matchesBudget = tripPrice(trip) <= budget;
      const matchesRating = Number(trip.rating) >= rating;
      const matchesDurationFilter = matchesDuration(trip, duration);
      const matchesTripType = (
        tripTypeRules[tripType] ?? tripTypeRules["All Types"]
      )(trip);
      const matchesStyle =
        !travelStyle || (styleRules[travelStyle] ?? (() => true))(trip);
      const matchesBudgetFriendly = !budgetFriendly || tripPrice(trip) <= 700;
      const matchesFamilyFriendly = !familyFriendly || tripDays(trip) <= 7;
      return (
        matchesQuery &&
        matchesCategory &&
        matchesBudget &&
        matchesRating &&
        matchesDurationFilter &&
        matchesTripType &&
        matchesStyle &&
        matchesBudgetFriendly &&
        matchesFamilyFriendly
      );
    });

    return [...results].sort((a, b) => {
      if (sortBy === "Top rated") return Number(b.rating) - Number(a.rating);
      if (sortBy === "Budget low") return tripPrice(a) - tripPrice(b);
      return exploreTrips.indexOf(a) - exploreTrips.indexOf(b);
    });
  }, [
    activeCategory,
    budget,
    budgetFriendly,
    duration,
    familyFriendly,
    query,
    rating,
    sortBy,
    travelStyle,
    tripType
  ]);

  const visibleTrips = filteredTrips.slice(0, visibleCount);
  const mobileFilterCount = [
    duration !== "Any",
    budget < 5000,
    rating > 4,
    tripType !== "All Types",
    Boolean(travelStyle),
    budgetFriendly,
    familyFriendly
  ].filter(Boolean).length;
  const budgetText = "$200 - $" + budget.toLocaleString();
  const appliedSummary =
    activeQuickFilter +
    " • " +
    duration +
    " • up to $" +
    budget.toLocaleString() +
    " • " +
    rating.toFixed(1) +
    "+ rating";

  return (
    <main id="main-content" className="explore-page">
      <section className="explore-hero" aria-labelledby="explore-title">
        <Image
          src="/images/hero/mountain-lake-traveler.png"
          alt="Traveler looking over a mountain lake"
          fill
          priority
          sizes="100vw"
          className="explore-hero-image"
        />
        <div className="explore-hero-overlay" />
        <div className="container explore-hero-inner">
          <h1 id="explore-title">Explore Real Trips</h1>
          <p>
            Discover authentic journeys shared by real travelers and find
            inspiration for your next adventure.
          </p>
          <form
            className="explore-search"
            role="search"
            action="/explore"
            method="get"
          >
            <label className="explore-search-input" htmlFor="explore-query">
              <Search aria-hidden="true" size={22} />
              <span className="sr-only">Search trips</span>
              <input
                id="explore-query"
                name="destination"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(6);
                }}
                placeholder="Where do you want to go?"
              />
            </label>
            {quickFilters.slice(0, 3).map(({ label, icon: Icon }) => (
              <button
                className={
                  activeQuickFilter === label ? "is-active" : undefined
                }
                type="button"
                aria-pressed={activeQuickFilter === label}
                onClick={() => setActiveQuickFilter(label)}
                key={label}
              >
                <Icon aria-hidden="true" size={17} />
                {label === "Budget"
                  ? "Any budget"
                  : label === "Trip type"
                    ? "Any trip type"
                    : label}
              </button>
            ))}
            <Button type="submit">Explore</Button>
          </form>
        </div>
      </section>

      <section
        className="mobile-explore-hero"
        aria-labelledby="mobile-explore-title"
      >
        <Image
          src="/images/trips/switzerland.png"
          alt="Pale mountain landscape"
          fill
          priority
          sizes="100vw"
          className="mobile-explore-bg"
        />
        <div className="container mobile-explore-inner">
          <h1 id="mobile-explore-title">Explore Trips</h1>
          <p>
            Discover real travel stories from thousands of travelers and plan
            your next unforgettable adventure.
          </p>
          <form
            className="mobile-explore-search"
            role="search"
            action="/explore"
            method="get"
          >
            <label htmlFor="mobile-explore-query">
              <Search aria-hidden="true" size={28} />
              <span className="sr-only">Search destination</span>
              <input
                id="mobile-explore-query"
                name="destination"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(6);
                }}
                placeholder="Where do you want to go?"
              />
            </label>
          </form>
          <div className="mobile-filter-chips" aria-label="Quick filters">
            {quickFilters.map(({ label, icon: Icon }) => (
              <button
                className={activeQuickFilter === label ? "active" : undefined}
                type="button"
                aria-pressed={activeQuickFilter === label}
                onClick={() => setActiveQuickFilter(label)}
                key={label}
              >
                <Icon aria-hidden="true" size={22} />
                {label}
              </button>
            ))}
          </div>
          <div className="mobile-sort-bar">
            <button
              type="button"
              onClick={() => {
                setSortBy(
                  sortBy === "Recommended" ? "Top rated" : "Recommended"
                );
                setVisibleCount(6);
              }}
            >
              <strong>Sort by:</strong>{" "}
              {sortBy === "Newest" ? "Recommended" : sortBy}{" "}
              <ChevronDown aria-hidden="true" size={16} />
            </button>
            <button
              className={viewMode === "map" ? "active" : undefined}
              type="button"
              aria-pressed={viewMode === "map"}
              onClick={() =>
                setViewMode((mode) => (mode === "map" ? "grid" : "map"))
              }
            >
              <Map aria-hidden="true" size={24} />
              Map view
            </button>
            <button
              className={mobileFilterCount > 0 ? "active" : undefined}
              type="button"
              aria-pressed={mobileFilterCount > 0}
              onClick={() =>
                setActiveQuickFilter((filter) =>
                  filter === "Budget" ? "Anytime" : "Budget"
                )
              }
            >
              <SlidersHorizontal aria-hidden="true" size={24} />
              Filters
            </button>
          </div>
        </div>
      </section>

      <section
        className="container explore-content"
        aria-labelledby="trip-results-title"
      >
        <aside className="explore-sidebar" aria-label="Trip filters">
          <div className="filter-group">
            <h2>Destination</h2>
            <label className="sidebar-search" htmlFor="destination-filter">
              <Search aria-hidden="true" size={16} />
              <span className="sr-only">Search destination or country</span>
              <input
                id="destination-filter"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(6);
                }}
                placeholder="Search destination or country"
              />
            </label>
          </div>
          <div className="filter-group">
            <h2>Budget per person</h2>
            <div className="range-labels">
              <span>$200</span>
              <span>$5,000+</span>
            </div>
            <label className="range-control">
              <span className="sr-only">Maximum budget per person</span>
              <input
                type="range"
                min="200"
                max="5000"
                step="100"
                value={budget}
                onChange={(event) => {
                  setBudget(Number(event.target.value));
                  setVisibleCount(6);
                }}
              />
            </label>
            <p className="range-value">{budgetText}</p>
          </div>
          <div className="filter-group">
            <h2>Duration</h2>
            <div className="segmented-options">
              {durationOptions.map((item) => (
                <button
                  className={duration === item ? "active" : undefined}
                  type="button"
                  aria-pressed={duration === item}
                  onClick={() => {
                    setDuration(item);
                    setVisibleCount(6);
                  }}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <h2>Trip Type</h2>
            <div className="checkbox-grid">
              {tripTypes.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={tripType === item}
                    onChange={() => {
                      setTripType(item);
                      setVisibleCount(6);
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <h2>Best Time to Go</h2>
            <select
              value={activeQuickFilter === "Season" ? "Summer" : "Anytime"}
              onChange={(event) =>
                setActiveQuickFilter(
                  event.target.value === "Anytime" ? "Anytime" : "Season"
                )
              }
              aria-label="Best time to go"
            >
              <option>Anytime</option>
              <option>Spring</option>
              <option>Summer</option>
              <option>Autumn</option>
              <option>Winter</option>
            </select>
          </div>
          <div className="filter-group">
            <h2>Travel Style</h2>
            <div className="style-tags">
              {styles.map((item) => (
                <button
                  className={travelStyle === item ? "active" : undefined}
                  type="button"
                  aria-pressed={travelStyle === item}
                  onClick={() => {
                    setTravelStyle((current) => (current === item ? "" : item));
                    setVisibleCount(6);
                  }}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <h2>Minimum Rating</h2>
            <div className="range-labels">
              <span>Any rating</span>
              <span>5.0</span>
            </div>
            <label className="range-control">
              <span className="sr-only">Minimum rating</span>
              <input
                type="range"
                min="4"
                max="5"
                step="0.1"
                value={rating}
                onChange={(event) => {
                  setRating(Number(event.target.value));
                  setVisibleCount(6);
                }}
              />
            </label>
            <p className="range-value">{rating.toFixed(1)}+ & above</p>
          </div>
          <div className="filter-group">
            <h2>More Filters</h2>
            <div className="toggle-list">
              <label>
                <span>
                  <strong>Hidden Gems</strong>
                  <small>Show lesser-known places</small>
                </span>
                <input
                  type="checkbox"
                  checked={hiddenGems}
                  onChange={(event) => setHiddenGems(event.target.checked)}
                />
              </label>
              <label>
                <span>
                  <strong>Budget Friendly</strong>
                  <small>Trips that won&apos;t break the bank</small>
                </span>
                <input
                  type="checkbox"
                  checked={budgetFriendly}
                  onChange={(event) => {
                    setBudgetFriendly(event.target.checked);
                    setVisibleCount(6);
                  }}
                />
              </label>
              <label>
                <span>
                  <strong>Family Friendly</strong>
                  <small>Great for all ages</small>
                </span>
                <input
                  type="checkbox"
                  checked={familyFriendly}
                  onChange={(event) => {
                    setFamilyFriendly(event.target.checked);
                    setVisibleCount(6);
                  }}
                />
              </label>
            </div>
          </div>
          <button
            className="clear-filters"
            type="button"
            onClick={resetFilters}
          >
            <RotateCcw aria-hidden="true" size={16} />
            Clear All Filters
          </button>
        </aside>

        <div className="explore-results">
          <div className="category-strip" aria-label="Trip categories">
            {exploreCategories.map((category) => (
              <button
                className={
                  activeCategory === category.label ? "active" : undefined
                }
                type="button"
                aria-pressed={activeCategory === category.label}
                onClick={() => {
                  setActiveCategory(category.label);
                  setVisibleCount(6);
                }}
                key={category.label}
              >
                <Image src={category.image} alt="" fill sizes="130px" />
                <span>
                  {category.label === "All Trips" ? (
                    <Compass aria-hidden="true" size={32} />
                  ) : null}
                </span>
                <strong>{category.label}</strong>
                <small>{category.subtitle}</small>
              </button>
            ))}
            <IconButton
              label="Next category"
              className="category-next"
              onClick={() => {
                const index = exploreCategories.findIndex(
                  (category) => category.label === activeCategory
                );
                setActiveCategory(
                  exploreCategories[(index + 1) % exploreCategories.length]
                    .label
                );
                setVisibleCount(6);
              }}
            >
              <ArrowRight aria-hidden="true" size={22} />
            </IconButton>
          </div>
          <div className="results-toolbar">
            <h2 id="trip-results-title">{filteredTrips.length} trips found</h2>
            <div className="desktop-result-actions">
              <label>
                Sort by:
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setVisibleCount(6);
                  }}
                  aria-label="Sort trips"
                >
                  <option>Newest</option>
                  <option>Recommended</option>
                  <option>Top rated</option>
                  <option>Budget low</option>
                </select>
              </label>
              <IconButton
                label="Grid view"
                className={viewMode === "grid" ? "active" : undefined}
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
              >
                <Grid2X2 aria-hidden="true" size={21} />
              </IconButton>
              <IconButton
                label="List view"
                className={viewMode === "list" ? "active" : undefined}
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
              >
                <List aria-hidden="true" size={21} />
              </IconButton>
            </div>
          </div>
          <div
            className={
              viewMode === "list"
                ? "explore-trip-grid is-list-view"
                : "explore-trip-grid"
            }
          >
            {viewMode === "map" ? (
              <div className="mobile-map-preview" aria-label="Trip map preview">
                {visibleTrips.slice(0, 5).map((trip, index) => (
                  <button
                    type="button"
                    style={{
                      left: 18 + index * 16 + "%",
                      top: 26 + (index % 3) * 18 + "%"
                    }}
                    key={trip.title}
                  >
                    {trip.country}
                  </button>
                ))}
              </div>
            ) : null}
            {visibleTrips.length > 0 ? (
              visibleTrips.map((trip) => (
                <ExploreTripCard trip={trip} key={trip.title} />
              ))
            ) : (
              <p className="empty-results">
                No trips match these filters. Try widening your budget, rating,
                or duration.
              </p>
            )}
          </div>
          {visibleCount < filteredTrips.length ? (
            <Button
              variant="secondary"
              className="load-more-trips"
              onClick={() => setVisibleCount((count) => count + 3)}
            >
              <span>Load More Trips</span>
              <RotateCcw aria-hidden="true" size={16} />
            </Button>
          ) : null}
        </div>
      </section>
      <div className="mobile-applied-filters" role="status">
        <span>
          <SlidersHorizontal aria-hidden="true" size={26} />
        </span>
        <div>
          <strong>Filters applied</strong>
          <p>{appliedSummary}</p>
        </div>
        <button type="button" onClick={resetFilters}>
          Clear all
        </button>
      </div>
    </main>
  );
}
