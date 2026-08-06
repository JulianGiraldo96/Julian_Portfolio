import type { Metadata } from "next";
import { V2Home } from "@/components/v2/V2Home";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "Julian Giraldo | Product Designer in Berlin",
  description:
    "Product Designer in Berlin. Four years in product, eight designing. B2B SaaS, internal tools and data heavy interfaces: an ERP running nine locations, a bulk entry table that cut farm setup from six hours to one, and a meal planner built to end food waste.",
  alternates: { canonical: `${SITE}` },
  openGraph: {
    type: "profile",
    title: "Julian Giraldo | Product Designer in Berlin",
    description:
      "Product Designer in Berlin. B2B SaaS, internal tools and data heavy interfaces.",
    url: `${SITE}`,
    siteName: "Julian Giraldo",
  },
};

/* Structured data, so an assistant reading this page for a recruiter gets the
   facts as data rather than having to infer them from layout: who this is,
   what they do, where they are, and what each project actually was. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${SITE}#page`,
      url: `${SITE}`,
      name: "Julian Giraldo, Product Designer",
      mainEntity: { "@id": `${SITE}/#julian` },
    },
    {
      "@type": "Person",
      "@id": `${SITE}/#julian`,
      name: "Julian Giraldo",
      jobTitle: "Product Designer",
      description:
        "Product Designer with four years in product and eight years designing, working on B2B SaaS, internal tools and data heavy interfaces.",
      email: "mailto:application@juliang.de",
      url: `${SITE}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Berlin",
        addressCountry: "DE",
      },
      seeks: {
        "@type": "Demand",
        name: "Product Design roles in Berlin or remote",
      },
      knowsAbout: [
        "Product design",
        "UX research",
        "B2B SaaS",
        "Internal tools",
        "Design systems",
        "Data heavy interfaces",
        "Interaction design",
      ],
      sameAs: ["https://www.linkedin.com/in/julian-gr/"],
    },
    {
      "@type": "ItemList",
      "@id": `${SITE}#work`,
      name: "Selected work",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: 5,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "CreativeWork",
            name: "ERP Duo",
            url: `${SITE}/work/erp-duo`,
            datePublished: "2026",
            about:
              "An ERP for Duo Sicilian Ice Cream: thirteen modules running nine locations and six departments daily.",
            creator: { "@id": `${SITE}/#julian` },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "CreativeWork",
            name: "Duo Scan Memory",
            url: `${SITE}/work/scan-memory`,
            datePublished: "2025",
            about:
              "A receiving screen for Duo's inventory app that remembers every unit scanned, grouped by flavour, cutting inventory errors by around 30% and ending the manual recounts at the loading bay.",
            creator: { "@id": `${SITE}/#julian` },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "CreativeWork",
            name: "TaurusWebs",
            url: `${SITE}/work/taurus`,
            datePublished: "2025",
            about:
              "A bulk entry table for a livestock SaaS that cut farm setup from six hours to one and became the default onboarding path for every new farm.",
            creator: { "@id": `${SITE}/#julian` },
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "CreativeWork",
            name: "Savee",
            url: `${SITE}/work/savee`,
            datePublished: "2025",
            about:
              "A zero to one mobile meal planner designed so household food waste becomes impossible. Built as a Master's project on sustainability and technology.",
            genre: "Academic project",
            creator: { "@id": `${SITE}/#julian` },
          },
        },
        {
          "@type": "ListItem",
          position: 5,
          item: {
            "@type": "CreativeWork",
            name: "Meinerva",
            url: `${SITE}/work/meinerva`,
            datePublished: "2025",
            about:
              "A Master's thesis project: a typographic art companion that asks you to look and write your own reading before it offers a hint.",
            genre: "Academic project",
            creator: { "@id": `${SITE}/#julian` },
          },
        },
      ],
    },
  ],
};

export default function V2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <V2Home />
    </>
  );
}
