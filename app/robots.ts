import type { MetadataRoute } from "next";

/* Explicit rather than absent. Without a robots.txt a crawler gets no guidance
   and no pointer to the sitemap, and the AI crawlers that read this site for
   recruiters are neither allowed nor denied, they just guess. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://juliang.de/sitemap.xml",
    host: "https://juliang.de",
  };
}
