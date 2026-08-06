import type { Metadata } from "next";
import { V2CaseStudy } from "@/components/v2/V2CaseStudy";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "TaurusWebs, bulk farm setup | Julian Giraldo",
  description:
    "Bulk Farm Setup for TaurusWebs: an editable table that cut farm setup from six hours to one, moved 100% of new farms and 98% of tracked farms onto bulk entry, and took Fedegán's monthly load from roughly 167 hours to under 33.",
  alternates: { canonical: `${SITE}/work/taurus` },
  openGraph: {
    type: "article",
    title: "TaurusWebs, bulk farm setup",
    description:
      "An editable table that cut farm setup from six hours to one, and got ranchers to digitize the whole herd.",
    url: `${SITE}/work/taurus`,
    images: [`${SITE}/projects/taurus/hero.webp`],
  },
};

/* The case study as data, so an assistant summarising this page for a
   recruiter reads the role, the dates and the outcome directly. */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "TaurusWebs, bulk farm setup",
  description:
    "An editable table that cut farm setup from six hours to one, and got ranchers to digitize the whole herd instead of just the key animals.",
  image: `${SITE}/projects/taurus/hero.webp`,
  url: `${SITE}/work/taurus`,
  datePublished: "2020-01-01",
  author: {
    "@type": "Person",
    name: "Julian Giraldo",
    jobTitle: "Product Designer",
    url: `${SITE}`,
  },
  about: {
    "@type": "SoftwareApplication",
    name: "TaurusWebs",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "A livestock SaaS for cattle ranchers: herd records, weights, sanitary plans, and digital modules for biomass, bromatology, fertilization and per-farm CO2 footprint.",
  },
  keywords:
    "product design, UX research, B2B SaaS, agtech, bulk data entry, onboarding, editable table",
};

/* Same case study as /work/taurus, told in the v2 language. Kept as its own
   route while v2 is under review, so the live page is untouched. */
