"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Eye,
  Grid2X2,
  Heart,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  exploreCategories
} from "@/data/explore-categories";
import type { ExploreTrip, TripGroup, TripStyle } from "@/types/explore-trip";
import {
  getProfiles,
  getTripEngagement,
  searchTrips,
  type ApiDiscoveryTrip,
  type ApiTripEngagement,
  type TripGroup as ApiTripGroup,
  type TripSearch,
  type TripStyle as ApiTripStyle
} from "@/lib/aftertrip-api";
import { discoveryTripToExploreTrip } from "@/lib/api-adapters";

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
type ExploreSort = "Newest" | "Popular" | "Oldest";

const sortOptions: ExploreSort[] = ["Newest", "Popular", "Oldest"];

const toApiEnum = (value: string) =>
  value.trim().toUpperCase().replaceAll(" ", "_");

function durationBounds(duration: string) {
  if (duration === "1-3 days") return { minDurationDays: 1, maxDurationDays: 3 };
  if (duration === "4-7 days") return { minDurationDays: 4, maxDurationDays: 7 };
  if (duration === "8-14 days") return { minDurationDays: 8, maxDurationDays: 14 };
  if (duration === "15+ days") return { minDurationDays: 15 };
  return {};
}

function batches<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size)
  );
}

async function loadTripPool(
  search: TripSearch,
  sort: ExploreSort,
  visibleCount: number
) {
  const apiSort = sort === "Oldest" ? "OLDEST" : "NEWEST";
  const first = await searchTrips({ ...search, sort: apiSort, page: 0, size: 50 });
  const pagesNeeded =
    sort === "Popular"
      ? first.totalPages
      : Math.min(first.totalPages, Math.ceil(visibleCount / 50));
  const remaining = await Promise.all(
    Array.from({ length: Math.max(0, pagesNeeded - 1) }, (_, index) =>
      searchTrips({ ...search, sort: apiSort, page: index + 1, size: 50 })
    )
  );
  return {
    content: [first, ...remaining].flatMap((page) => page.content),
    totalElements: first.totalElements
  };
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
              src={trip.authorAvatarUrl}
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
          <strong>{trip.price}</strong>
          <small>{trip.budgetLabel}</small>
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
  const [sortBy, setSortBy] = useState<ExploreSort>("Newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(6);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [trips, setTrips] = useState<ExploreTrip[]>([]);
  const [totalTrips, setTotalTrips] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const budgetConfig = budgetCurrencies[budgetCurrency];
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

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
    const activeCategoryConfig = exploreCategories.find(
      (category) => category.label === activeCategory
    );
      const requestedStyles = [
        ...selectedStyles,
        ...(activeCategoryConfig?.style ? [activeCategoryConfig.style] : [])
      ];
      setLoading(true);
      setLoadError("");
      const filters: TripSearch = {
        q: query.trim() || undefined,
        tripGroups: selectedGroups.map(toApiEnum) as ApiTripGroup[],
        styles: [...new Set(requestedStyles)].map(toApiEnum) as ApiTripStyle[],
        ...durationBounds(duration),
        budgetCurrency,
        maxBudget: budget < budgetConfig.max ? budget : undefined
      };
      loadTripPool(filters, sortBy, visibleCount)
        .then(async (page) => {
          const tripIds = page.content.map((trip) => trip.tripId);
          const ownerIds = [...new Set(page.content.map((trip) => trip.ownerUserId))];
          const [profileBatches, engagementBatches] = await Promise.all([
            Promise.all(batches(ownerIds, 50).map((ids) => getProfiles(ids))),
            Promise.all(batches(tripIds, 50).map((ids) => getTripEngagement(ids)))
          ]);
          if (!active) return;
          const profiles = profileBatches.flat();
          const engagement = engagementBatches.flat();
          const engagementFor = (trip: ApiDiscoveryTrip): ApiTripEngagement | undefined =>
            engagement.find((item) => item.tripId === trip.tripId);
          const ordered =
            sortBy === "Popular"
              ? [...page.content].sort((left, right) => {
                  const leftMetrics = engagementFor(left);
                  const rightMetrics = engagementFor(right);
                  return (
                    (rightMetrics?.likes ?? 0) - (leftMetrics?.likes ?? 0) ||
                    (rightMetrics?.views ?? 0) - (leftMetrics?.views ?? 0) ||
                    new Date(right.publishedAt).getTime() -
                      new Date(left.publishedAt).getTime()
                  );
                })
              : page.content;
          setTrips(
            ordered.slice(0, visibleCount).map((trip) =>
              discoveryTripToExploreTrip(
                trip,
                profiles.find((profile) => profile.userId === trip.ownerUserId),
                engagementFor(trip)
              )
            )
          );
          setTotalTrips(page.totalElements);
        })
        .catch(() => {
          if (!active) return;
          setTrips([]);
          setTotalTrips(0);
          setLoadError(
            "Trips could not load right now. Please try again shortly."
          );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [
    activeCategory,
    budget,
    budgetConfig.max,
    budgetCurrency,
    duration,
    query,
    selectedGroups,
    selectedStyles,
    sortBy,
    visibleCount
  ]);

  const visibleTrips = trips;
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
            onSubmit={(event) => event.preventDefault()}
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
            <Button type="submit" aria-label="Search trips">
              <Search
                className="explore-search-button-icon"
                aria-hidden="true"
                size={20}
              />
              <span>Explore</span>
            </Button>
          </form>
          <div className="mobile-sort-bar">
            <label className="mobile-sort-select">
              <strong>Sort by:</strong>
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value as ExploreSort);
                  setVisibleCount(6);
                }}
                aria-label="Sort trips"
              >
                {sortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" size={16} />
            </label>
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
            <h2 id="trip-results-title">{totalTrips} trips found</h2>
            <div className="desktop-result-actions">
              <label>
                Sort by:
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value as ExploreSort);
                    setVisibleCount(6);
                  }}
                  aria-label="Sort trips"
                >
                  {sortOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
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
            {loading && visibleTrips.length === 0 ? (
              <p className="empty-results">Loading real journeys...</p>
            ) : loadError ? (
              <p className="empty-results" role="alert">{loadError}</p>
            ) : visibleTrips.length > 0 ? (
              visibleTrips.map((trip) => (
                <ExploreTripCard trip={trip} key={trip.slug} />
              ))
            ) : (
              <p className="empty-results">
                No trips match these filters. Try widening your budget, group,
                style, or duration.
              </p>
            )}
          </div>
          {visibleCount < totalTrips ? (
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
            <span>{totalTrips} trips match</span>
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
