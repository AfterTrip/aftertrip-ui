"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { MobileNavigation } from "./mobile-navigation";
import { AccountMenu } from "./account-menu";
import { useAuthenticationSession } from "@/lib/use-authentication-session";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const session = useAuthenticationSession();

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/explore")
      return pathname === "/explore" || pathname.startsWith("/trips");
    if (href === "/dashboard") return pathname.startsWith("/dashboard");
    return pathname === href;
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand-lockup" href="/" aria-label="AfterTrip home">
          <Image
            className="brand-mark-green"
            src="/brand/aftertrip-logo-green.png"
            alt=""
            width={174}
            height={58}
            priority
            aria-hidden="true"
          />
          <Image
            className="brand-mark-white"
            src="/brand/aftertrip-logo-white.png"
            alt=""
            width={174}
            height={58}
            priority
            aria-hidden="true"
          />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <Link
              className={isActive(item.href) ? "active" : undefined}
              aria-current={isActive(item.href) ? "page" : undefined}
              key={item.label}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="desktop-actions">
          <ThemeToggle />
          {session === null ? (
            <Link className="login-link" href="/login">Log in</Link>
          ) : null}
          <Button variant="secondary" asChild>
            <Link href="/dashboard/create-trip">Publish Trip</Link>
          </Button>
          {session ? <AccountMenu /> : null}
        </div>
        <ThemeToggle className="mobile-header-theme-toggle" />
        <MobileNavigation />
      </div>
    </header>
  );
}
