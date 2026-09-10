import Image from "next/image";
import Link from "next/link";
import { footerColumns } from "@/data/navigation";
import { SITE_TAGLINE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="AfterTrip home">
            <Image
              src="/brand/aftertrip-logo-green.png"
              alt=""
              width={160}
              height={53}
            />
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
      </div>
      <div className="container footer-bottom">
        <p>© 2026 AfterTrip. All rights reserved.</p>
      </div>
    </footer>
  );
}
