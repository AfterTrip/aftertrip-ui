import { Quote, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { Testimonial } from "@/types/testimonial";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const rating = testimonial.rating ?? 5;

  return (
    <article className="testimonial-card">
      <div className="testimonial-card-topline">
        <Quote aria-hidden="true" size={30} fill="currentColor" />
        <span aria-label={`${rating} out of 5 community rating`}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              aria-hidden="true"
              fill={value <= rating ? "currentColor" : "none"}
              size={15}
              key={value}
            />
          ))}
        </span>
      </div>
      <p>{testimonial.quote}</p>
      <div className="testimonial-author">
        <Avatar
          initials={testimonial.avatar.initials}
          tone={testimonial.avatar.tone}
          label={`${testimonial.name} avatar`}
        />
        <div>
          <h3>{testimonial.name}</h3>
          <span>{testimonial.location}</span>
        </div>
      </div>
    </article>
  );
}
