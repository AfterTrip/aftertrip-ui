import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublishCtaSection() {
  return (
    <section
      className="publish-cta-section"
      id="publish"
      aria-labelledby="publish-title"
    >
      <div className="container">
        <div className="publish-card">
          <Image
            src="/images/cta/share-adventure.png"
            alt="Traveler overlooking a mountain lake before sharing a completed journey"
            fill
            sizes="(max-width: 767px) 90vw, 1280px"
            className="publish-image"
          />
          <div className="publish-overlay" />
          <div className="publish-content">
            <div>
              <h2 id="publish-title">Ready to share your next adventure?</h2>
              <p>
                Join thousands of travelers sharing real journeys every day.
              </p>
            </div>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/dashboard/create-trip">
                <Send aria-hidden="true" size={21} />
                Publish Your Trip
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
