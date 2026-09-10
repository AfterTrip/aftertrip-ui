"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Heart } from "lucide-react";
import { SharePageButton } from "@/components/ui/share-page-button";
import {
  addBookmark,
  getBookmarkStatus,
  getTripEngagement,
  likeTrip,
  recordTripView,
  removeBookmark,
  unlikeTrip
} from "@/lib/aftertrip-api";
import { getAuthenticationSession } from "@/lib/auth-client";
import { formatCount } from "@/lib/formatters";
import { getVisitorId } from "@/lib/visitor-id";

type TripActionsProps = {
  title: string;
  tripId: string;
  shareText?: string;
};

export function TripActions({ title, tripId, shareText }: TripActionsProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [busyAction, setBusyAction] = useState<"like" | "bookmark" | null>(
    null
  );

  useEffect(() => {
    let active = true;
    void recordTripView(tripId, getVisitorId()).catch(() => undefined);
    getTripEngagement([tripId])
      .then((items) => {
        if (!active || !items[0]) return;
        setLiked(items[0].likedByMe);
        setLikes(items[0].likes);
      })
      .catch(() => undefined);
    if (getAuthenticationSession()) {
      getBookmarkStatus(tripId)
        .then((status) => active && setBookmarked(status.bookmarked))
        .catch(() => undefined);
    }
    return () => {
      active = false;
    };
  }, [tripId]);

  const requireLogin = () => {
    if (getAuthenticationSession()) return true;
    router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    return false;
  };

  const toggleLike = async () => {
    if (!requireLogin() || busyAction) return;
    setBusyAction("like");
    try {
      const result = liked ? await unlikeTrip(tripId) : await likeTrip(tripId);
      setLiked(result.likedByMe);
      setLikes(result.likes);
    } finally {
      setBusyAction(null);
    }
  };

  const toggleBookmark = async () => {
    if (!requireLogin() || busyAction) return;
    setBusyAction("bookmark");
    try {
      if (bookmarked) await removeBookmark(tripId);
      else await addBookmark(tripId);
      setBookmarked((value) => !value);
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <div className="trip-hero-actions" aria-label="Trip actions">
      <SharePageButton title={title} text={shareText} />
      <button
        className={liked ? "active" : undefined}
        type="button"
        aria-label={liked ? "Unlike trip" : "Like trip"}
        aria-pressed={liked}
        title={liked ? "Unlike trip" : "Like trip"}
        onClick={() => void toggleLike()}
        disabled={busyAction === "like"}
      >
        <Heart
          aria-hidden="true"
          fill={liked ? "currentColor" : "none"}
          size={22}
        />
        Like {likes ? formatCount(likes) : ""}
      </button>
      <button
        className={bookmarked ? "active" : undefined}
        type="button"
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark trip"}
        aria-pressed={bookmarked}
        title={bookmarked ? "Remove bookmark" : "Bookmark trip"}
        onClick={() => void toggleBookmark()}
        disabled={busyAction === "bookmark"}
      >
        <Bookmark
          aria-hidden="true"
          fill={bookmarked ? "currentColor" : "none"}
          size={22}
        />
        {bookmarked ? "Remove bookmark" : "Bookmark"}
      </button>
    </div>
  );
}
