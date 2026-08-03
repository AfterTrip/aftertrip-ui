"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

export function MobileNavigation() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton label="Open menu" className="mobile-menu-trigger">
          <Menu aria-hidden="true" size={31} strokeWidth={1.7} />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-nav-overlay" />
        <Dialog.Content className="mobile-nav-content" aria-describedby={undefined}>
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
                <Link href={item.href}>{item.label}</Link>
              </Dialog.Close>
            ))}
          </nav>
          <div className="mobile-nav-actions">
            <Dialog.Close asChild>
              <Button variant="secondary">Log in</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button>Publish Trip</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
