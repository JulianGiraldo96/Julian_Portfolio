import type { Metadata } from "next";
import { CamelWebsPage } from "@/components/v2/CamelWebsPage";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "CamelWebs, brand identity | Julian Giraldo",
  description:
    "Brand identity for CamelWebs, farm software for alpaca and llama herds: the mountain and llama mark, the brand guide with logo, colour, type and a set of 171 icons. Designed by Julian Giraldo.",
  alternates: { canonical: `${SITE}/design/camelwebs` },
  openGraph: {
    type: "article",
    title: "CamelWebs, software with altitude",
    description: "A llama cut out of a mountain: the identity, the icons and the brand guide for CamelWebs.",
    url: `${SITE}/design/camelwebs`,
    images: [`${SITE}/design/camelwebs/og.png`],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "CamelWebs brand identity",
  description:
    "Logo, visual identity, icon set, website and brand guide for CamelWebs, farm management software for camelid herds.",
  image: `${SITE}/design/camelwebs/og.png`,
  url: `${SITE}/design/camelwebs`,
  dateCreated: "2024-04",
  creator: { "@type": "Person", name: "Julian Giraldo", jobTitle: "Product Designer", url: SITE },
  keywords: "brand identity, logo design, icon design, brand guidelines, visual identity, agtech",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CamelWebsPage />
    </>
  );
}
