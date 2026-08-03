import { Quote } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { Testimonial } from "@/types/testimonial";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="testimonial-card">
      <Quote aria-hidden="true" size={30} fill="currentColor" />
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
