import { testimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialSection() {
  return (
    <section className="landing-section testimonials-section" aria-labelledby="testimonials-title">
      <div className="container testimonials-inner">
        <SectionHeading
          titleId="testimonials-title"
          title="Loved by Travelers"
          copy="A community built on trust, stories, and real experiences."
          centered
        />
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <TestimonialCard testimonial={testimonial} key={testimonial.name} />
          ))}
        </div>
        <div className="pagination-dots" aria-hidden="true">
          <span className="active" />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
