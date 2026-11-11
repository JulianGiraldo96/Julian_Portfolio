import type { Metadata } from "next";
import { ProductDesignPage } from "@/components/v2/WorkPage";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "Product design | Julian Giraldo",
  description:
    "Every product design case by Julian Giraldo: an ERP running nine locations, a scanner that remembers what it scanned, a bulk entry table that cut farm setup from six hours to one, and two university projects.",
  alternates: { canonical: `${SITE}/product-design` },
  openGraph: {
    type: "website",
    title: "Product design | Julian Giraldo",
    description:
      "B2B SaaS, internal tools and data heavy interfaces. Three shipped systems and two university projects.",
    url: `${SITE}/product-design`,
    siteName: "Julian Giraldo",
  },
};

export default function Page() {
  return <ProductDesignPage />;
}
