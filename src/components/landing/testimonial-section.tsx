"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Testimonial } from "@/types/testimonial";
import { TestimonialCard } from "./testimonial-card";
import { getCommunityReviews, saveCommunityReview } from "@/lib/aftertrip-api";
import { getAuthenticationSession } from "@/lib/auth-client";
import { initials } from "@/lib/api-adapters";
import { useCarouselPagination } from "@/lib/use-carousel-pagination";

export function TestimonialSection() {
  const router = useRouter();
  const rowRef = useRef<HTMLDivElement>(null);
  const [communityRating, setCommunityRating] = useState(5);
  const [communityNote, setCommunityNote] = useState("");
  const [userReviews, setUserReviews] = useState<Testimonial[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const reviews = userReviews;
  const { activePage, pageCount, scrollToPage } = useCarouselPagination(
    rowRef,
    reviews.length
  );

  useEffect(() => {
    let active = true;
    getCommunityReviews(0, 12)
      .then((page) => {
        if (!active || !page.content.length) return;
        setUserReviews(
          page.content
            .filter((review) => review.note)
            .map((review) => ({
              quote: review.note || "",
              name: review.displayName,
              location: review.location || "AfterTrip community",
              rating: review.rating,
              avatar: {
                initials: initials(review.displayName),
                tone: "teal",
                src: review.avatarUrl
              }
            }))
        );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const submitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const note = communityNote.trim();

    if (!getAuthenticationSession()) {
      router.push(`/login?next=${encodeURIComponent("/#reviews")}`);
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const review = await saveCommunityReview(communityRating, note);
      if (review.note) {
        setUserReviews((current) => [
          {
            quote: review.note || "",
            name: review.displayName,
            location: review.location || "AfterTrip community",
            rating: review.rating,
            avatar: {
              initials: initials(review.displayName),
              tone: "teal",
              src: review.avatarUrl
            }
          },
          ...current.filter((item) => item.name !== review.displayName)
        ]);
      }
      setCommunityNote("");
      setMessage(
        review.note ? "Your review is live." : "Your rating has been saved."
      );
      if (review.note) requestAnimationFrame(() => scrollToPage(0));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save your review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="landing-section testimonials-section"
      id="reviews"
      aria-labelledby="testimonials-title"
    >
      <div className="container testimonials-inner">
        <SectionHeading
          titleId="testimonials-title"
          title="Community Reviews"
          copy="Rate AfterTrip. Add a short note only if you would like to share more."
          centered
        />
        <form
          className="community-review-form"
          aria-label="Rate the AfterTrip community"
          onSubmit={submitReview}
        >
          <div>
            <span>Rate the community</span>
            <div className="community-rating-control" role="radiogroup">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={communityRating === value}
                  aria-label={`${value} out of 5 stars`}
                  className={value <= communityRating ? "active" : undefined}
                  onClick={() => setCommunityRating(value)}
                  key={value}
                >
                  <Star
                    aria-hidden="true"
                    fill={value <= communityRating ? "currentColor" : "none"}
                    size={22}
                  />
                </button>
              ))}
            </div>
          </div>
          <label>
            <span className="sr-only">Community review note</span>
            <input
              value={communityNote}
              onChange={(event) => setCommunityNote(event.target.value)}
              placeholder="Add a note (optional)"
              maxLength={180}
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting
              ? "Saving..."
              : communityNote.trim()
                ? "Add Review"
                : "Save Rating"}
          </button>
          {message ? (
            <p className="community-review-message" role="status">
              {message}
            </p>
          ) : null}
        </form>
        {reviews.length ? (
          <>
            <div className="testimonial-grid" ref={rowRef}>
              {reviews.map((testimonial, index) => (
                <TestimonialCard
                  testimonial={testimonial}
                  key={`${testimonial.name}-${index}`}
                />
              ))}
            </div>
            {pageCount > 1 ? (
              <div
                className="pagination-dots"
                aria-label="Traveler testimonial pages"
              >
                {Array.from({ length: pageCount }, (_, index) => (
                  <button
                    type="button"
                    className={activePage === index ? "active" : undefined}
                    aria-label={`Show traveler testimonials page ${index + 1}`}
                    aria-current={activePage === index ? "page" : undefined}
                    onClick={() => scrollToPage(index)}
                    key={index}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <p className="landing-data-empty">
            No written community reviews yet.
          </p>
        )}
      </div>
    </section>
  );
}
