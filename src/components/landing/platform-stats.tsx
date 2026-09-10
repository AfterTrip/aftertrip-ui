"use client";

import { useCallback, useEffect, useState } from "react";
import { Briefcase, MapPin, Star, UsersRound } from "lucide-react";
import {
  COMMUNITY_RATING_UPDATED_EVENT,
  getCommunityReviewSummary,
  getDestinations,
  getTravelerStatistics,
  searchTrips
} from "@/lib/aftertrip-api";

export function PlatformStats() {
  const [platformStats, setPlatformStats] = useState({
    trips: "-",
    destinations: "-",
    travelers: "-",
    rating: "-"
  });

  const loadStats = useCallback(() => {
    void Promise.all([
      searchTrips({ size: 1 }),
      getDestinations(1),
      getTravelerStatistics(),
      getCommunityReviewSummary()
    ])
      .then(([trips, destinations, travelers, reviews]) => {
        setPlatformStats({
          trips: String(trips.totalElements),
          destinations: String(destinations.totalElements),
          travelers: String(travelers.registeredTravelers),
          rating: reviews.reviewCount
            ? `${Number(reviews.averageRating).toFixed(1)}/5`
            : "N/A"
        });
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    loadStats();
    window.addEventListener(COMMUNITY_RATING_UPDATED_EVENT, loadStats);
    return () =>
      window.removeEventListener(COMMUNITY_RATING_UPDATED_EVENT, loadStats);
  }, [loadStats]);

  const stats = [
    { value: platformStats.trips, label: "Published Trips", icon: Briefcase },
    { value: platformStats.destinations, label: "Destinations", icon: MapPin },
    { value: platformStats.travelers, label: "Travelers", icon: UsersRound },
    { value: platformStats.rating, label: "Community Rating", icon: Star }
  ] as const;

  return (
    <div className="platform-stats" aria-label="AfterTrip platform statistics">
      {stats.map(({ value, label, icon: Icon }) => (
        <div className="stat-item" key={label}>
          <Icon aria-hidden="true" size={24} />
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
