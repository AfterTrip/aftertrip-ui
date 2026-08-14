"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Eye,
  Grid2X2,
  Heart,
  List,
  Map,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  exploreCategories,
  exploreTrips,
  type ExploreTrip,
  type TripGroup,
  type TripStyle
} from "@/data/explore-trips";

const durationOptions = [
  "Any",
  "1-3 days",
  "4-7 days",
  "8-14 days",
  "15+ days"
];
const tripGroups: Array<"Any" | TripGroup> = [
  "Any",
  "Solo",
  "Friends",
  "Couple",
  "Family",
  "Group",
  "Other"
];

const styles: TripStyle[] = [
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

const budgetCurrencies = {
  INR: {
    label: "INR",
    symbol: "₹",
    min: 1000,
    max: 500000,
    step: 1000,
    toUsd: (value: number) => value / 80
  },
  USD: {
    label: "USD",
    symbol: "$",
    min: 15,
    max: 6250,
    step: 25,
    toUsd: (value: number) => value
  }
} as const;

type BudgetCurrency = keyof typeof budgetCurrencies;

function tripDays(trip: ExploreTrip) {
  return Number(trip.duration.replace(/[^0-9]/g, ""));
}

function matchesDuration(trip: ExploreTrip, duration: string) {
  const days = tripDays(trip);
  if (duration === "1-3 days") return days <= 3;
  if (duration === "4-7 days") return days >= 4 && days <= 7;
  if (duration === "8-14 days") return days >= 8 && days <= 14;
  if (duration === "15+ days") return days >= 15;
  return true;
}

function ExploreTripCard({ trip }: { trip: ExploreTrip }) {
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
      <div className="explore-card-content">
        <h2>
          <Link href={`/trips/${trip.slug}`}>{trip.title}</Link>
        </h2>
        <p className="trip-place">{trip.place}</p>
        <div className="explore-card-styles">
          {trip.styles.slice(0, 2).map((style) => (
            <span key={style}>{style}</span>
          ))}
        </div>
        <div className="explore-card-meta">
          <Link
            className="explore-author-link"
            href={`/travelers/${trip.authorSlug}`}
          >
            <Avatar
              initials={trip.initials}
              tone={trip.avatarTone}
              label={trip.author + " avatar"}
            />
            By {trip.author}
          </Link>
          <span className="explore-card-engagement">
            <Eye aria-hidden="true" size={15} />
            {trip.views}
            <Heart aria-hidden="true" size={15} />
            {trip.likes}
          </span>
          <strong>{trip.price}</strong>
        </div>
        <div className="mobile-budget-row">
          <span>{trip.group}</span>
          <i />
          {trip.budgetLabel}
        </div>
      </div>
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
  const [duration, setDuration] = useState("Any");
  const [selectedGroups, setSelectedGroups] = useState<TripGroup[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<TripStyle[]>([]);
  const [budgetCurrency, setBudgetCurrency] = useState<BudgetCurrency>("INR");
  const [budget, setBudget] = useState<number>(budgetCurrencies.INR.max);
  const [sortBy, setSortBy] = useState("Newest");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [visibleCount, setVisibleCount] = useState(6);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const budgetConfig = budgetCurrencies[budgetCurrency];
  const budgetLimitUsd = budgetConfig.toUsd(budget);
  const budgetProgress =
    ((budget - budgetConfig.min) / (budgetConfig.max - budgetConfig.min)) * 100;
  const budgetRangeStyle = {
    "--range-progress": `${Math.max(0, Math.min(100, budgetProgress))}%`
  } as CSSProperties;

  const formatBudget = (value: number, currency = budgetCurrency) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    }).format(value);

  const switchBudgetCurrency = (nextCurrency: BudgetCurrency) => {
    if (nextCurrency === budgetCurrency) return;
    const currentUsd = budgetCurrencies[budgetCurrency].toUsd(budget);
    const nextConfig = budgetCurrencies[nextCurrency];
    const converted =
      nextCurrency === "INR"
        ? Math.round(currentUsd * 80)
        : Math.round(currentUsd);
    setBudgetCurrency(nextCurrency);
    setBudget(Math.max(nextConfig.min, Math.min(nextConfig.max, converted)));
    setVisibleCount(6);
  };

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("All Trips");
    setDuration("Any");
    setSelectedGroups([]);
    setSelectedStyles([]);
    setBudgetCurrency("INR");
    setBudget(budgetCurrencies.INR.max);
    setSortBy("Newest");
    setVisibleCount(6);
  };

  const filteredTrips = useMemo(() => {
    const activeCategoryConfig = exploreCategories.find(
      (category) => category.label === activeCategory
    );
    const normalizedQuery = query.trim().toLowerCase();
    const results = exploreTrips.filter((trip) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          trip.title,
          trip.country,
          trip.place,
          trip.author,
          trip.group,
          ...trip.styles
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesCategory =
        !activeCategoryConfig?.style ||
        trip.styles.includes(activeCategoryConfig.style);
      const matchesBudget = trip.budgetAmount <= budgetLimitUsd;
      const matchesDurationFilter = matchesDuration(trip, duration);
      const matchesTripGroup =
        selectedGroups.length === 0 || selectedGroups.includes(trip.group);
      const matchesStyle =
        selectedStyles.length === 0 ||
        selectedStyles.some((style) => trip.styles.includes(style));
      return (
        matchesQuery &&
        matchesCategory &&
        matchesBudget &&
        matchesDurationFilter &&
        matchesTripGroup &&
        matchesStyle
      );
    });

    return [...results].sort((a, b) => {
      if (sortBy === "Shortest") return tripDays(a) - tripDays(b);
      return exploreTrips.indexOf(a) - exploreTrips.indexOf(b);
    });
  }, [
    activeCategory,
    budgetLimitUsd,
    duration,
    query,
    selectedGroups,
    selectedStyles,
    sortBy
  ]);

  const visibleTrips = filteredTrips.slice(0, visibleCount);
  const mobileFilterCount = [
    duration !== "Any",
    budget < budgetConfig.max,
    selectedGroups.length > 0,
    selectedStyles.length > 0
  ].filter(Boolean).length;
  const budgetText = `${formatBudget(budgetConfig.min)} - ${formatBudget(budget)}`;
  const appliedSummary = [
    duration,
    "up to " + formatBudget(budget),
    selectedGroups.length ? selectedGroups.join(", ") : "Any type",
    selectedStyles.length ? selectedStyles.join(", ") : "Any vibe"
  ].join(" • ");

  const toggleGroup = (group: TripGroup) => {
    setSelectedGroups((current) =>
      current.includes(group)
        ? current.filter((item) => item !== group)
        : [...current, group]
    );
    setVisibleCount(6);
  };

  const toggleStyle = (style: TripStyle) => {
    setSelectedStyles((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style]
    );
    setVisibleCount(6);
  };

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
          <div className="mobile-sort-bar">
            <button
              type="button"
              onClick={() => {
                setSortBy(sortBy === "Newest" ? "Shortest" : "Newest");
                setVisibleCount(6);
              }}
            >
              <strong>Sort by:</strong> {sortBy}{" "}
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
              aria-controls="mobile-filter-drawer"
              onClick={() => setMobileFiltersOpen(true)}
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
            <div className="filter-heading-row">
              <h2>Budget per person</h2>
              <div
                className="budget-currency-toggle"
                aria-label="Budget currency"
              >
                {(["INR", "USD"] as BudgetCurrency[]).map((currency) => (
                  <button
                    className={
                      budgetCurrency === currency ? "active" : undefined
                    }
                    type="button"
                    aria-pressed={budgetCurrency === currency}
                    onClick={() => switchBudgetCurrency(currency)}
                    key={currency}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>
            <div className="range-labels">
              <span>{formatBudget(budgetConfig.min)}</span>
              <span>{formatBudget(budgetConfig.max)}+</span>
            </div>
            <label className="range-control">
              <span className="sr-only">Maximum budget per person</span>
              <input
                type="range"
                min={budgetConfig.min}
                max={budgetConfig.max}
                step={budgetConfig.step}
                value={budget}
                style={budgetRangeStyle}
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
            <h2>Trip type</h2>
            <div className="checkbox-grid">
              {tripGroups.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={
                      item === "Any"
                        ? selectedGroups.length === 0
                        : selectedGroups.includes(item)
                    }
                    onChange={() => {
                      if (item === "Any") {
                        setSelectedGroups([]);
                        setVisibleCount(6);
                      } else {
                        toggleGroup(item);
                      }
                    }}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <h2>Trip vibe</h2>
            <div className="style-tags">
              <button
                className={selectedStyles.length === 0 ? "active" : undefined}
                type="button"
                aria-pressed={selectedStyles.length === 0}
                onClick={() => {
                  setSelectedStyles([]);
                  setVisibleCount(6);
                }}
              >
                Any
              </button>
              {styles.map((item) => (
                <button
                  className={
                    selectedStyles.includes(item) ? "active" : undefined
                  }
                  type="button"
                  aria-pressed={selectedStyles.includes(item)}
                  onClick={() => toggleStyle(item)}
                  key={item}
                >
                  {item}
                </button>
              ))}
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
                  <option>Shortest</option>
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
                No trips match these filters. Try widening your budget, group,
                style, or duration.
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
      <div
        className={
          mobileFiltersOpen
            ? "mobile-filter-overlay open"
            : "mobile-filter-overlay"
        }
        aria-hidden={!mobileFiltersOpen}
        hidden={!mobileFiltersOpen}
        onClick={() => setMobileFiltersOpen(false)}
      />
      <aside
        id="mobile-filter-drawer"
        className={
          mobileFiltersOpen
            ? "mobile-filter-drawer open"
            : "mobile-filter-drawer"
        }
        aria-label="Mobile trip filters"
        role="dialog"
        aria-modal="true"
        hidden={!mobileFiltersOpen}
      >
        <div className="mobile-filter-header">
          <div>
            <strong>Filters</strong>
            <span>{filteredTrips.length} trips match</span>
          </div>
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <X aria-hidden="true" size={22} />
          </button>
        </div>
        <div className="mobile-filter-body">
          <div className="filter-group">
            <h2>Budget per person</h2>
            <div className="mobile-budget-head">
              <p>{budgetText}</p>
              <div
                className="budget-currency-toggle"
                aria-label="Budget currency"
              >
                {(["INR", "USD"] as BudgetCurrency[]).map((currency) => (
                  <button
                    className={
                      budgetCurrency === currency ? "active" : undefined
                    }
                    type="button"
                    aria-pressed={budgetCurrency === currency}
                    onClick={() => switchBudgetCurrency(currency)}
                    key={currency}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            </div>
            <div className="range-labels">
              <span>{formatBudget(budgetConfig.min)}</span>
              <span>{formatBudget(budgetConfig.max)}+</span>
            </div>
            <label className="range-control">
              <span className="sr-only">Maximum budget per person</span>
              <input
                type="range"
                min={budgetConfig.min}
                max={budgetConfig.max}
                step={budgetConfig.step}
                value={budget}
                style={budgetRangeStyle}
                onChange={(event) => {
                  setBudget(Number(event.target.value));
                  setVisibleCount(6);
                }}
              />
            </label>
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
            <h2>Trip type</h2>
            <div className="style-tags">
              <button
                className={selectedGroups.length === 0 ? "active" : undefined}
                type="button"
                aria-pressed={selectedGroups.length === 0}
                onClick={() => {
                  setSelectedGroups([]);
                  setVisibleCount(6);
                }}
              >
                Any
              </button>
              {tripGroups
                .filter((group): group is TripGroup => group !== "Any")
                .map((group) => (
                  <button
                    className={
                      selectedGroups.includes(group) ? "active" : undefined
                    }
                    type="button"
                    aria-pressed={selectedGroups.includes(group)}
                    onClick={() => toggleGroup(group)}
                    key={group}
                  >
                    {group}
                  </button>
                ))}
            </div>
          </div>
          <div className="filter-group">
            <h2>Trip style</h2>
            <div className="style-tags">
              <button
                className={selectedStyles.length === 0 ? "active" : undefined}
                type="button"
                aria-pressed={selectedStyles.length === 0}
                onClick={() => {
                  setSelectedStyles([]);
                  setVisibleCount(6);
                }}
              >
                Any
              </button>
              {styles.map((item) => (
                <button
                  className={
                    selectedStyles.includes(item) ? "active" : undefined
                  }
                  type="button"
                  aria-pressed={selectedStyles.includes(item)}
                  onClick={() => toggleStyle(item)}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mobile-filter-actions">
          <button type="button" onClick={resetFilters}>
            Clear all
          </button>
          <button type="button" onClick={() => setMobileFiltersOpen(false)}>
            Apply filters
          </button>
        </div>
      </aside>
      {mobileFilterCount > 0 ? (
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
      ) : null}
    </main>
  );
}
