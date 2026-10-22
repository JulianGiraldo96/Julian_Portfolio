import type { Metadata } from "next";
import { NotchTunesPage } from "@/components/v2/NotchTunesPage";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "NotchTunes, a free Mac app | Julian Giraldo",
  description:
    "NotchTunes turns the notch on a MacBook into a tiny music player for Apple Music, Spotify, YouTube and YouTube Music. Designed and built by Julian Giraldo, free to download.",
  alternates: { canonical: `${SITE}/notchtunes` },
  openGraph: {
    type: "website",
    title: "NotchTunes, your music living in the notch",
    description: "A free Mac app: the cover and a tiny equalizer in the notch, the controls one hover away.",
    url: `${SITE}/notchtunes`,
    images: [`${SITE}/notchtunes/icon.svg`],
  },
};

/* The app as data, so a search engine or an assistant reads what it is, what
   it runs on and that it costs nothing. */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NotchTunes",
  operatingSystem: "macOS 14 or later",
  applicationCategory: "MultimediaApplication",
  softwareVersion: "1.1",
  downloadUrl: `${SITE}/notchtunes/NotchTunes.dmg`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  author: { "@type": "Person", name: "Julian Giraldo", url: SITE },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <NotchTunesPage />
    </>
  );
}
