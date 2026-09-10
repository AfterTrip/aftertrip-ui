"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, ChevronDown, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getOwnProfile,
  PROFILE_UPDATED_EVENT,
  type ApiProfile
} from "@/lib/aftertrip-api";
import { logoutAuthenticationSession } from "@/lib/auth-client";
import { useAuthenticationSession } from "@/lib/use-authentication-session";

type AccountMenuProps = {
  variant?: "site" | "dashboard";
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "T") + (parts.length > 1 ? parts.at(-1)?.[0] ?? "" : "");
}

export function AccountMenu({ variant = "site" }: AccountMenuProps) {
  const router = useRouter();
  const session = useAuthenticationSession();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [profile, setProfile] = useState<ApiProfile | null>(null);

  useEffect(() => {
    if (!session) return;
    let active = true;
    getOwnProfile()
      .then((value) => {
        if (active) setProfile(value);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [session]);

  useEffect(() => {
    const synchronize = (event: Event) => {
      setProfile((event as CustomEvent<ApiProfile>).detail);
    };
    window.addEventListener(PROFILE_UPDATED_EVENT, synchronize);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, synchronize);
  }, []);

  if (!session) return null;

  const displayName = profile?.displayName || session.user.displayName || session.user.email;
  const avatarUrl = profile?.avatarUrl || session.user.avatarUrl;

  const logOut = async () => {
    menuRef.current?.removeAttribute("open");
    await logoutAuthenticationSession();
    router.replace("/");
    router.refresh();
  };

  return (
    <details className={`account-menu account-menu-${variant}`} ref={menuRef}>
      <summary
        className={variant === "dashboard" ? "dashboard-profile-button" : "account-menu-trigger"}
        aria-label={`Open account menu for ${displayName}`}
      >
        <span
          className={`account-avatar${avatarUrl ? " has-photo" : ""}`}
          style={avatarUrl ? { backgroundImage: `url("${avatarUrl}")` } : undefined}
          aria-hidden="true"
        >
          {avatarUrl ? null : initials(displayName)}
        </span>
        <ChevronDown aria-hidden="true" size={18} />
      </summary>
      <div className="account-menu-popover" role="menu">
        <div className="account-menu-identity">
          <strong>{displayName}</strong>
          <span>{session.user.email}</span>
        </div>
        <Link href="/dashboard" role="menuitem">
          <Briefcase aria-hidden="true" size={18} />
          My trips
        </Link>
        <Link href="/dashboard/edit-profile" role="menuitem">
          <UserRound aria-hidden="true" size={18} />
          Edit profile
        </Link>
        <button type="button" role="menuitem" onClick={() => void logOut()}>
          <LogOut aria-hidden="true" size={18} />
          Log out
        </button>
      </div>
    </details>
  );
}
