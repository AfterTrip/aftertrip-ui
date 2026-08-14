"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

export function MobileNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    if (href === "/explore")
      return pathname === "/explore" || pathname.startsWith("/trips");
    if (href === "/dashboard") return pathname.startsWith("/dashboard");
    return pathname === href;
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton label="Open menu" className="mobile-menu-trigger">
          <Menu aria-hidden="true" size={31} strokeWidth={1.7} />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-nav-overlay" />
        <Dialog.Content
          className="mobile-nav-content"
          aria-describedby={undefined}
        >
          <div className="mobile-nav-topline">
            <Dialog.Title>AfterTrip menu</Dialog.Title>
            <Dialog.Close asChild>
              <IconButton label="Close menu">
                <X aria-hidden="true" size={24} />
              </IconButton>
            </Dialog.Close>
          </div>
          <nav aria-label="Mobile navigation">
            {navigationItems.map((item) => (
              <Dialog.Close asChild key={item.label}>
                <Link
                  className={isActive(item.href) ? "active" : undefined}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </Dialog.Close>
            ))}
          </nav>
          <div className="mobile-nav-actions">
            <Dialog.Close asChild>
              <Button variant="secondary" asChild>
                <Link href="/login">Log in</Link>
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button asChild>
                <Link href="/dashboard/create-trip">Publish Trip</Link>
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
