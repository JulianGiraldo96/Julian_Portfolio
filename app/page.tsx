import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Work />
      <About />
      <Contact />
    </main>
  );
}
