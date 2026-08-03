import Image from "next/image";
import Link from "next/link";
import { Globe2 } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { MobileNavigation } from "./mobile-navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand-lockup" href="/" aria-label="AfterTrip home">
          <Image
            src="/brand/aftertrip-mark.svg"
            alt=""
            width={36}
            height={36}
            priority
            aria-hidden="true"
          />
          <span>AfterTrip</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="desktop-actions">
          <IconButton label="Choose language" className="header-globe">
            <Globe2 aria-hidden="true" size={22} />
          </IconButton>
          <Link className="login-link" href="#footer">
            Log in
          </Link>
          <Button variant="secondary" asChild>
            <Link href="#publish">Publish Trip</Link>
          </Button>
        </div>
        <MobileNavigation />
      </div>
    </header>
  );
}
