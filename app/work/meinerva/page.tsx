import type { Metadata } from "next";
import { CaseStudy } from "@/components/CaseStudy";

export const metadata: Metadata = {
  title: "Meinerva · Julian Giraldo",
  description:
    "Master's thesis (Visual & Experience Design, UE Potsdam). Meinerva is an art companion that helps people build their own knowledge and critical thinking: look first, write your own reading, and only then open the artist's intent and the community's interpretations.",
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
        alt: "Meinerva, a dark, typographic art companion",
      }}
      sections={[
        {
          kind: "text",
          label: "01 · Premise",
          heading: "Experimental art keeps losing the people standing in front of it.",
          body: [
            "Artists use techniques that aren't fully understood by their audiences. Without some explanation the intention behind a piece often doesn't land, and the work gets read as decoration, or skipped.",
            "My Master's thesis asked a narrower version of that problem. Can the way we present art help people decode it for themselves, instead of handing them a wall label and hoping they read it? Meinerva is the design answer: a companion for exhibitions and ticketed events that is built around one rule. Look before you're told.",
          ],
        },
        {
          kind: "text",
          label: "02 · What it's really about",
          heading: "The point isn't the artwork. It's your own knowledge and critical thinking.",
          body: [
            "Meinerva treats understanding as something a person builds, not something an institution hands down. Every choice in the product protects the moment where you form your own reading, because that is where knowledge and critical thinking actually happen.",
            "The artwork is the prompt. The thinking is the product.",
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
            "The design is grounded in visual perception theory (Arnheim, Zeki), the idea that looking is an active, trainable act, and in Activity Theory, which frames understanding as something built through doing rather than receiving.",
            "On top of that sit the participatory museum model (Simon) and digital curation practice. The institution stops being the single voice and becomes the host of a conversation. Meinerva turns those ideas into an interface.",
          ],
        },
        {
          kind: "list",
          label: "04 · Research",
          heading: "One artist, many visitors.",
          body: [
            "I interviewed a practicing artist about the distance between what they intend and what viewers take away, and surveyed exhibition visitors about how, and how soon, they reach for explanation.",
          ],
          items: [
            { title: "Artist interview", body: "Where intention gets lost between the studio and the wall, and what the artist wishes viewers noticed first." },
            { title: "Visitor surveys", body: "When people reach for context, what they trust, and how a label changes the reading they would have formed on their own." },
            { title: "What it pointed to", body: "Interaction rooted in a strong conceptual rule, not more features, is what moves people from passive viewing to a reading they own." },
          ],
        },
        {
          kind: "text",
          label: "05 · Concept",
          heading: "Look first. Write your reading. Then compare.",
          body: [
            "Meinerva (from Minerva, the move from gods to humans, meaning carried by people rather than handed down) is typographic and deliberately quiet. A calligraphic wordmark, almost no icons, the writing is the interface. The flow is a sequence of earned reveals.",
            "What follows are the moments that carry it, in order, and why each one is built the way it is.",
          ],
        },
        {
          kind: "screens",
          label: "06 · Start",
          heading: "It opens on a name, not a feed.",
          body: [
            "The first thing you meet is the wordmark, set in a calligraphic monogram. It signals the register before anything else does: this is a slow, considered place, closer to a reading room than a social app.",
          ],
          images: [
            { src: "/projects/meinerva/s1-intro.webp", alt: "Intro, the Meinerva wordmark on open" },
          ],
        },
        {
          kind: "screens",
          label: "07 · Find the work",
          heading: "Finding the pieces around you.",
          body: [
            "You can browse by artist, by what's popular, or by what's close by on a map, and pull up the place itself, the Prado, a gallery, a venue. The point is to meet people where the art already is, in a room or at an event, not to replace the encounter with a screen.",
          ],
          images: [
            { src: "/projects/meinerva/find-map.webp", alt: "Close by, a map of art and museums around you" },
            { src: "/projects/meinerva/find-prado.webp", alt: "The place itself, context on where the work lives" },
          ],
        },
        {
          kind: "screens",
          label: "08 · The wait",
          heading: "Wait, and actually look or listen.",
          body: [
            "Before anything unlocks, the app asks you to stop. Take a moment to breathe and appreciate the piece. The screen locks for a short while, longer if you want, so you give the work real attention, watching or listening, instead of reaching straight for an opinion. Delaying interpretation is the whole mechanism. The pause is what makes room for reflection.",
          ],
          images: [
            { src: "/projects/meinerva/wait.webp", alt: "The wait, a quiet locked screen that asks you to look or listen first" },
          ],
        },
        {
          kind: "screens",
          label: "09 · Grey to colour",
          heading: "Once you've looked, the work comes back to colour.",
          body: [
            "During the wait the piece is held in grey, veiled, almost withheld. After you've given it your attention and written your reading, it returns to full colour. The shift is the reward for looking, and a quiet signal that you've moved from observing to understanding.",
          ],
          images: [
            { src: "/projects/meinerva/veil.webp", alt: "The work held in grey while you look" },
            { src: "/projects/meinerva/colour.webp", alt: "The work returned to colour after you engage" },
          ],
        },
        {
          kind: "screens",
          label: "10 · The hint",
          heading: "Tap a hint, and the context opens up.",
          body: [
            "Only now do the hints appear, and only if you want them. Tap one and a layer opens: the artist, the history, the technique. Context is offered, never imposed, so it deepens the reading you already made instead of replacing it.",
          ],
          images: [
            { src: "/projects/meinerva/hint.webp", alt: "A hint opening into context about the artist and the work" },
          ],
        },
        {
          kind: "screens",
          label: "11 · The critique",
          heading: "The critique is the most important part of the whole thing.",
          body: [
            "Everything leads here. You write what you see before anyone tells you what it means, and then you read what others saw. Writing is the act that turns looking into knowledge, and reading other people's critiques sharpens your own thinking against theirs.",
            "Critiques surface by relevance, not by raw popularity, so a thoughtful minority reading isn't buried under the obvious one. The community becomes a place to think with, not a leaderboard. This is where the thesis lives: meaning made by people, in dialogue, instead of handed down.",
          ],
          images: [
            { src: "/projects/meinerva/write.webp", alt: "Write your own reading before any context" },
            { src: "/projects/meinerva/critique.webp", alt: "Community critiques surfaced by relevance, read against your own" },
          ],
        },
        {
          kind: "text",
          label: "12 · Outcome",
          heading: "Concept-driven interaction reads better than more features.",
          body: [
            "Early results from the interview and surveys pointed the same way. Interactive strategies anchored in a strong conceptual rule communicate artistic intent better than open ended tools or more explanation. Delaying the reveal made the meaning feel formed rather than imported.",
            "Meinerva is the proof of concept: a complete interface and brand system that turns the thesis from an argument into something you could hold and use.",
          ],
        },
        {
          kind: "text",
          label: "13 · Reflection",
          heading: "What the thesis taught me as a designer.",
          body: [
            "I came in wanting to add explanation and left convinced the harder, better move was to withhold it, to design the pause. Restraint, sequencing and a single clear rule did more for comprehension than any feature I could have bolted on.",
            "It is also where my interest in experience design and research really set: starting from a question about how people understand, and only then drawing screens.",
          ],
          footer:
            "At the end, this thesis was written on a computer placed on a desk, and “a desk is a dangerous place from which to watch the world.” (le Carré, 1977)",
        },
      ]}
    />
  );
}
