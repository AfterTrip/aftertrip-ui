"use client";

import { useEffect, useState } from "react";
import {
  AUTH_SESSION_CHANGED_EVENT,
  getAuthenticationSession,
  type AuthenticationSession
} from "@/lib/auth-client";

export function useAuthenticationSession() {
  const [session, setSession] = useState<AuthenticationSession | null>();

  useEffect(() => {
    const synchronize = () => setSession(getAuthenticationSession());
    synchronize();
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, synchronize);
    window.addEventListener("storage", synchronize);
    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, synchronize);
      window.removeEventListener("storage", synchronize);
    };
  }, []);

  return session;
}
