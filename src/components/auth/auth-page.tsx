"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  LockKeyhole,
  Map,
  Send,
  UsersRound
} from "lucide-react";
import {
  authenticateWithGoogle,
  saveAuthenticationSession
} from "@/lib/auth-client";
import { getOwnProfile } from "@/lib/aftertrip-api";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdentityApi {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    ux_mode: "popup";
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type: "standard";
      theme: "outline";
      size: "large";
      shape: "rectangular";
      text: "continue_with";
      width: number;
    }
  ) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleIdentityApi;
      };
    };
  }
}

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

export function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const desktopGoogleButtonRef = useRef<HTMLDivElement>(null);
  const mobileGoogleButtonRef = useRef<HTMLDivElement>(null);
  const googleInitializedRef = useRef(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const [authStatus, setAuthStatus] = useState<"idle" | "signing-in" | "error">(
    googleClientId ? "idle" : "error"
  );
  const [authMessage, setAuthMessage] = useState(
    googleClientId
      ? ""
      : "Google sign-in is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID and restart the frontend."
  );

  const handleGoogleCredential = useCallback(
    async ({ credential }: GoogleCredentialResponse) => {
      setAuthStatus("signing-in");
      setAuthMessage("Signing you in securely...");

      try {
        const session = await authenticateWithGoogle(credential);
        saveAuthenticationSession(session);
        await getOwnProfile();
        const requestedPath = searchParams.get("next");
        const nextPath =
          requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
            ? requestedPath
            : "/dashboard";
        router.replace(nextPath);
        router.refresh();
      } catch (error) {
        setAuthStatus("error");
        setAuthMessage(
          error instanceof Error
            ? error.message
            : "AfterTrip could not complete the sign-in. Please try again."
        );
      }
    },
    [router, searchParams]
  );

  const initializeGoogleSignIn = useCallback(() => {
    if (googleInitializedRef.current || !googleClientId || !window.google) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
      ux_mode: "popup"
    });

    googleInitializedRef.current = true;
    setGoogleReady(true);
    setAuthStatus("idle");
    setAuthMessage("");
  }, [googleClientId, handleGoogleCredential]);

  useEffect(() => {
    if (!googleReady || !window.google) return;

    const hosts = [desktopGoogleButtonRef.current, mobileGoogleButtonRef.current].filter(
      (host): host is HTMLDivElement => host !== null
    );

    const renderHost = (host: HTMLDivElement) => {
      if (host.clientWidth <= 0) return;

      const width = Math.min(396, Math.max(200, Math.floor(host.clientWidth - 4)));
      if (host.dataset.googleButtonWidth === String(width) && host.children.length) {
        return;
      }

      host.replaceChildren();
      window.google?.accounts.id.renderButton(host, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width
      });
      host.dataset.googleButtonWidth = String(width);
    };

    const observers = hosts.map((host) => {
      renderHost(host);
      const observer = new ResizeObserver(() => renderHost(host));
      observer.observe(host);
      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [googleReady]);

  const renderAuthStatus = () =>
    authMessage ? (
      <p
        className={`auth-status ${authStatus === "error" ? "is-error" : ""}`}
        role={authStatus === "error" ? "alert" : "status"}
      >
        {authMessage}
      </p>
    ) : null;

  return (
    <main id="main-content" className="auth-page">
      <Script
        id="google-identity-services"
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={initializeGoogleSignIn}
        onError={() => {
          setAuthStatus("error");
          setAuthMessage(
            "Google sign-in could not load. Check your connection and try again."
          );
        }}
      />
      <nav className="auth-top-links" aria-label="Authentication navigation">
        <ThemeToggle />
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
            <div className="google-auth-control">
              <div
                ref={desktopGoogleButtonRef}
                className="google-auth-button-host"
                aria-label="Continue with Google"
              />
              {renderAuthStatus()}
            </div>
            <p className="auth-terms">
              By continuing, you agree to our{" "}
              <Link href="/legal#terms">Terms</Link> and{" "}
              <Link href="/legal#privacy">Privacy Policy</Link>.
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
          <div className="google-auth-control">
            <div
              ref={mobileGoogleButtonRef}
              className="google-auth-button-host"
              aria-label="Continue with Google"
            />
            {renderAuthStatus()}
          </div>
          <div className="mobile-auth-terms">
            <LockKeyhole aria-hidden="true" size={26} />
            <p>
              By continuing, you agree to our{" "}
              <Link href="/legal#terms">Terms of Use</Link> and{" "}
              <Link href="/legal#privacy">Privacy Policy</Link>.
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
              src="/brand/aftertrip-logo-green.png"
              alt=""
              width={160}
              height={53}
            />
          </Link>
          <p>Real journeys. Beautifully shared.</p>
        </div>
        <nav aria-label="Auth footer links">
          <Link href="mailto:support@after-trip.com">
            support@after-trip.com
          </Link>
          <Link href="/legal#terms">Terms of Use</Link>
          <Link href="/legal#privacy">Privacy Policy</Link>
        </nav>
        <small>© 2026 AfterTrip. All rights reserved.</small>
      </footer>
    </main>
  );
}
