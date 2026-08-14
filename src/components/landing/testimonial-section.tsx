"use client";

import { type FormEvent, useRef, useState } from "react";
import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Testimonial } from "@/types/testimonial";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialSection() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [communityRating, setCommunityRating] = useState(5);
  const [communityNote, setCommunityNote] = useState("");
  const [userReviews, setUserReviews] = useState<Testimonial[]>([]);
  const reviews = [...userReviews, ...testimonials];

  const showTestimonial = (index: number) => {
    const nextIndex = index % reviews.length;
    const row = rowRef.current;
    const card = row?.children.item(nextIndex) as HTMLElement | null;
    card?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
    setActiveIndex(nextIndex);
  };

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const note = communityNote.trim();
    if (!note) return;

    setUserReviews((current) => [
      {
        quote: note,
        name: "You",
        location: "Community review",
        rating: communityRating,
        avatar: { initials: "YO", tone: "teal" }
      },
      ...current
    ]);
    setCommunityNote("");
    setActiveIndex(0);
    requestAnimationFrame(() => showTestimonial(0));
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
          copy="Rate AfterTrip and share a short note for other travelers."
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
              placeholder="Add a short note about your AfterTrip experience"
              maxLength={180}
            />
          </label>
          <button type="submit">Add Review</button>
        </form>
        <div className="testimonial-grid" ref={rowRef}>
          {reviews.map((testimonial, index) => (
            <TestimonialCard
              testimonial={testimonial}
              key={`${testimonial.name}-${index}`}
            />
          ))}
        </div>
        <div
          className="pagination-dots"
          aria-label="Traveler testimonial pages"
        >
          {reviews.map((testimonial, index) => (
            <button
              type="button"
              className={activeIndex === index ? "active" : undefined}
              aria-label={"Show testimonial from " + testimonial.name}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => showTestimonial(index)}
              key={testimonial.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
