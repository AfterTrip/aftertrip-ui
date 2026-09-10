"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthenticationSession } from "@/lib/auth-client";

export function useAuthenticatedPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const requireLogin = () => {
      const query = window.location.search.slice(1);
      const next = `${pathname}${query ? `?${query}` : ""}`;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    };

    if (!getAuthenticationSession()) {
      requireLogin();
      return;
    }

    const readyTimer = window.setTimeout(() => setReady(true), 0);
    window.addEventListener("aftertrip:session-expired", requireLogin);
    return () => {
      window.clearTimeout(readyTimer);
      window.removeEventListener("aftertrip:session-expired", requireLogin);
    };
  }, [pathname, router]);

  return ready;
}
