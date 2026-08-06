import type { MetadataRoute } from "next";
import { work } from "@/components/v2/projects";

const SITE = "https://juliang.de";

/* Generated from the project list, so adding a case study cannot leave the
   sitemap behind. */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();
  return [
    { url: SITE, lastModified: updated, changeFrequency: "monthly", priority: 1 },
    ...work.map((p) => ({
      url: `${SITE}/work/${p.slug}`,
      lastModified: updated,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
