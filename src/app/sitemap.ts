import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { publicProfiles } from "@/data/public-profiles";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date("2026-08-01"),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${SITE_URL}/legal`,
      lastModified: new Date("2026-08-10"),
      changeFrequency: "monthly",
      priority: 0.4
    },
    {
      url: `${SITE_URL}/dashboard/travel-footprint`,
      lastModified: new Date("2026-08-14"),
      changeFrequency: "weekly",
      priority: 0.3
    },
    ...publicProfiles.map((profile) => ({
      url: `${SITE_URL}/travelers/${profile.slug}`,
      lastModified: new Date("2026-08-15"),
      changeFrequency: "weekly" as const,
      priority: 0.6
    }))
  ];
}
