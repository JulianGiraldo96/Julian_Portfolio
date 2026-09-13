import type { Metadata } from "next";
import { V2CaseStudy } from "@/components/v2/V2CaseStudy";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "Meinerva | Julian Giraldo",
  description:
    "Meinerva, a Master's thesis on artistic communication in participatory media: an art companion that makes you look and write your own reading before it will show you anybody else's.",
  alternates: { canonical: `${SITE}/work/meinerva` },
  openGraph: {
    type: "article",
    title: "Meinerva",
    description:
      "Look before you're told: making experimental art legible without explaining it away.",
    url: `${SITE}/work/meinerva`,
    images: [`${SITE}/projects/meinerva/hero.webp`],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Meinerva",
  description:
    "A Master's thesis project: a typographic art companion that asks you to look and write your own reading before it offers a hint.",
  image: `${SITE}/projects/meinerva/hero.webp`,
  url: `${SITE}/work/meinerva`,
  datePublished: "2025-01-01",
  author: {
    "@type": "Person",
    name: "Julian Giraldo",
    jobTitle: "Product Designer",
    url: `${SITE}`,
  },
  about: {
    "@type": "CreativeWork",
    name: "From Gods to Humans, Understanding Artistic Communication in Participatory Media",
    description:
      "Master of Visual and Experience Design, University of Europe for Applied Sciences, Potsdam.",
  },
  keywords:
    "experience design, research, art and technology, participatory media, Master's thesis, mobile app",
};

