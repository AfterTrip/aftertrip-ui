"use client";

import { useRef, useState } from "react";
import { testimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialSection() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const showTestimonial = (index: number) => {
    const nextIndex = index % testimonials.length;
    const row = rowRef.current;
    const card = row?.children.item(nextIndex) as HTMLElement | null;
    card?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
    setActiveIndex(nextIndex);
  };

  return (
    <section
      className="landing-section testimonials-section"
      aria-labelledby="testimonials-title"
    >
      <div className="container testimonials-inner">
        <SectionHeading
          titleId="testimonials-title"
          title="Loved by Travelers"
          copy="A community built on trust, stories, and real experiences."
          centered
        />
        <div className="testimonial-grid" ref={rowRef}>
          {testimonials.map((testimonial) => (
            <TestimonialCard testimonial={testimonial} key={testimonial.name} />
          ))}
        </div>
        <div
          className="pagination-dots"
          aria-label="Traveler testimonial pages"
        >
          {testimonials.map((testimonial, index) => (
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
