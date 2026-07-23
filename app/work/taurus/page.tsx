import type { Metadata } from "next";
import { CaseStudy } from "@/components/CaseStudy";

export const metadata: Metadata = {
  title: "TaurusWebs | Julian Giraldo",
  description:
    "Bulk Farm Setup for TaurusWebs: an editable table that cut farm setup from six hours to one and got ranchers to digitize the whole herd instead of only the key animals. Adopted by 100% of new farms and by Fedegán, Colombia's cattle federation.",
};

export default function TaurusPage() {
  return (
    <CaseStudy
      currentSlug="taurus"
      meta={{
        index: "03",
        title: "TaurusWebs",
        subtitle:
          "An editable table that cut farm setup from six hours to one, and got ranchers to digitize the whole herd instead of just the key animals.",
        year: "2024–2025",
        role: "Product Design · UX · Research",
        tags: ["Web", "SaaS", "Agtech"],
        status: "Shipped · 2025",
        note: "Real product work · no NDA · TaurusWebs livestock platform",
      }}
      cover={{
        src: "/projects/taurus/hero.webp",
        alt: "TaurusWebs · Bulk Farm Setup table",
      }}
      sections={[
        {
          kind: "overview",
          label: "00 · Overview",
          heading: "The first data load decided whether the product was worth it.",
          columns: [
            {
              title: "My role",
              body: "Sole designer, end to end: framing the problem, interviewing clients and field workers, designing the interaction, running the tests, and shipping the UI. No product manager, no art director.",
            },
            {
              title: "The challenge",
              body: "Onboarding a farm meant typing every animal into a single-record form, one at a time. A standard herd took the better part of a day, so ranchers gave up and entered only the key animals, leaving the data too incomplete to trust.",
            },
            {
              title: "The goal",
              body: "Make the first load fast and complete, so ranchers digitize the whole herd, not just a handful, and the platform finally becomes the source of truth it was meant to be.",
            },
          ],
          meta: "Product: Web · SaaS · Agtech / Livestock",
        },

        {
          kind: "text",
          label: "01 · The product",
          heading: "A precision platform for the whole farm, not just a cattle list.",
          body: [
            "TaurusWebs is a SaaS for cattle ranchers that goes well beyond a herd register. On top of animal records, weights, and sanitary plans, it runs digital modules for biomass, bromatology, digital fertilization, and a per-farm CO₂ footprint. Its customers range from single-farm owners to multi-farm livestock companies.",
            "All of that intelligence rests on one thing: an accurate, complete record of the farm. If the herd and inventory aren't fully loaded, every module above sits on half-empty data. That first load is where customers quietly decided whether TaurusWebs was worth it.",
          ],
          image: {
            src: "/projects/taurus/product-fertilizacion.jpg",
            alt: "TaurusWebs Expert · digital fertilization module with nutrient tables",
            position: "right",
            caption: "TaurusWebs Expert · one of the modules the loaded data feeds",
          },
        },

        {
          kind: "overview",
          label: "02 · The domain",
          heading: "Before the software helps, it has to know the entire farm.",
          columns: [
            {
              title: "The herd",
              body: "Every animal is a record: ear tag, breed, sex, birth date, and weight. A standard farm runs around 70 head; a livestock company runs several farms at once, so the count climbs fast.",
            },
            {
              title: "Lots & paddocks",
              body: "Animals aren't a flat list. They live in lots and paddocks, get moved between them, and share a breed and a batch. Ranchers think in these groups, not one animal at a time.",
            },
            {
              title: "The record",
              body: "On top of the herd sit weights over time, sanitary plans, and feed and supply inventory. None of it is useful until the animals underneath it actually exist in the system.",
            },
          ],
          meta: "One incomplete first load quietly breaks every module built on top of it.",
        },

        {
          kind: "text",
          label: "03 · The problem",
          heading: "Onboarding meant typing each animal in, one at a time.",
          body: [
            "The only way to register animals was a single-record form: open it, fill six or seven fields, save, repeat. For one animal that's fine. For a herd, it falls apart.",
            "Workers told us a standard farm took the better part of a working day just to load. So they stopped. Clients entered only the animals they cared about most and left the rest out, which meant the data was never complete enough to trust, and the platform never became the source of truth it was meant to be.",
          ],
          stats: [
            {
              icon: "bolt",
              number: "5 min",
              caption:
                "per animal through the single-record form: open, fill six fields, save, repeat.",
            },
            {
              icon: "triangle",
              number: "~6 h",
              caption:
                "to load a standard 70-animal farm, so in practice it rarely got finished.",
            },
            {
              icon: "dot",
              number: "Few",
              caption:
                "animals actually entered: clients loaded the key ones and gave up on the rest.",
            },
          ],
        },

        {
          kind: "flow",
          variant: "taurus-before",
          label: "03b · Before",
          heading: "The old flow: one animal, then the same form again.",
          body: [
            "Every animal meant reopening the single-record form and filling the same six fields. Multiply by a 70-head herd and the loop is the whole problem, so people abandoned it.",
          ],
        },

        {
          kind: "list",
          label: "04 · Discovery",
          heading: "The workaround was already a table.",
          body: [
            "I ran informal interviews with both the owners buying the software and the workers actually doing the entry. Four findings kept surfacing, and together they reframed the whole problem.",
          ],
          items: [
            {
              title: "Nobody thinks animal-by-animal",
              body: "Ranchers keep their herd as a list, in a notebook column or a spreadsheet. The single-record form forced them out of that mental model and into a funnel they had to push each row through, one at a time.",
            },
            {
              title: "Excel was already the real tool",
              body: "Many clients arrived with their herd already typed into a spreadsheet. The biggest objection to onboarding wasn't the fields, it was 'I'm not typing all of this again.'",
            },
            {
              title: "The same values repeat down the column",
              body: "Most rows on a farm share a handful of breeds and lots. The form made people retype those constants on every single animal.",
            },
            {
              title: "Mistakes surfaced too late",
              body: "Bad weights and duplicate tags only showed up after saving, one record at a time, so cleaning the data was as slow as entering it.",
            },
          ],
        },

        {
          kind: "questions",
          label: "05 · User stories",
          heading: "What the entry flow actually needed to support.",
          body: [
            "Once we framed the problem around a table, the requirements were obvious. Each one came from a real frustration in the interviews.",
          ],
          items: [
            {
              question: "As a rancher, I want to load my whole herd at once,",
              hint: "so that I don't enter animals one by one",
            },
            {
              question: "As a worker, I want to paste what I already keep in a spreadsheet,",
              hint: "so that I'm not retyping the same list again",
            },
            {
              question: "As an owner, I want to set breed and lot once per batch,",
              hint: "so that I don't repeat them on every row",
            },
            {
              question: "As a new user, I want to see my mistakes before saving,",
              hint: "so that the data that lands is clean",
            },
            {
              question: "As a multi-farm company, I want each property loaded the same way,",
              hint: "so that onboarding is fast and repeatable",
            },
            {
              question: "As a rancher, I want the full herd in the system,",
              hint: "so that the records are complete and worth trusting",
            },
          ],
        },

        {
          kind: "bulktable",
          label: "06 · Solution",
          heading: "One editable table that ingests an entire farm.",
          body: [
            "Instead of a form per animal, TaurusWebs got a table mode: every animal is a row, every attribute a column, and the whole herd is filled, corrected, and submitted in a single pass. The same surface people already used to think about their cattle became the surface they entered it through.",
            "Toggle below between the old one-by-one form and the table that replaced it.",
          ],
          footer:
            "Visuals recreated for this case study. The live TaurusWebs UI looks different, but the interaction model is the one that shipped.",
        },

        {
          kind: "flow",
          variant: "taurus-after",
          label: "06b · After",
          heading: "The new flow: one table, filled, checked, ingested.",
          body: [
            "Eligible farms open straight into the table. Rows get pasted or filled with presets, validation flags bad data inline, and the whole herd is selected and ingested in a single pass.",
          ],
        },

        {
          kind: "gallery",
          label: "07 · From sketch to spec",
          heading: "How the table took shape before it shipped.",
          layout: "grid",
          columns: 3,
          body: [
            "The interaction went from a rough as-is sketch of the spreadsheet workaround, to a table with presets and paste, to an inline validation pass. These wireframes are the artefacts I handed to the developers to build against.",
          ],
          images: [
            {
              src: "/projects/taurus/wire-01-asis.svg",
              alt: "Wireframe: the as-is spreadsheet workaround",
              caption: "01 · As-is: they already work in rows",
            },
            {
              src: "/projects/taurus/wire-02-table.svg",
              alt: "Wireframe: table mode with presets and paste",
              caption: "02 · Table mode: presets, paste, fill-down",
            },
            {
              src: "/projects/taurus/wire-03-validation.svg",
              alt: "Wireframe: inline validation before ingest",
              caption: "03 · Validation before ingest",
            },
          ],
        },

        {
          kind: "list",
          label: "08 · User testing",
          heading: "Testing turned a blank table into a fast one.",
          body: [
            "We tested the table with 100 users at launch. A raw editable grid is already faster than a form, but watching people use it surfaced the real bottleneck: they were still typing the same handful of values over and over. The table actions below came directly from those sessions.",
          ],
          items: [
            {
              title: "Breed & lot presets",
              body: "Most rows on a farm share a few breeds and a few lots. Testers kept retyping them, so common values became one-tap presets that fill the column, with the option to override any single cell.",
            },
            {
              title: "Paste from a spreadsheet",
              body: "Many clients already kept their herd in Excel. Letting them paste straight into the table removed the single biggest objection: 'I'm not typing all this again.'",
            },
            {
              title: "Fill-down & bulk apply",
              body: "Select a column or a range, set a value once, apply it to every selected row. Assigning a whole batch to the same lot or birth season stopped being repetitive work.",
            },
            {
              title: "Inline validation before ingest",
              body: "Bad weights, duplicate tags, and impossible dates are flagged in the row, not after submitting. People fix the herd while it's still in front of them, so the data that lands is clean.",
            },
          ],
        },

        {
          kind: "text",
          label: "09 · The launch",
          heading: "We put it in front of 300 ranchers at Bootcamp 4.0.",
          body: [
            "The table shipped as part of Bootcamp 4.0, TaurusWebs' technology-in-livestock event, in front of more than 300 ranchers. The company directors presented the new tools on stage and I was there to support the rollout, watching the feature I had designed meet the exact people whose working day it was meant to save.",
            "The moment that stuck with me wasn't the stage. It was afterwards, at the tables at night, ranchers hunched over laptops loading their own herds for the first time, pasting spreadsheets they had kept for years and watching a whole farm land in one pass. That is when an interaction stops being a design decision and becomes someone's afternoon back.",
          ],
        },

        {
          kind: "gallery",
          label: "09b · Bootcamp 4.0",
          heading: "Presenting and onboarding, in the same room.",
          layout: "grid",
          columns: 2,
          images: [
            {
              src: "/projects/taurus/bootcamp-director.jpg",
              alt: "A company director presenting TaurusWebs at Bootcamp 4.0",
              caption: "Directors presenting the new tools on stage",
            },
            {
              src: "/projects/taurus/bootcamp-night.jpg",
              alt: "Ranchers onboarding their farms on laptops at Bootcamp 4.0",
              caption: "Ranchers loading their own herds, hands on",
            },
          ],
        },

        {
          kind: "text",
          label: "10 · Results",
          heading: "It became the way every farm starts.",
          body: [
            "Bulk setup is now the default first step for onboarding a farm, so 100% of new farms come in through it. Even among existing farms already being tracked, 98% moved to bulk, leaving one-by-one entry only to a few very small or legacy clients.",
            "The clearest proof came from Fedegán, Colombia's cattle ranchers' federation, which loads around 2,000 records a month across its farms. At the old rate of five minutes per animal that was roughly 167 hours of monthly data entry. Through the table it dropped to under 33.",
          ],
          image: {
            src: "/projects/taurus/fedegan-logo.png",
            alt: "Fedegán · Colombia's cattle ranchers' federation",
            position: "below",
            width: "300px",
            bg: "bg-white p-10 border border-border",
            caption: "Fedegán · ~2,000 records a month, loaded through bulk",
          },
          stats: [
            {
              icon: "percent",
              number: "100%",
              caption:
                "of new farms now onboard through bulk setup: it's the default first step.",
            },
            {
              icon: "bolt",
              number: "98%",
              caption:
                "of existing tracked farms moved to bulk over one-by-one entry.",
            },
            {
              icon: "triangle",
              number: "167 → 33 h",
              caption:
                "Fedegán's monthly load for ~2,000 records, from roughly 167 hours to under 33.",
            },
          ],
        },

        {
          kind: "gallery",
          label: "10b · In their words",
          heading: "A launch with plenty of testimonials.",
          layout: "grid",
          columns: 3,
          body: [
            "Bulk setup launched alongside a wave of new TaurusWebs tools, and it drew steady testimonials from ranchers on the ground. The team runs surveys continuously, so the feedback keeps coming in rather than stopping at launch day.",
          ],
          images: [
            {
              src: "/projects/taurus/testimonial-1.jpg",
              alt: "A rancher giving feedback about TaurusWebs at Bootcamp 4.0",
              caption: "Rancher feedback · Bootcamp 4.0",
            },
            {
              src: "/projects/taurus/testimonial-2.jpg",
              alt: "A rancher giving feedback about TaurusWebs at Bootcamp 4.0",
              caption: "Rancher feedback · Bootcamp 4.0",
            },
            {
              src: "/projects/taurus/testimonial-3.jpg",
              alt: "A rancher giving feedback about TaurusWebs at Bootcamp 4.0",
              caption: "Rancher feedback · Bootcamp 4.0",
            },
          ],
        },

        {
          kind: "text",
          label: "11 · Reflections",
          heading: "Users had already built the fix in Excel.",
          body: [
            "The fix wasn't a clever feature. Customers had already worked out the right interaction in their spreadsheets, and the product was fighting it. My job was to remove the funnel and let them work the way they already did.",
            "It also changed how I think about onboarding. The first data load isn't a chore to rush past. It's the moment a customer decides whether the whole product is worth it. Get that part fast and complete, and everything after it finally has data it can rely on.",
          ],
        },

        {
          kind: "text",
          label: "12 · What's next",
          heading: "A complete first load unlocked everything after it.",
          body: [
            "Once farms started arriving complete, the rest of the platform had data worth building on. Development moved up the stack into protein and mineral maps, and most recently into farm dashboards, our latest launch.",
            "Before, a farm had no technical sheet, no single overview of its own state. Now, because the herd and its records finally land in full, that whole-farm view exists at all. Fixing the least glamorous part of the product, the data entry, is what made the ambitious parts possible.",
          ],
        },
      ]}
    />
  );
}
