"use client";

import { useEffect } from "react";
import { recordProfileView } from "@/lib/aftertrip-api";
import { getVisitorId } from "@/lib/visitor-id";

export function ProfileViewRecorder({ slug }: { slug: string }) {
  useEffect(() => {
    void recordProfileView(slug, getVisitorId()).catch(() => undefined);
  }, [slug]);
  return null;
}
