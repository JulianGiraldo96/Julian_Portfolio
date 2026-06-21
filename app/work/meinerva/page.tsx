import type { Metadata } from "next";
import { CaseStudy } from "@/components/CaseStudy";

export const metadata: Metadata = {
  title: "Meinerva — Julian Giraldo",
  description:
    "Master's thesis (Visual & Experience Design, UE Potsdam). Meinerva is a museum and event companion that makes experimental art legible by letting people look and form their own reading before any explanation, then revealing the artist's intent and the community's interpretations.",
};

export default function MeinervaPage() {
  return (
    <CaseStudy
      currentSlug="meinerva"
      meta={{
        index: "A1",
        title: "Meinerva",
        subtitle: "Understanding Artistic Communication in Participatory Media",
        year: "2025",
        role: "Research · Experience Design (Master's thesis)",
        tags: ["Research", "UX", "Art & Tech"],
        status: "Academic · Master's thesis",
        note: "From Gods to Humans · Master of Visual & Experience Design · University of Europe for Applied Sciences, Potsdam",
      }}
      cover={{
        src: "/projects/meinerva/hero.webp",
        alt: "Meinerva — dark, type-led art companion app",
      }}
      sections={[
        {
          kind: "text",
          label: "01 · Premise",
          heading: "Experimental art keeps losing the people standing in front of it.",
          body: [
            "Artists use techniques that aren't fully understood by their audiences. Without some explanation, the intention behind a piece often doesn't land — and the work gets read as decoration, or skipped.",
            "My Master's thesis asked a narrower version of that problem: can the way we present art help people decode it for themselves, instead of handing them a wall label and hoping they read it? Meinerva is the design answer — a companion for exhibitions and ticketed events (cinema, theatre, concert) built around one rule: look before you're told.",
          ],
        },
        {
          kind: "text",
          label: "02 · The gap",
          heading: "The phone arrives before the looking does.",
          body: [
            "In a gallery, the modern reflex is to reach for context immediately — a caption, a search, a friend's opinion — before the work has had a second to do anything. The reading that arrives first is rarely the viewer's own.",
            "So the meaning gets imported instead of formed. People leave able to repeat what a piece is 'about' without ever having had an experience of it.",
          ],
          stats: [
            { icon: "bolt", number: "0", caption: "Context shown before you've looked and written" },
            { icon: "triangle", number: "3", caption: "Hint layers that open only after you write" },
            { icon: "dot", number: "1st", caption: "Reading on record is always your own" },
          ],
        },
        {
          kind: "text",
          label: "03 · Framework",
          heading: "Borrowed from perception science, not from marketing.",
          body: [
            "The design is grounded in visual-perception theory (Arnheim, Zeki) — the idea that looking is an active, trainable act — and in Activity Theory, which frames understanding as something built through doing, not receiving.",
            "On top of that sit the participatory-museum model (Simon) and digital-curation practice: the institution stops being the single voice and becomes the host of a conversation. Meinerva turns those ideas into an interface.",
          ],
        },
        {
          kind: "list",
          label: "04 · Research",
          heading: "One artist, many visitors.",
          body: [
            "I interviewed a practicing artist about the distance between what they intend and what viewers take away, and surveyed exhibition visitors about how — and how soon — they reach for explanation.",
          ],
          items: [
            { title: "Artist interview", body: "Where intention gets lost between the studio and the wall, and what the artist wishes viewers noticed first." },
            { title: "Visitor surveys", body: "When people reach for context, what they trust, and how a label changes the reading they'd have formed on their own." },
            { title: "What it pointed to", body: "Interaction rooted in a strong conceptual rule — not more features — is what moves people from passive viewing to a reading they own." },
          ],
        },
        {
          kind: "text",
          label: "05 · Concept",
          heading: "Look first. Write your reading. Then compare.",
          body: [
            "Meinerva (from Minerva — the move 'from gods to humans', meaning carried by people, not handed down) is type-led and deliberately quiet: a calligraphic wordmark, almost no icons, the writing is the interface. The flow is a sequence of earned reveals.",
            "Open a work and it stays veiled while you look — context is withheld on purpose. Only then can you write what you see, and only after you've written does the app open up the hints: the artist's intent, the history, and what everyone else read into it.",
          ],
        },
        {
          kind: "screens",
          label: "06 · The app",
          heading: "The flow, in order.",
          body: [
            "Open, browse, wait, write, reveal — each step earns the next. The interface is type-led and almost wordless on purpose: the work and your reading of it carry the screen, not chrome.",
          ],
          images: [
            { src: "/projects/meinerva/s1-intro.webp", alt: "Intro — the Meinerva wordmark on open" },
            { src: "/projects/meinerva/s2-home.webp", alt: "Home — a feed of artworks, each credited to its maker" },
            { src: "/projects/meinerva/s3-observe.webp", alt: "The wait — the work stays veiled until you have really looked" },
            { src: "/projects/meinerva/s4-write.webp", alt: "Write — your own reading, before any context" },
            { src: "/projects/meinerva/s5-reveal.webp", alt: "Reveal — choose a hint and the context opens up" },
          ],
        },
        {
          kind: "list",
          label: "07 · Two ideas that carry it",
          heading: "The details that make the concept work.",
          items: [
            { title: "Earned reveals", body: "Context, artist commentary and community are locked until you commit a reading. The wait is the point — it protects the first, unbiased look." },
            { title: "Relevance over popularity", body: "Community critiques surface by contribution and a 'most relevant' signal, not raw star count — so a thoughtful minority reading isn't buried under the obvious one." },
          ],
        },
        {
          kind: "text",
          label: "08 · Outcome",
          heading: "Concept-driven interaction reads better than more features.",
          body: [
            "Early results from the interview and surveys pointed the same way: interactive strategies anchored in a strong conceptual rule communicate artistic intent better than open-ended tools or more explanation. Delaying the reveal made the meaning feel formed rather than imported.",
            "Meinerva is the proof-of-concept — a complete interface and brand system that turns the thesis from an argument into something you could hold and use.",
          ],
        },
        {
          kind: "text",
          label: "09 · Reflection",
          heading: "What the thesis taught me as a designer.",
          body: [
            "I came in wanting to add explanation and left convinced the harder, better move was to withhold it — to design the pause. Restraint, sequencing and a single clear rule did more for comprehension than any feature I could have bolted on.",
            "It's also where my interest in experience design and research really set: starting from a question about how people understand, and only then drawing screens.",
          ],
        },
      ]}
    />
  );
}
