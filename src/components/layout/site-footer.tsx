import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { footerColumns } from "@/data/navigation";
import { SITE_TAGLINE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="AfterTrip home">
            <Image
              src="/brand/aftertrip-mark.svg"
              alt=""
              width={30}
              height={30}
            />
            <span>AfterTrip</span>
          </Link>
          <p>{SITE_TAGLINE}</p>
        </div>
        <div className="footer-columns">
          {footerColumns.map((column) => (
            <nav aria-label={column.title} key={column.title}>
              <h2>{column.title}</h2>
              {column.links.map((link) => (
                <Link href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <form className="newsletter" aria-label="Newsletter signup">
          <h2>Stay in the loop</h2>
          <p>Get travel inspiration &amp; tips straight to your inbox.</p>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="newsletter-field">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="Enter your email"
            />
            <button aria-label="Submit newsletter signup" type="submit">
              <Send aria-hidden="true" size={18} />
            </button>
          </div>
        </form>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 AfterTrip. All rights reserved.</p>
      </div>
    </footer>
  );
}
