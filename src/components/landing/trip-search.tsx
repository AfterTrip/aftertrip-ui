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

  return (
    <form
      className="trip-search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <label className="search-destination" htmlFor="destination">
        <Search aria-hidden="true" size={22} />
        <span className="sr-only">Destination</span>
        <input
          id="destination"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Where do you want to go?"
        />
      </label>
      <div className="search-filters" aria-label="Trip filters">
        {filters.map(({ label, icon: Icon }) => (
          <button type="button" key={label}>
            <Icon aria-hidden="true" size={18} />
            <span>{label}</span>
          </button>
        ))}
        <button type="submit" className="explore-search">
          <Search aria-hidden="true" size={21} />
          <span>Explore</span>
        </button>
      </div>
    </form>
  );
}