export default function TaurusV2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <V2CaseStudy
      meta={{
        index: "02",
        title: "TaurusWebs",
        subtitle:
          "An editable table that cut farm setup from six hours to one, and got ranchers to digitize the whole herd instead of just the key animals.",
        year: "2020",
        role: "Product Design · UX · Research",
        tags: ["Web", "SaaS", "Agtech"],
        status: "Shipped, 2020",
      }}
      cover={{
        src: "/projects/taurus/hero.webp",
        alt: "TaurusWebs · Bulk Farm Setup table",
        w: 2880,
        h: 1440,
      }}
      tint="#E7EEF8"
      tintDark="#15191F"
      currentSlug="taurus"
      sections={[
        {
          kind: "columns",
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
            caption: "TaurusWebs Expert · one of the modules the loaded data feeds",
            w: 907,
            h: 1600,
          },
        },

        {
          kind: "columns",
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
              number: "5 min",
              caption:
                "per animal through the single-record form: open, fill six fields, save, repeat.",
            },
            {
              number: "~6 h",
              caption:
                "to load a standard 70-animal farm, so in practice it rarely got finished.",
            },
            {
              number: "Few",
              caption:
                "animals actually entered: clients loaded the key ones and gave up on the rest.",
            },
          ],
        },

        {
          kind: "flow",
          label: "03b · Before",
          heading: "The old flow: one animal, then the same form again.",
          body: [
            "Every animal meant reopening the single-record form and filling the same six fields. Multiply by a 70-head herd and the loop is the whole problem, so people abandoned it.",
          ],
          caption: "The dashed wire is the whole problem: every animal sends you back to the same form.",
          spec: {
            phases: [
              "1 · New record",
              "2 · Add animal",
              "3 · Fill six fields",
              "4 · Save, then again",
            ],
            nodes: [
              { id: "farm", col: 1, row: 1, kind: "start", title: "New farm", sub: "nothing in the system yet" },
              { id: "open", col: 1, row: 2, title: "Open animals", sub: "registry module" },
              { id: "add", col: 2, row: 2, title: "Add animal", sub: "the single record form" },
              {
                id: "fill",
                col: 3,
                row: 2,
                title: "Type every field",
                sub: "tag #, breed, sex, birth date, weight, lot",
                note: "roughly five minutes each",
              },
              { id: "missing", col: 3, row: 4, kind: "alert", title: "Missing field", sub: "blocks the save, back to the form" },
              { id: "save", col: 4, row: 2, title: "Save", sub: "one record, 69 to go" },
              { id: "more", col: 4, row: 3, kind: "decision", title: "More animals to add" },
              { id: "gave", col: 4, row: 4, kind: "alert", title: "Gave up", sub: "only the key animals entered, and nobody trusts the data" },
            ],
            edges: [
              { from: "farm", to: "open" },
              { from: "open", to: "add" },
              { from: "add", to: "fill" },
              { from: "fill", to: "missing", label: "empty" },
              { from: "fill", to: "save" },
              { from: "save", to: "more" },
              { from: "more", to: "fill", label: "yes, again", dashed: true },
              { from: "more", to: "gave", label: "no patience left" },
            ],
          },
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
          kind: "wires",
          label: "05b · What we tried",
          heading: "Four ways to get a herd into the system.",
          body: [
            "Everything had to survive the same test: a rancher with 70 animals and a spreadsheet he had kept for years. These are the frames that got drawn before the table won.",
          ],
          frames: [
            {
              slug: "oneform",
              title: "The form that existed",
              note: "Six fields, one animal, save, repeat. The baseline we were replacing, drawn out so the loop was impossible to argue with.",
            },
            {
              slug: "wizard",
              title: "Batch wizard",
              note: "The same form cut into steps, filling a batch at a time. Fewer fields on screen, but it still walks you through the herd one group at a time.",
            },
            {
              slug: "import",
              title: "Upload and map",
              note: "Drop the spreadsheet, then say which column is which. Fastest for anyone who already had a file, useless for anyone who did not.",
            },
            {
              slug: "grid",
              title: "Editable table",
              chosen: true,
              note: "Every animal a row, every attribute a column, paste supported and validation in the row. The one surface that worked whether the herd arrived as a file or as a memory.",
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
          caption:
            "Visuals recreated for this case study. The live TaurusWebs UI looks different, but the interaction model is the one that shipped.",
        },

        {
          kind: "flow",
          label: "06b · After",
          heading: "The new flow: one table, filled, checked, ingested.",
          body: [
            "Eligible farms open straight into the table. Rows get pasted or filled with presets, validation flags bad data inline, and the whole herd is selected and ingested in a single pass.",
          ],
          caption: "Every branch merges into one validated ingest. No wire goes back.",
          spec: {
            phases: [
              "1 · Choose paddock",
              "2 · Where they come from",
              "3 · Names and detail",
              "4 · Add to system",
            ],
            nodes: [
              {
                id: "paddock",
                col: 1,
                row: 2,
                kind: "start",
                title: "Create or select a paddock",
                sub: "where this batch of animals lands",
              },
              { id: "move", col: 2, row: 2, kind: "decision", title: "Moving animals you already have" },
              { id: "sheet", col: 2, row: 3, kind: "decision", title: "Import from a sheet" },
              { id: "select", col: 3, row: 1, title: "Select them", sub: "they keep their history" },
              {
                id: "migrate",
                col: 3,
                row: 2,
                kind: "auto",
                title: "Migrate the sheet",
                sub: "the herd they already kept in Excel",
              },
              { id: "create", col: 3, row: 3, title: "Create new animals", sub: "say how many, get that many rows" },
              {
                id: "autofill",
                col: 3,
                row: 4,
                kind: "auto",
                title: "Auto fill",
                sub: "presets and fill down handle the repeating columns",
              },
              {
                id: "validate",
                col: 4,
                row: 2,
                title: "Validation before ingest",
                sub: "bad weights and duplicate tags flagged in the row",
              },
              { id: "add", col: 4, row: 3, kind: "end", title: "Add animals", sub: "the whole herd, one pass" },
            ],
            edges: [
              { from: "paddock", to: "move" },
              { from: "move", to: "select", label: "yes" },
              { from: "move", to: "sheet", label: "no" },
              { from: "sheet", to: "migrate", label: "yes" },
              { from: "sheet", to: "create", label: "no" },
              { from: "create", to: "autofill" },
              { from: "select", to: "validate" },
              { from: "migrate", to: "validate" },
              { from: "autofill", to: "validate" },
              { from: "validate", to: "add" },
            ],
          },
        },

        {
          kind: "gallery",
          label: "07 · From sketch to spec",
          heading: "How the table took shape before it shipped.",
          columns: 3,
          body: [
            "The interaction went from a rough as-is sketch of the spreadsheet workaround, to a table with presets and paste, to an inline validation pass. These wireframes are the artefacts I handed to the developers to build against.",
          ],
          images: [
            {
              src: "/projects/taurus/wire-01-asis.svg",
              alt: "Wireframe: the as-is spreadsheet workaround",
              caption: "01 · As-is: they already work in rows",
              w: 800,
              h: 560,
            },
            {
              src: "/projects/taurus/wire-02-table.svg",
              alt: "Wireframe: table mode with presets and paste",
              caption: "02 · Table mode: presets, paste, fill-down",
              w: 800,
              h: 560,
            },
            {
              src: "/projects/taurus/wire-03-validation.svg",
              alt: "Wireframe: inline validation before ingest",
              caption: "03 · Validation before ingest",
              w: 800,
              h: 560,
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
          image: {
            src: "/projects/taurus/julian-event.jpg",
            alt: "Julian at a TaurusWebs company event",
            caption: "The company's events are always a good time.",
            w: 1050,
            h: 1400,
          },
        },

        {
          kind: "gallery",
          label: "09b · Bootcamp 4.0",
          heading: "Presenting and onboarding, in the same room.",
          columns: 2,
          tone: "band",
          images: [
            {
              src: "/projects/taurus/bootcamp-director.jpg",
              alt: "A company director presenting TaurusWebs at Bootcamp 4.0",
              caption: "Directors presenting the new tools on stage",
              w: 793,
              h: 1400,
            },
            {
              src: "/projects/taurus/bootcamp-night.jpg",
              alt: "Ranchers onboarding their farms on laptops at Bootcamp 4.0",
              caption: "Ranchers loading their own herds, hands on",
              w: 773,
              h: 1400,
            },
          ],
        },

        {
          kind: "text",
          label: "10 · Results",
          heading: "It became the way every farm starts.",
          tone: "band",
          body: [
            "Bulk setup is now the default first step for onboarding a farm, so 100% of new farms come in through it. Even among existing farms already being tracked, 98% moved to bulk, leaving one-by-one entry only to a few very small or legacy clients.",
            "The clearest proof came from Fedegán, Colombia's cattle ranchers' federation, which loads around 2,000 records a month across its farms. At the old rate of five minutes per animal that was roughly 167 hours of monthly data entry. Through the table it dropped to under 33.",
          ],
          stats: [
            {
              number: "100%",
              caption:
                "of new farms now onboard through bulk setup: it's the default first step.",
            },
            {
              number: "98%",
              caption:
                "of existing tracked farms moved to bulk over one-by-one entry.",
            },
            {
              number: "167 → 33 h",
              caption:
                "Fedegán's monthly load for ~2,000 records, from roughly 167 hours to under 33.",
            },
          ],
        },

        {
          kind: "dots",
          label: "10b · The numbers",
          heading: "Counted out.",
          body: [
            "Adoption runs one way and workload runs the other, so the two rows read in opposite directions.",
          ],
          rows: [
            {
              label: "New farms onboarding through bulk",
              value: "100%",
              total: 10,
              before: 0,
              now: 10,
              note: "Bulk setup is the default first step for a new farm, so every one of them now comes in through the table. Among farms already being tracked, 98% moved across too.",
            },
            {
              label: "Fedegán's monthly data entry",
              value: "167 h to under 33 h",
              total: 10,
              before: 10,
              now: 2,
              note: "One dot is roughly seventeen hours. Colombia's cattle ranchers' federation loads around 2,000 records a month; at five minutes per animal that was about 167 hours of typing.",
            },
          ],
        },

        {
          kind: "gallery",
          label: "10b · In their words",
          heading: "A launch with plenty of testimonials.",
          columns: 3,
          body: [
            "Bulk setup launched alongside a wave of new TaurusWebs tools, and it drew steady testimonials from ranchers on the ground. The team runs surveys continuously, so the feedback keeps coming in rather than stopping at launch day.",
          ],
          images: [
            {
              src: "/projects/taurus/testimonial-1.jpg",
              alt: "A rancher giving feedback about TaurusWebs at Bootcamp 4.0",
              caption: "Rancher feedback · Bootcamp 4.0",
              w: 1400,
              h: 722,
            },
            {
              src: "/projects/taurus/testimonial-2.jpg",
              alt: "A rancher giving feedback about TaurusWebs at Bootcamp 4.0",
              caption: "Rancher feedback · Bootcamp 4.0",
              w: 1400,
              h: 719,
            },
            {
              src: "/projects/taurus/testimonial-3.jpg",
              alt: "A rancher giving feedback about TaurusWebs at Bootcamp 4.0",
              caption: "Rancher feedback · Bootcamp 4.0",
              w: 1400,
              h: 741,
            },
          ],
        },

        {
          kind: "text",
          label: "11 · Reflections",
          heading: "Users had already built the fix in Excel.",
          lead: true,
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
    </>
  );
}
