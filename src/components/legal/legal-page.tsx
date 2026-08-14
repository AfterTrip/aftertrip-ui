import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound
} from "lucide-react";

const lastUpdated = "August 10, 2026";

const termsSections = [
  {
    id: "terms-using",
    title: "Using AfterTrip",
    copy: [
      "AfterTrip is for sharing completed travel experiences and discovering real journeys from other travelers.",
      "You may browse public trips without an account. Publishing, saving, and managing trips may require signing in.",
      "Use AfterTrip lawfully, respectfully, and only with information you are allowed to share."
    ]
  },
  {
    id: "terms-account",
    title: "Your account",
    copy: [
      "You are responsible for activity on your account and for keeping access to your Google account secure.",
      "If you believe your account has been compromised, contact us so we can help protect it."
    ]
  },
  {
    id: "terms-content",
    title: "Your content",
    copy: [
      "You keep ownership of the photos, videos, text, recommendations, and trip details you publish.",
      "By posting content, you allow AfterTrip to host, display, organize, and promote it within the service.",
      "Do not upload content that is unsafe, misleading, copied without permission, or harmful to another person."
    ],
    note: "AfterTrip does not claim ownership of your travel photos, videos, or stories."
  },
  {
    id: "terms-community",
    title: "Community standards",
    copy: [
      "Trips should be useful, honest, and respectful. Avoid spam, harassment, illegal content, and deliberately false travel claims.",
      "We may remove content or limit access when content harms the community or violates these terms."
    ]
  },
  {
    id: "terms-travel",
    title: "Travel information",
    copy: [
      "AfterTrip is not a travel agency and does not guarantee prices, safety, routes, weather, permits, or availability.",
      "Traveler posts are personal experiences. Always verify important details before planning or booking."
    ]
  },
  {
    id: "terms-contact",
    title: "Changes and contact",
    copy: [
      "We may update these terms as AfterTrip grows. If changes are material, we will make the update clear.",
      "Questions about these terms can be sent to hello@aftertrip.example."
    ]
  }
];

const privacySections = [
  {
    id: "privacy-collect",
    title: "Information we collect",
    icon: Database,
    copy: [
      "Account details such as your name, email address, profile image, and authentication identifiers.",
      "Trip details you choose to publish, including destinations, dates, routes, budgets, photos, videos, and notes.",
      "Basic usage and device information that helps us keep the service reliable and secure."
    ]
  },
  {
    id: "privacy-use",
    title: "How we use information",
    icon: CheckCircle2,
    copy: [
      "We use information to operate AfterTrip, show public trips, save your drafts and bookmarks, improve discovery, and protect the community.",
      "We may use aggregated or de-identified trends to improve features and recommendations."
    ]
  },
  {
    id: "privacy-public",
    title: "Public trip information",
    icon: UserRound,
    copy: [
      "Published trips are visible to other people. This can include your display name, profile image, destination, dates, budget range, photos, videos, and recommendations.",
      "Avoid publishing sensitive personal information or anything you do not want others to see."
    ]
  },
  {
    id: "privacy-google",
    title: "Google sign-in",
    icon: LockKeyhole,
    copy: [
      "When you continue with Google, we receive the basic account details needed to sign you in.",
      "We do not receive your Google password."
    ]
  },
  {
    id: "privacy-media",
    title: "Photos, videos, and location",
    icon: Camera,
    copy: [
      "Photos and videos may contain location or metadata from your device. Review your uploads before publishing.",
      "We use uploaded media to display your trip and help travelers understand the experience."
    ]
  },
  {
    id: "privacy-retention",
    title: "Retention and choices",
    icon: ShieldCheck,
    copy: [
      "We keep information while your account or published content remains active, unless a longer period is needed for security, backup, or legal reasons.",
      "You can edit or delete your trip content from your account. Some backup copies may take time to clear."
    ]
  },
  {
    id: "privacy-contact",
    title: "Contact",
    icon: Mail,
    copy: [
      "For privacy questions or account requests, contact hello@aftertrip.example."
    ]
  }
];

const navItems = [
  { href: "#terms", label: "Terms of Service" },
  { href: "#terms-content", label: "Your content" },
  { href: "#terms-travel", label: "Travel information" },
  { href: "#privacy", label: "Privacy Policy" },
  { href: "#privacy-collect", label: "Information we collect" },
  { href: "#privacy-public", label: "Public trips" },
  { href: "#privacy-retention", label: "Your choices" },
  { href: "#privacy-contact", label: "Contact" }
];

function LegalJumpMenu() {
  return (
    <details className="legal-jump-menu">
      <summary>Jump to section</summary>
      <nav aria-label="Legal page sections">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}

export function LegalPage() {
  return (
    <main id="main-content" className="legal-page">
      <section className="legal-hero">
        <div className="container legal-hero-inner">
          <div className="legal-hero-copy">
            <p className="eyebrow">Legal</p>
            <h1>Terms and Privacy</h1>
            <p>
              Clear rules for sharing real journeys, plus a plain explanation of
              what AfterTrip collects and how it is used.
            </p>
            <p className="legal-updated">
              <CalendarDays aria-hidden="true" size={17} />
              Last updated: {lastUpdated}
            </p>
            <div className="legal-hero-actions">
              <Link href="#terms">Read terms</Link>
              <Link href="#privacy">Read privacy</Link>
            </div>
          </div>
          <div className="legal-hero-art" aria-hidden="true">
            <Image
              src="/images/cta/share-adventure.png"
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 520px"
            />
          </div>
        </div>
      </section>

      <div className="container legal-mobile-jump">
        <LegalJumpMenu />
      </div>

      <div className="container legal-shell">
        <aside className="legal-sidebar">
          <h2>On this page</h2>
          <nav aria-label="Legal page sections">
            {navItems.map((item, index) => (
              <Link href={item.href} key={item.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="legal-content">
          <section className="legal-document" id="terms">
            <div className="legal-document-heading">
              <p className="eyebrow">Terms</p>
              <h2>Terms of Service</h2>
              <p>
                These terms explain how AfterTrip should be used and what you
                agree to when you browse, save, or publish trips.
              </p>
            </div>

            <article className="legal-section" id="terms-welcome">
              <h3>Welcome to AfterTrip</h3>
              <p>
                AfterTrip helps travelers share completed journeys, learn from
                real experiences, and plan with more confidence. The service is
                built around authentic stories, not guaranteed travel advice.
              </p>
            </article>

            {termsSections.map((section, index) => (
              <article
                className="legal-section"
                id={section.id}
                key={section.id}
              >
                <h3>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </h3>
                {section.copy.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.note ? (
                  <p className="legal-note">
                    <FileText aria-hidden="true" size={18} />
                    {section.note}
                  </p>
                ) : null}
              </article>
            ))}
          </section>

          <section className="legal-document" id="privacy">
            <div className="legal-document-heading">
              <p className="eyebrow">Privacy</p>
              <h2>Your privacy matters.</h2>
              <p>
                This policy explains what AfterTrip collects, why it is needed,
                and the choices you have when sharing your travel story.
              </p>
            </div>

            {privacySections.map((section, index) => {
              const Icon = section.icon;
              return (
                <article
                  className="legal-section legal-icon-section"
                  id={section.id}
                  key={section.id}
                >
                  <span className="legal-icon">
                    <Icon aria-hidden="true" size={22} />
                  </span>
                  <div>
                    <h3>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                    </h3>
                    {section.copy.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </div>
    </main>
  );
}
