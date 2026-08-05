import type { Metadata } from "next";
import { V2Home } from "@/components/v2/V2Home";

export const metadata: Metadata = {
  title: "Julian Giraldo | Product Designer",
  description: "Product Designer based in Berlin. B2B SaaS, internal tools and data heavy interfaces.",
  robots: { index: false, follow: false },
};

export default function V2Page() {
  return <V2Home />;
}
