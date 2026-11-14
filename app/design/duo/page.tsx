import type { Metadata } from "next";
import { DuoPage } from "@/components/v2/DuoPage";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "Duo Sicilian Ice Cream, brand | Julian Giraldo",
  description:
    "Brand work for Duo Sicilian Ice Cream in Berlin: the logo taken out of its oval, a cast of drawn characters, the team shirts, jar packaging, a 42 strip wall menu, counter print, campaigns and the Sicilian Market. Designed by Julian Giraldo.",
  alternates: { canonical: `${SITE}/design/duo` },
  openGraph: {
    type: "article",
    title: "Duo Sicilian Ice Cream, one logo grown into a whole shop",
    description: "The logo, characters, shirts, packaging, menus and campaigns for a Sicilian gelato shop in Berlin.",
    url: `${SITE}/design/duo`,
    images: [`${SITE}/design/duo/og.png`],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Duo Sicilian Ice Cream brand",
  description:
    "Logo, illustration, packaging, wall menu, print and campaigns for Duo Sicilian Ice Cream, Berlin.",
  image: `${SITE}/design/duo/og.png`,
  url: `${SITE}/design/duo`,
  dateCreated: "2024-09",
  creator: { "@type": "Person", name: "Julian Giraldo", jobTitle: "Product Designer", url: SITE },
  keywords: "logo system, illustration, characters, packaging, menu design, visual identity, gelato, food",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DuoPage />
    </>
  );
}