export default function MeinervaV2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <V2CaseStudy
        currentSlug="meinerva"
        coverScreen="meinerva"
        tint="#17171A"
        tintDark="#141417"
        meta={{
          index: "05",
          title: "Meinerva",
          subtitle:
            "Experimental art keeps losing the people standing in front of it. This one asks you to look, and to write what you saw, before it will tell you anything.",
          year: "2025",
          role: "Research · Experience Design",
          tags: ["Mobile", "Research", "Art & tech"],
          status: "Master's thesis, 2025",
        }}
        sections={[
          {
            kind: "columns",
            label: "00 · Overview",
            heading: "The point is not the artwork. It is your own reading of it.",
            columns: [
              {
                title: "My role",
                body: "The whole thesis: the research question, the theoretical framework, two platform benchmarks, four personas, three user journeys, the interaction system, the naming and the visual identity, and the prototype. Master of Visual and Experience Design, University of Europe for Applied Sciences, Potsdam.",
              },
              {
                title: "The challenge",
                body: "Experimental work loses people at the door. The usual fix is a wall text, which hands over the answer and quietly replaces the visitor's reading with the institution's.",
              },
              {
                title: "The goal",
                body: "Decentralise the authority to interpret. If someone leaves with their own reading on record, and the vocabulary to defend it, the work has done more than being explained ever could.",
              },
            ],
            meta: "From Gods to Humans · Understanding Artistic Communication in Participatory Media",
          },

          {
            kind: "text",
            label: "01 · Premise",
            heading: "A wall text answers the question before you have asked it.",
            body: [
              "Standing in front of something you do not understand is uncomfortable, and every institution has the same reflex: explain it. The explanation works, in the narrow sense that the discomfort goes away. It also ends the encounter. Once you have been told what a piece means, you cannot un-know it and look again.",
              "The thesis argues that the discomfort is the material. It is the moment where a visitor is actually doing the work, and design should hold them in it a little longer rather than rescuing them from it.",
              "The title comes from where the argument starts. In Ancient Greece the artist was not the owner of meaning but an intermediary, channelling the Muses toward the public. Somewhere between then and now the artist became the expert who explains, and the audience became people who need explaining to. The project is an attempt to hand that back.",
            ],
          },

          {
            kind: "list",
            label: "02 · Theoretical framework",
            heading: "Borrowed from perception science and participation theory, not from marketing.",
            body: [
              "The design decisions in this project are all downstream of four positions. They are worth naming because each one rules something out.",
            ],
            items: [
              {
                title: "Barthes, The Death of the Author",
                body: "Meaning is not fixed by the author's intention; it is activated by the reader, who brings their own context. If that is true, an app that leads with the artist's statement has already decided who is right. So the artist's voice arrives last, not first.",
              },
              {
                title: "Zeki, Inner Vision",
                body: "Perception and aesthetic judgement are constructed actively by the brain, not passively received. Meaning is co-produced in the act of looking, which is the neurobiological argument for making somebody actually look before the app gives them anything.",
              },
              {
                title: "Simon, The Participatory Museum",
                body: "Cultural institutions should be spaces of engagement, not one-directional education, and the audience are collaborators rather than recipients. This is what turns the critique from a comment box into the centre of the product.",
              },
              {
                title: "Kuutti, Activity Theory in HCI",
                body: "Interaction is always mediated by tools, community and cultural rules. That framing is why the interface is kept deliberately minimal: the app is a mediator, and a mediator that draws attention to itself has failed.",
              },
            ],
          },

          {
            kind: "text",
            label: "02b · Beyond the Western canon",
            heading: "Participatory interpretation is not a digital invention.",
            body: [
              "It would be easy to present decentralised meaning as something the internet made possible. Andean, Aboriginal Australian and Yoruba traditions have treated art as ongoing practice embedded in ritual and communal experience for far longer than Europe has treated it as an object to be decoded by an individual viewer. Phillips and Steiner describe meaning in those traditions as unfolding through social negotiation rather than isolated contemplation, with no clean line between artist and audience.",
              "Naming that mattered for the design, not just the citations. It reframes the app as returning to a long-standing model rather than inventing a new one, and it makes the removal of the expert voice a decolonial gesture rather than a novelty.",
            ],
          },

          {
            kind: "list",
            label: "03 · Benchmarks",
            heading: "Two platforms that call themselves participatory.",
            body: [
              "Both were studied in depth, and both fail in instructive and opposite ways. What they have in common is that the spectator never gets to change anything.",
            ],
            items: [
              {
                title: "ARTMO",
                body: "A commission-free marketplace and social network for the art world: free profiles, groups, articles, and a hybrid market for physical, digital and NFT work. Genuinely decentralised in economic terms, and yet the artwork is a listing. Users can like and comment, which is what Claire Bishop calls delegated participation: engagement inside tightly controlled parameters that reaffirms the existing hierarchy instead of subverting it.",
              },
              {
                title: "Google Arts & Culture",
                body: "An extraordinary archive: gigapixel zoom, virtual tours, partnerships with the Musée d'Orsay, the Uffizi, MoMA. It democratises access completely and redistributes no agency at all. You can observe and absorb, but you cannot annotate, argue, or recontextualise. Information flows one way, from institution to user.",
              },
              {
                title: "What both are missing",
                body: "Rancière's distribution of the sensible: an arrangement where curators, historians and institutions are heard and everybody else is structurally excluded from producing meaning. Access is not the same as agency, and neither platform touches the second one.",
              },
              {
                title: "What that implied",
                body: "If the gap is agency rather than access, then the intervention cannot be more content, better zoom or a bigger archive. It has to be a change in the order in which voices arrive. That single conclusion is what the rest of the project is built on.",
              },
            ],
          },

          {
            kind: "text",
            label: "04 · Method",
            heading: "Research through design, with the prototype as the argument.",
            body: [
              "The project followed a research-through-design methodology (Frayling), where practice and reflection inform one another and the artefact is both the product and the means of generating knowledge. That was the right fit for something sitting between artistic production, user experience and speculative interaction design.",
              "It ran in three phases. Documentary research first, into participatory museum practice, cognitive psychology and theories of authorship. Then a conceptual design phase where the speculative functionality was defined, guided by Activity Theory. Then prototypes and interface mockups, tested through informal interviews and usability sessions with a small group of artists and non-artists.",
              "Those sessions were deliberately qualitative. The aim was never a statistical generalisation; it was to find out where people hesitate when asked to write about art, and what makes them stop.",
            ],
          },

          {
            kind: "questions",
            label: "05 · Personas",
            heading: "Four ways of arriving at the same artwork.",
            body: [
              "Built from interpretive synthesis of the literature and observed patterns rather than from surveys, and used to keep the design honest about who it excludes. Each one wants something different from the same three screens.",
            ],
            items: [
              {
                question: "Emilia Kraus, 34, schoolteacher, Berlin",
                hint: "the reflective viewer. Enjoys contemporary art, is overwhelmed by curatorial texts, and values the delay because it gives her permission to look slowly",
              },
              {
                question: "Isaac Moreno, 27, sound artist, Medellín",
                hint: "the independent artist. Publishes experimental soundscapes, distrusts social media dynamics, and wants honest feedback without performative pressure or losing anonymity",
              },
              {
                question: "Leïla Ben Youssef, 22, art history student, Marseille",
                hint: "the critical thinker. Comes with postcolonial and feminist theory already loaded and wants somewhere to argue, not somewhere to be taught",
              },
              {
                question: "David Meier, the cultural drifter",
                hint: "wanders in without a plan or a vocabulary, and is the person every wall text is secretly written for",
              },
            ],
          },

          {
            kind: "video",
            label: "05b · Walkthrough",
            heading: "The whole sequence, in one take.",
            body: [
              "Two and a half minutes of the prototype, start to finish: the scan, the countdown, the halftone, writing a critique, the work returning to colour, and the community arriving last. It runs muted and loops, and it only plays while it is on screen.",
            ],
            src: "/projects/meinerva/walkthrough.mp4",
            poster: "/projects/meinerva/walkthrough-poster.webp",
            caption: "Prototype walkthrough · 2:25 · no sound",
            ratio: 720 / 1486,
          },

          {
            kind: "wires",
            label: "06 · From the file",
            heading: "The screens the argument was built in.",
            body: [
              "These are exported straight from the Figma file, with the frame names they carry there. Between them they show the two things easiest to miss from a description: the work really is held in halftone until you have written, and the same rule was designed for music and for objects, not only for paintings on a wall.",
            ],
            frames: [
              {
                src: "/projects/meinerva/process/option.webp",
                title: "Option",
                note: "The way in. Scan the QR or bring the phone near the symbol to unlock the piece. No catalogue, no thumbnail, nothing to browse before you are standing in front of it.",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/meinerva/process/delay.webp",
                title: "Critic_delay",
                note: "Las Meninas held in halftone black and white while the countdown runs. This frame is the thesis: the work is present, legible as a composition, and deliberately withheld until you have said something.",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/meinerva/process/context.webp",
                title: "Overview, artist context",
                note: "Velázquez, the Spanish Golden Age, the Baroque period. Everything a wall text would have opened with, and it only exists behind a critique you have already written.",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/meinerva/process/home1.webp",
                title: "Home1, music",
                note: "Motomami, from Apple Music, with Listen to the album and its running time. The same sequence with the album as the work: the screen locks while it plays and opens when it ends.",
                w: 390,
                h: 844,
              },
            ],
          },

          {
            kind: "flow",
            label: "07 · The sequence",
            heading: "Look. Write. Then, and only then, compare.",
            body: [
              "Every gate exists because the thing behind it would otherwise overwrite what the visitor was about to think for themselves. The artwork stays in halftone until a critique has been submitted, and the artist's own commentary is the last thing anybody sees, not the first.",
            ],
            caption:
              "Twenty seconds of countdown, Do Not Disturb, and no way to skip to the answer.",
            archifySrc: "/flows/meinerva-sequence.html",
            spec: {
              phases: [
                "1 · Scan",
                "2 · Wait and look",
                "3 · Halftone",
                "4 · Write",
                "5 · Unlocked",
                "6 · Community",
              ],
              nodes: [
                {
                  id: "scan",
                  col: 1,
                  row: 1,
                  kind: "start",
                  title: "Scan the work",
                  sub: "QR or NFC beside the piece",
                },
                {
                  id: "dndlook",
                  col: 2,
                  row: 2,
                  kind: "auto",
                  title: "Do Not Disturb, look",
                  sub: "a twenty second countdown, the screen goes quiet",
                },
                {
                  id: "halftone",
                  col: 3,
                  row: 2,
                  title: "The work appears in halftone",
                  sub: "black and white, no context, no title card",
                },
                {
                  id: "write",
                  col: 4,
                  row: 1,
                  kind: "decision",
                  title: "Write a critique",
                },
                {
                  id: "unlocked",
                  col: 5,
                  row: 2,
                  kind: "auto",
                  title: "Unlocked in full colour",
                  sub: "hints, artist commentary and history open",
                },
                {
                  id: "community",
                  col: 6,
                  row: 1,
                  kind: "end",
                  title: "The community appears",
                  sub: "your comment, then most starred, then most relevant",
                },
              ],
              edges: [
                { from: "scan", to: "dndlook" },
                { from: "dndlook", to: "halftone" },
                { from: "halftone", to: "write" },
                { from: "write", to: "unlocked", label: "submitted" },
                { from: "write", to: "halftone", label: "cancelled", dashed: true },
                { from: "unlocked", to: "community" },
              ],
              lanes: [
                { row: 1, label: "The visitor" },
                { row: 2, label: "The work itself" },
              ],
              cards: [
                {
                  title: "Order is the argument",
                  items: [
                    "The artwork stays in halftone until a critique is submitted",
                    "The artist's own commentary is the last thing anybody sees",
                  ],
                },
                {
                  title: "Three journeys, one rule",
                  items: [
                    "Museum work, a scanned QR or NFC",
                    "An album or ticketed event, unlocked when it ends",
                    "The friction is identical: no interpretation before your own",
                  ],
                },
              ],
            },
          },

          {
            kind: "list",
            label: "08 · The comment system",
            heading: "Three kinds of comment, in a deliberate order.",
            body: [
              "The critique is not a feature bolted onto a viewer; it is the interaction the whole app exists to produce. So its structure carries the argument.",
            ],
            items: [
              {
                title: "My comments, first",
                body: "A personal archive of everything you have written, and the first thing shown after you submit. You can reply to your own critique, and those replies attach to it, so a reading can develop over time instead of being frozen at the moment you wrote it.",
              },
              {
                title: "Most starred, second",
                body: "The community's endorsement, and dynamic rather than fixed: what rises can change as more people read and star. It makes critique a shared cultural act rather than a queue of opinions.",
              },
              {
                title: "Most relevant, third",
                body: "Surfaced by fit to the work rather than by popularity, so a thoughtful minority reading is not buried under the one that arrived first.",
              },
              {
                title: "The artist, last",
                body: "Intentions are placed alongside the audience's, never above them. Artists can also stay anonymous or withhold interpretation entirely and let the community shape the narrative, which is a voluntary decentralisation of their own authority.",
              },
            ],
          },

          {
            kind: "text",
            label: "09 · Beyond the gallery",
            heading: "The same rule works wherever attention is the material.",
            tone: "band",
            body: [
              "Three user journeys were mapped, and only one of them is a museum. In music, the app connects to Spotify or Apple Music, locks while the track or album plays, and only opens the critique when it ends. For a ticketed event, cinema, theatre or concert, the ticket is linked by scanning at the entrance and the critique unlocks after the session, with the app in Do Not Disturb throughout.",
              "The friction is identical in all three, because the problem is identical: the interpretation you would have had is destroyed by consuming somebody else's first. Where the mechanism has to change is only in what counts as having paid attention.",
            ],
          },

          {
            kind: "wires",
            label: "09b · Not only paintings",
            heading: "An album and a sneaker, under the same rule.",
            body: [
              "Two more frames from the file. The app was never scoped to museums, and these are what that looks like in practice.",
            ],
            frames: [
              {
                src: "/projects/meinerva/process/home2.webp",
                title: "Home2, an object",
                note: "Sneakerhead by Melicka Fouri, from MLCKA's designs. A designed object treated exactly like a painting: look first, write, then find out what the maker meant.",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/meinerva/process/home1.webp",
                title: "Home1, an album",
                note: "A record, with the listening time as the wait. The friction is the same, only the definition of having paid attention changes.",
                w: 390,
                h: 844,
              },
            ],
          },

          {
            kind: "gallery",
            label: "10 · The moments",
            heading: "Where the argument becomes an interface.",
            columns: 3,
            body: [
              "Five screens from the prototype, in the order the app enforces. The wait and the veil are the two that people push back on, and the two the whole thesis rests on.",
            ],
            images: [
              {
                src: "/projects/meinerva/find-map.webp",
                alt: "Meinerva, a map locating the artwork in the room",
                caption: "Find the work, then put the phone down",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/meinerva/wait.webp",
                alt: "Meinerva, the countdown asking the visitor to look or listen first",
                caption: "Twenty seconds, with the phone silenced",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/meinerva/colour.webp",
                alt: "Meinerva, the work returned to full colour with numbered hint markers on it",
                caption: "Colour returns, and the hints appear on the work",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/meinerva/hint.webp",
                alt: "Meinerva, a hint layer opening after the visitor has written their reading",
                caption: "The hint, unlocked by writing",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/meinerva/critique.webp",
                alt: "Meinerva, writing a critique of the film Attack on Titan before any other reading is shown",
                caption: "Writing first, on a film rather than a painting",
                w: 390,
                h: 844,
              },
            ],
          },

          {
            kind: "text",
            label: "11 · Naming and identity",
            heading: "Mein plus Minerva: the art is yours.",
            body: [
              "The name was built for Berlin, where the project was set to launch. Mein is German for mine; Minerva is the Roman goddess of wisdom, the arts and strategy. Together they say the thing the whole thesis argues, that art is not distant or institutional but belongs to whoever is standing in front of it.",
              "The identity is typographic rather than pictorial, because the app is about writing. Icons would have suggested that the interface is a set of tools; type suggests that it is a place where language happens. Two faces carry it: a calligraphic one for the emotional, historical weight of writing by hand, and a modern display face for clarity and speed on a screen. The tension between them is the same tension the project is about, collective memory against contemporary expression.",
            ],
          },

          {
            kind: "text",
            label: "12 · Outcome",
            heading: "Concept driven interaction reads better than more features.",
            tone: "band",
            body: [
              "The version that tested best was the one that did least. Every feature added on top of the sequence made the sequence weaker, because each one offered a way around the part that mattered.",
              "The finding worth carrying out of the thesis is that friction can be constructive. Slowing the consumption of art and delaying access to interpretive content creates a space that is conceptual, temporal and emotional at once, and that space is where critical distance and emotional intimacy both become possible.",
              "The numbers below describe the shape of the design rather than a measured result. This is a thesis: what it demonstrates is an argument, made carefully, not an outcome in the field.",
            ],
            stats: [
              {
                number: "20 s",
                caption:
                  "of countdown with the phone silenced before the work appears at all.",
              },
              {
                number: "0",
                caption:
                  "context shown before you have looked and written something down.",
              },
              {
                number: "1st",
                caption:
                  "the reading on record is always your own, before the community's and before the artist's.",
              },
            ],
          },

          {
            kind: "text",
            label: "13 · Reflections",
            heading: "Designing the part people want to skip.",
            lead: true,
            body: [
              "Every instinct I had as a product designer was wrong here. Reduce friction, shorten the path, give people what they came for: all of it would have destroyed the thing. The wait is the product, and defending it against my own training was most of the work.",
              "It left me with a question I now ask on commercial projects too: what is this experience for, and is the friction I am about to remove actually the part where the value is.",
              "The thesis ends on a line from le Carré, and it is there as a warning to myself. A desk is a dangerous place from which to watch the world.",
            ],
          },
        ]}
      />
    </>
  );
}
