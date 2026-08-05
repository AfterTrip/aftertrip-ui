import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  LockKeyhole,
  Map,
  Send,
  UsersRound
} from "lucide-react";

const benefits = [
  {
    title: "Save trips",
    copy: "Keep all your itineraries and ideas in one place.",
    mobileCopy:
      "Bookmark destinations and create lists for your next adventure.",
    icon: Bookmark
  },
  {
    title: "Publish your journey",
    copy: "Share your adventures and inspire travelers.",
    mobileCopy: "Share your trips in minutes and inspire other travelers.",
    icon: Send
  },
  {
    title: "Access anywhere",
    copy: "Find your favorite places anytime, anywhere.",
    mobileCopy:
      "Your trips, bookmarks, and stories available on all your devices.",
    icon: Map
  }
];

function GoogleMark() {
  return (
    <span className="google-mark" aria-hidden="true">
      <i>G</i>
    </span>
  );
}

export function AuthPage() {
  return (
    <main id="main-content" className="auth-page">
      <nav className="auth-top-links" aria-label="Authentication navigation">
        <Link href="/explore">Explore</Link>
        <span aria-hidden="true" />
        <Link href="/">
          <ArrowLeft aria-hidden="true" size={18} />
          Back to home
        </Link>
      </nav>

      <section className="auth-desktop-shell" aria-labelledby="auth-title">
        <div className="auth-visual-panel">
          <Image
            src="/images/hero/mountain-lake-traveler.png"
            alt="Traveler seated beside a calm alpine lake"
            fill
            priority
            sizes="50vw"
            className="auth-visual-image"
          />
          <div className="auth-visual-overlay" />
          <div className="auth-visual-copy">
            <h1>Real journeys. Beautifully shared.</h1>
            <i aria-hidden="true" />
            <p>
              Sign in to save your trips, publish your journeys, and continue
              planning your next adventure.
            </p>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-card-heading">
              <h2 id="auth-title">Continue to AfterTrip</h2>
              <p>
                Use your Google account to sign in or create your account in
                seconds.
              </p>
            </div>
            <div className="auth-benefit-list desktop-auth-benefits">
              {benefits.map(({ title, copy, icon: Icon }) => (
                <article key={title}>
                  <span>
                    <Icon aria-hidden="true" size={25} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </article>
              ))}
            </div>
            <button className="google-auth-button" type="button">
              <GoogleMark />
              Continue with Google
            </button>
            <p className="auth-terms">
              By continuing, you agree to our <Link href="#terms">Terms</Link>{" "}
              and <Link href="#privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>

      <section
        className="auth-mobile-shell"
        aria-labelledby="mobile-auth-title"
      >
        <div className="auth-mobile-hero">
          <Image
            src="/images/hero/mountain-lake-traveler.png"
            alt="Traveler looking across a mountain lake"
            fill
            priority
            sizes="100vw"
            className="auth-mobile-image"
          />
          <div className="auth-mobile-overlay" />
          <div className="auth-mobile-copy">
            <h1>Start your next journey with real stories.</h1>
            <p>
              Join a community of travelers and discover places through real
              experiences.
            </p>
          </div>
        </div>

        <div className="auth-mobile-card">
          <h2 id="mobile-auth-title">Continue to AfterTrip</h2>
          <p>Sign in or create your account instantly with Google.</p>
          <button className="google-auth-button" type="button">
            <GoogleMark />
            Continue with Google
          </button>
          <div className="mobile-auth-terms">
            <LockKeyhole aria-hidden="true" size={26} />
            <p>
              By continuing, you agree to our{" "}
              <Link href="#terms">Terms of Use</Link> and{" "}
              <Link href="#privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        <div className="auth-benefit-list mobile-auth-benefits">
          {benefits.map(({ title, mobileCopy, icon: Icon }, index) => {
            const MobileIcon = index === 2 ? UsersRound : Icon;
            return (
              <article key={title}>
                <span>
                  <MobileIcon aria-hidden="true" size={34} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{mobileCopy}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="auth-footer">
        <div className="auth-footer-brand">
          <Link
            href="/"
            className="auth-footer-logo"
            aria-label="AfterTrip home"
          >
            <Image
              src="/brand/aftertrip-mark.svg"
              alt=""
              width={30}
              height={30}
            />
            <span>AfterTrip</span>
          </Link>
          <p>Real journeys. Beautifully shared.</p>
        </div>
        <nav aria-label="Auth footer links">
          <Link href="#help">Help Center</Link>
          <Link href="#terms">Terms of Use</Link>
          <Link href="#privacy">Privacy Policy</Link>
          <Link href="#contact">Contact</Link>
        </nav>
        <small>© 2026 AfterTrip. All rights reserved.</small>
      </footer>
    </main>
  );
}
