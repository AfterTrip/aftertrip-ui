import { Map, Send, UsersRound } from "lucide-react";
import Link from "next/link";
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
    <section
      className="landing-section how-section"
      id="how-it-works"
      aria-labelledby="how-title"
    >
      <div className="container">
        <h2 id="how-title">How AfterTrip Works</h2>
        <div className="steps-row">
          {steps.map(({ title, copy, icon: Icon }, index) => (
            <article className="step-card" key={title}>
              <span className="step-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="step-icon">
                <Icon aria-hidden="true" size={25} strokeWidth={1.7} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
        <Button asChild>
          <Link href="/dashboard/create-trip">Share Your Journey</Link>
        </Button>
      </div>
    </section>
  );
}
