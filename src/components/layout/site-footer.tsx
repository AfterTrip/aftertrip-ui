import Image from "next/image";
import Link from "next/link";
import { Facebook, Globe2, Instagram, Send, Youtube } from "lucide-react";
import { footerColumns } from "@/data/navigation";
import { SITE_TAGLINE } from "@/lib/constants";

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="20" height="20">
    <path
      fill="currentColor"
      d="M12.1 2.2c-5.3 0-8 3.8-8 7 0 1.9 1.1 4.2 2.9 4.9.3.1.5 0 .6-.3.1-.2.2-.8.3-1 .1-.3 0-.4-.2-.7-.6-.7-.9-1.5-.9-2.7 0-2.8 2.1-5.4 5.7-5.4 3.1 0 5.1 1.9 5.1 4.7 0 3.2-1.6 5.5-3.7 5.5-1.1 0-2-.9-1.7-2 .3-1.3 1-2.7 1-3.7 0-.9-.5-1.6-1.4-1.6-1.1 0-2 1.1-2 2.6 0 1 .3 1.6.3 1.6l-1.4 5.8c-.4 1.7-.2 4.2-.1 4.3.1.1.2.1.3 0 .1-.1 1.5-1.9 2-3.6.1-.5.7-2.7.7-2.7.4.7 1.4 1.3 2.5 1.3 3.3 0 5.7-3 5.7-7.1 0-3.8-3.1-6.9-7.7-6.9Z"
    />
  </svg>
);

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="AfterTrip home">
            <Image src="/brand/aftertrip-mark.svg" alt="" width={30} height={30} />
            <span>AfterTrip</span>
          </Link>
          <p>{SITE_TAGLINE}</p>
          <div className="social-links" aria-label="Social links">
            <Link href="#" aria-label="Instagram">
              <Instagram aria-hidden="true" size={20} />
            </Link>
            <Link href="#" aria-label="Facebook">
              <Facebook aria-hidden="true" size={20} />
            </Link>
            <Link href="#" aria-label="YouTube">
              <Youtube aria-hidden="true" size={21} />
            </Link>
            <Link href="#" aria-label="Pinterest">
              <PinterestIcon />
            </Link>
          </div>
        </div>
        <div className="footer-columns">
          {footerColumns.map((column) => (
            <nav aria-label={column.title} key={column.title}>
              <h2>{column.title}</h2>
              {column.links.map((link) => (
                <Link href="#" key={link}>
                  {link}
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
            <input id="newsletter-email" name="email" type="email" placeholder="Enter your email" />
            <button aria-label="Submit newsletter signup" type="submit">
              <Send aria-hidden="true" size={18} />
            </button>
          </div>
        </form>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 AfterTrip. All rights reserved.</p>
        <button className="language-control" type="button">
          <Globe2 aria-hidden="true" size={18} />
          English (US)
        </button>
      </div>
    </footer>
  );
}
