import type { Metadata } from "next";
import localFont from "next/font/local";
import { GreensPage } from "@/components/v2/GreensPage";

const SITE = "https://juliang.de";

/* the brand's headline face, free to embed; only this route loads it */
const caviar = localFont({
  src: [
    { path: "./fonts/CaviarDreams.ttf", weight: "400" },
    { path: "./fonts/CaviarDreams_Bold.ttf", weight: "700" },
  ],
  variable: "--font-caviar",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Greens Supermarket, brand guide | Julian Giraldo",
  description:
    "Brand work for Greens Supermarket, a family supermarket in Malta: a flat revamp of its logo, the brand guide with logo, clear space, colour, type, pattern and photography, and the social templates and posts. Designed by Julian Giraldo.",
  alternates: { canonical: `${SITE}/design/greens` },
  openGraph: {
    type: "article",
    title: "Greens Supermarket, keeping a family grocer fresh",
    description: "A logo revamp, the brand guide and the weekly social templates for a family supermarket in Malta.",
    url: `${SITE}/design/greens`,
    images: [`${SITE}/design/greens/og.png`],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Greens Supermarket brand guide",
  description:
    "Logo revamp, brand guidelines and social media templates for Greens Supermarket, Malta.",
  image: `${SITE}/design/greens/og.png`,
  url: `${SITE}/design/greens`,
  dateCreated: "2020-08",
  creator: { "@type": "Person", name: "Julian Giraldo", jobTitle: "Product Designer", url: SITE },
  keywords: "brand guidelines, logo revamp, visual identity, social media templates, retail, supermarket",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GreensPage fontClass={caviar.variable} />
    </>
  );
}
