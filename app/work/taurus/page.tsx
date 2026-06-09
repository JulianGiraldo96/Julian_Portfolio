import type { Metadata } from "next";
import { CaseStudy } from "@/components/CaseStudy";

export const metadata: Metadata = {
  title: "Taurus — Julian Giraldo",
  description:
    "Bulk Farm Setup for TaurusWebs: an editable table that cut herd data entry from ~6 hours to 1 per farm and got ranchers to digitize the whole herd instead of only the key animals.",
};

export default function TaurusPage() {
  return (
    <CaseStudy
      currentSlug="taurus"
      meta={{
        index: "03",
        title: "Taurus",
        subtitle:
          "An editable table that cut data entry from ~6 hours to 1 per farm — and got ranchers to digitize the whole herd instead of just the key animals.",
        year: "2024–2025",
        role: "Product Design · UX · Research",
        tags: ["Web", "SaaS", "Agtech"],
        status: "Shipped · 2025",
        note: "Real product work · no NDA · TaurusWebs livestock platform",
      }}
      cover={{
        alt: "Taurus — Bulk Farm Setup table",
        gradient:
          "bg-gradient-to-br from-[#16301f] via-[#3f6b3f] to-[#b9d27a]",
      }}
      sections={[
        {
          kind: "text",
          label: "01 · Company",
          heading: "A livestock platform built for the field, not the office.",
          body: [
            "TaurusWebs is a SaaS for cattle ranchers: herd records, weight tracking, sanitary plans, and inventory for feed and supplies, all in one place. Its customers range from single-farm owners to multi-farm livestock companies running several properties at once.",
            "The promise was simple: stop running the ranch on paper notebooks and WhatsApp, and get a real, queryable record of every animal. The catch was getting that record in to begin with.",
          ],
        },

        {
          kind: "text",
          label: "02 · Product & users",
          heading: "Two very different people touch the same data.",
          body: [
            "The owner wants reports, weights, and traceability. The worker, often a ranch hand entering data from a phone in the field, just wants to finish and get back to work. Digital comfort varies a lot between them, and the onboarding moment depends entirely on the size of the herd.",
            "Onboarding a new farm means entering its entire existing herd plus its inventory before the software is useful at all. That first load is where customers decided whether Taurus was worth it.",
          ],
        },

        {
          kind: "text",
          label: "03 · Problem",
          heading: "Onboarding meant typing each animal in, one at a time.",
          body: [
            "The only way to register animals was a single-record form: open it, fill six or seven fields, save, repeat. For one animal that is fine. For a herd, it collapses.",
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
          kind: "text",
          label: "04 · Discovery",
          heading: "The workaround was already a table.",
          body: [
            "Through informal interviews with both clients and the workers doing the entry, one pattern kept coming up: nobody actually worked animal-by-animal in their head. They kept their herd as a list, in a notebook column or a spreadsheet, and the form was just a slow gate they had to push that list through, one row at a time.",
            "The insight wasn't that the form needed fewer fields. It was that the form was the wrong shape entirely. People already thought in rows and columns. The product was forcing them out of that mental model and into a funnel.",
          ],
        },

        {
          kind: "questions",
          label: "05 · User stories",
          heading: "What the entry flow actually needed to support.",
          body: [
            "Reframing the problem around the table made the requirements obvious. Each one maps to a real frustration heard in the interviews.",
          ],
          items: [
            {
              question: "As a rancher, I want to load my whole herd at once, not animal by animal.",
              hint: "Bulk entry · one screen",
            },
            {
              question: "As a worker, I want to paste what I already have in a spreadsheet.",
              hint: "Paste from sheet · no retyping",
            },
            {
              question: "As an owner, I don't want to repeat the same breed and lot on every row.",
              hint: "Presets · fill-down",
            },
            {
              question: "As a new user, I want to see and fix my mistakes before anything is saved.",
              hint: "Inline validation · review",
            },
            {
              question: "As a multi-farm company, I want each property loaded the same fast way.",
              hint: "Repeatable · per farm",
            },
            {
              question: "As a rancher, I want the full herd in the system, not just the favourites.",
              hint: "Complete record · trustworthy data",
            },
          ],
        },

        {
          kind: "bulktable",
          label: "06 · Solution",
          heading: "One editable table that ingests an entire farm.",
          body: [
            "Instead of a form per animal, Taurus got a table mode: every animal is a row, every attribute a column, and the whole herd is filled, corrected, and submitted in a single pass. The same surface people already used to think about their cattle became the surface they entered it through.",
            "Toggle below between the old one-by-one form and the table that replaced it.",
          ],
          footer:
            "Recreated in Julian's design for this case study — the live Taurus UI differs, but the interaction model is the one that shipped.",
        },

        {
          kind: "list",
          label: "07 · User testing",
          heading: "Testing turned a blank table into a fast one.",
          body: [
            "A raw editable grid is faster than a form, but watching people use it surfaced the real bottleneck: they were still typing the same handful of values over and over. The table actions below came directly from those sessions.",
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
          label: "08 · Result",
          heading: "From a day's work to about an hour.",
          body: [
            "The table mode took the standard-farm load from roughly six hours to about one, and per-animal entry from five minutes to under one. More importantly, it changed behaviour: clients started loading the full herd and their inventory instead of only the animals they cared most about.",
            "That completeness is the real win. A half-entered herd is a database nobody trusts; a full one is the source of truth the platform was always supposed to be.",
          ],
          stats: [
            {
              icon: "percent",
              number: "−83%",
              caption:
                "load time for a standard 70-animal farm: from ~6 hours down to about 1.",
            },
            {
              icon: "bolt",
              number: "<1 min",
              caption:
                "per animal in the table, versus 5 minutes through the old single-record form.",
            },
            {
              icon: "dot",
              number: "Full herd",
              caption:
                "now loaded with inventory, instead of only the handful of key animals.",
            },
          ],
        },

        {
          kind: "text",
          label: "09 · Reflections",
          heading: "The fastest UI was the one users had already invented.",
          body: [
            "The fix here wasn't a clever feature. It was noticing that customers had already designed the right interaction in their notebooks and spreadsheets, and that the product was working against it. The job was to remove the funnel and meet them where they already were.",
            "It also reset how I treat onboarding: the first data load isn't a setup chore to get past, it's the moment a customer decides whether the whole product is worth it. Make that fast and complete, and everything downstream finally has data it can stand on.",
          ],
        },
      ]}
    />
  );
}
