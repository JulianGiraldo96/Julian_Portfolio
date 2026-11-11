import type { Metadata } from "next";
import { VisualWorkPage } from "@/components/v2/WorkPage";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "Visual work | Julian Giraldo",
  description:
    "Brand and identity work by Julian Giraldo: the Greens Supermarket logo revamp and brand guide, the CamelWebs identity, the Savee and Meinerva app identities, and the years as a graphic designer before product.",
  alternates: { canonical: `${SITE}/visual-work` },
  openGraph: {
    type: "website",
    title: "Visual work | Julian Giraldo",
    description:
      "Logos, brand guides, social templates, print, film and app identities.",
    url: `${SITE}/visual-work`,
    siteName: "Julian Giraldo",
  },
};

export default function Page() {
  return <VisualWorkPage />;
}
