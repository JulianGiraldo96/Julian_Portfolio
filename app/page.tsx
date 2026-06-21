import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Academic } from "@/components/Academic";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Work />
      <Academic />
      <About />
      <Contact />
    </main>
  );
}
