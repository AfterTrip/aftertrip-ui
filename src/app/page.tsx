import { FeaturedTripsSection } from "@/components/landing/featured-trips-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PopularDestinationsSection } from "@/components/landing/popular-destinations-section";
import { PublishCtaSection } from "@/components/landing/publish-cta-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";

export default function Home() {
  return (
    <main id="main-content">
      <HeroSection />
      <div className="content-shell">
        <FeaturedTripsSection />
        <PopularDestinationsSection />
        <HowItWorksSection />
        <TestimonialSection />
        <PublishCtaSection />
      </div>
    </main>
  );
}
