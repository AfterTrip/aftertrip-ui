"use client";

import { useState } from "react";
import { Bookmark, Heart, Share2 } from "lucide-react";

type TripActionsProps = {
  title: string;
};

export function TripActions({ title }: TripActionsProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const shareTrip = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard?.writeText(url);
    } catch {
      // Ignore cancelled native share sheets.
    }
  };

  return (
    <div className="trip-hero-actions" aria-label="Trip actions">
      <button type="button" onClick={shareTrip}>
        <Share2 aria-hidden="true" size={22} />
        Share
      </button>
      <button
        className={liked ? "active" : undefined}
        type="button"
        aria-pressed={liked}
        onClick={() => setLiked((value) => !value)}
      >
        <Heart
          aria-hidden="true"
          fill={liked ? "currentColor" : "none"}
          size={22}
        />
        Like
      </button>
      <button
        className={bookmarked ? "active" : undefined}
        type="button"
        aria-pressed={bookmarked}
        onClick={() => setBookmarked((value) => !value)}
      >
        <Bookmark
          aria-hidden="true"
          fill={bookmarked ? "currentColor" : "none"}
          size={22}
        />
        Bookmark
      </button>
    </div>
  );
}
