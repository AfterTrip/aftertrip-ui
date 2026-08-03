import { ArrowRight, ChevronRight, Map, Send, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Discover",
    copy: "Explore real trips shared by travelers like you.",
    icon: Map
  },
  {
    title: "Get Inspired",
    copy: "Find ideas, tips, and hidden gems for your next adventure.",
    icon: UsersRound
  },
  {
    title: "Share Your Journey",
    copy: "Publish your trip in minutes and inspire the next traveler.",
    icon: Send
  }
] as const;

export function HowItWorksSection() {
  return (
    <section className="landing-section how-section" id="how-it-works" aria-labelledby="how-title">
      <div className="container">
        <h2 id="how-title">How AfterTrip Works</h2>
        <div className="steps-row">
          {steps.map(({ title, copy, icon: Icon }, index) => (
            <div className="step-with-arrow" key={title}>
              <article className="step-card">
                <span className="step-icon">
                  <Icon aria-hidden="true" size={28} strokeWidth={1.7} />
                </span>
                <div>
                  <h3>
                    {index + 1}. {title}
                  </h3>
                  <p>{copy}</p>
                </div>
                <ChevronRight className="mobile-step-chevron" aria-hidden="true" size={24} />
              </article>
              {index < steps.length - 1 ? (
                <ArrowRight className="desktop-step-arrow" aria-hidden="true" size={26} />
              ) : null}
            </div>
          ))}
        </div>
        <Button>Start Your Journey</Button>
      </div>
    </section>
  );
}
