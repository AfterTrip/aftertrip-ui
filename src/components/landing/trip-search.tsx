"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export function TripSearch() {
  const [destination, setDestination] = useState("");

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
      <div className="search-filters" aria-label="Explore trips">
        <button type="submit" className="home-explore-submit">
          <Search aria-hidden="true" size={21} />
          <span>Explore</span>
        </button>
      </div>
    </form>
  );
}
