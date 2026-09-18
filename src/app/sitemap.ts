import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-18");

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${SITE_URL}/explore`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${SITE_URL}/legal`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4
    }
  ];
}
