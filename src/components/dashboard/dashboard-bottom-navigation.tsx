"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Briefcase, Plus, Search, User } from "lucide-react";

const items = [
  { label: "Explore", href: "/explore", icon: Search },
  { label: "My Trips", href: "/dashboard", icon: Briefcase },
  { label: "Publish", href: "/dashboard/create-trip", icon: Plus },
  { label: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { label: "Profile", href: "/dashboard/edit-profile", icon: User }
] as const;

export function DashboardBottomNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className="dashboard-bottom-nav"
      aria-label="Mobile dashboard navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        const create = item.href === "/dashboard/create-trip";

        return (
          <Link
            className={`${create ? "create " : ""}${active ? "active" : ""}`.trim() || undefined}
            href={item.href}
            aria-current={active ? "page" : undefined}
            key={item.href}
          >
            <Icon aria-hidden="true" size={create ? 26 : 21} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
