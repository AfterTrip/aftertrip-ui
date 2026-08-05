"use client";

import { useState } from "react";
import { CalendarDays, CircleDollarSign, Search, Tags } from "lucide-react";

const filters = [
  { label: "Anytime", icon: CalendarDays },
  { label: "Any budget", icon: CircleDollarSign },
  { label: "Trip type", icon: Tags }
] as const;

export function TripSearch() {
  const [destination, setDestination] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]["label"]>("Anytime");

  return (
    <form className="trip-search" role="search" action="/explore" method="get">
      <label className="search-destination" htmlFor="destination">
        <Search aria-hidden="true" size={22} />
        <span className="sr-only">Destination</span>
        <input
          id="destination"
          name="destination"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Where do you want to go?"
        />
      </label>
      <div className="search-filters" aria-label="Trip filters">
        {filters.map(({ label, icon: Icon }) => (
          <button
            type="button"
            className={activeFilter === label ? "is-active" : undefined}
            aria-pressed={activeFilter === label}
            onClick={() => setActiveFilter(label)}
            key={label}
          >
            <Icon aria-hidden="true" size={18} />
            <span>{label}</span>
          </button>
        ))}
        <button type="submit" className="home-explore-submit">
          <Search aria-hidden="true" size={21} />
          <span>Explore</span>
        </button>
      </div>
    </form>
  );
}
