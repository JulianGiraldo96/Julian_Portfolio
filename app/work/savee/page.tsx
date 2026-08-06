import type { Metadata } from "next";
import { V2CaseStudy } from "@/components/v2/V2CaseStudy";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "Savee | Julian Giraldo",
  description:
    "Savee: a short video recipe feed where saving a recipe schedules the meal and folds its ingredients into one shopping list, grouped by aisle and sized to your portions. Households throw out 30 to 40% of what they buy, mostly things that never had a recipe attached.",
  alternates: { canonical: `${SITE}/work/savee` },
  openGraph: {
    type: "article",
    title: "Savee",
    description:
      "Save a recipe and the shopping list writes itself, in the right quantities.",
    url: `${SITE}/work/savee`,
    images: [`${SITE}/projects/savee/cover.webp`],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Savee",
  description:
    "A zero to one short video recipe app where every saved recipe becomes a scheduled meal and a line on one aisle grouped shopping list.",
  image: `${SITE}/projects/savee/cover.webp`,
  url: `${SITE}/work/savee`,
  datePublished: "2025-01-01",
  author: {
    "@type": "Person",
    name: "Julian Giraldo",
    jobTitle: "Product Designer",
    url: `${SITE}`,
  },
  about: {
    "@type": "SoftwareApplication",
    name: "Savee",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android",
    description:
      "A short video recipe feed that turns saved recipes into scheduled meals and a single portion aware shopping list, aligned with UN Sustainable Development Goal 12.3.",
  },
  keywords:
    "product design, UX design, sustainability, food waste, short video, mobile app, zero to one, visual identity",
};

export default function SaveeV2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <V2CaseStudy
        currentSlug="savee"
        coverScreen="savee"
        tint="#E9F2EB"
        tintDark="#161B17"
        meta={{
          index: "04",
          title: "Savee",
          subtitle:
            "A recipe feed where saving something schedules it, and the shopping list writes itself in the right quantities. Responsible consumption as the path of least resistance.",
          year: "2025",
          role: "UX Design · Visual Identity",
          tags: ["Mobile", "Sustainability", "FoodTech"],
          status: "Master's project, 2025",
        }}
        sections={[
          {
            kind: "columns",
            label: "00 · Overview",
            heading: "A recipe feed that leaves a shopping list behind it.",
            columns: [
              {
                title: "My role",
                body: "Zero to one, alone: the research framing, the product concept, every flow and screen, and the visual identity. Built as part of a Master's project on sustainability and technology.",
              },
              {
                title: "The challenge",
                body: "Household food waste is not a knowledge problem. People know it is wasteful. It happens because deciding what to cook is effort and buying is easy, so the wasteful path is always the path of least resistance.",
              },
              {
                title: "The goal",
                body: "Swap those two around. Attach the plan to the thing people already do for fun, which is watching food videos, and let the shopping list be a by-product rather than a chore.",
              },
            ],
            meta: "Aligned with UN Sustainable Development Goal 12.3",
          },

          {
            kind: "text",
            label: "01 · Context",
            heading: "Most of the problem is in the kitchen, not the supply chain.",
            body: [
              "The framing everyone reaches for is industrial: farms, transport, supermarkets. The numbers point somewhere much less convenient, which is the fridge in your own kitchen.",
              "That reframing is what the whole product rests on. If most of the loss happens at home, then the intervention has to live in the ordinary week, in the gap between buying food and deciding what to cook.",
            ],
            stats: [
              {
                number: "60%",
                caption:
                  "of global food waste comes from households. Around 631 million tonnes a year.",
              },
              {
                number: "30 to 40%",
                caption:
                  "of food is thrown out straight from the fridge, mostly impulse buys that never had a recipe attached.",
              },
              {
                number: "1B+",
                caption:
                  "meals wasted every day worldwide, according to the UNEP Food Waste Index 2024.",
              },
            ],
          },

          {
            kind: "wires",
            label: "02 · From the file",
            heading: "The four screens the whole app is made of.",
            body: [
              "Exported straight from the Figma file. There are only four surfaces, and the argument is in how few there are: discovery, one recipe, one list, and the mark that ties them together.",
            ],
            frames: [
              {
                src: "/projects/savee/process/feed.webp",
                title: "Home",
                note: "A recipe playing full bleed, the creator's handle underneath, and a rail of actions down the right edge. The fork is the one that matters: it schedules the meal and starts the list.",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/savee/process/search.webp",
                title: "Search",
                note: "Discovery by cuisine rather than by ingredient: German, Vegan, Street, Healthy. People look for a mood, not for what is about to expire, and the app meets them there.",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/savee/process/recipe.webp",
                title: "Recipe, scheduled",
                note: "Schedule for a date, adjust portions with a stepper, and the ingredients for this recipe listed underneath. Changing the portions rewrites every quantity below it.",
                w: 390,
                h: 844,
              },
              {
                src: "/projects/savee/process/list.webp",
                title: "My shopping list",
                note: "Everything from every scheduled recipe, summed and grouped by aisle: Veggies and Fruits, Bakery, Butcher. Ticked items strike through rather than disappear.",
                w: 390,
                h: 844,
              },
            ],
          },

          {
            kind: "text",
            label: "03 · The mechanic",
            heading: "Save a recipe, and three things happen at once.",
            body: [
              "The feed is the whole surface: a recipe plays full bleed, with the creator's handle and a rail of actions down the right edge. One of those actions is the fork, and it is the only one that matters.",
              "Tapping it schedules the recipe to a date, sizes it to your portions, and folds its ingredients into a single shopping list. Nothing is typed, no plan is filled in, and the list is never maintained: it is what the saved recipes add up to.",
              "The portion stepper is the quiet centrepiece. Cooking for two instead of four halves every quantity on the list, which is the difference between buying a kilo of potatoes and buying what the week actually eats.",
            ],
            image: {
              src: "/projects/savee/home-1.webp",
              alt: "Savee, a recipe playing full bleed with the save actions down the right edge",
              caption: "The feed, where the planning happens without looking like planning",
              w: 1170,
              h: 2532,
            },
          },

          {
            kind: "text",
            label: "04 · The list",
            heading: "One list, grouped the way a shop is.",
            body: [
              "Every saved recipe feeds the same list, and the list is grouped by aisle rather than by recipe: Veggies and Fruits, Bakery, Butcher. That grouping is the whole reason it works in the shop, because nobody walks a supermarket recipe by recipe.",
              "Quantities are summed across recipes and shown in the units the shop uses, grams, packets and pieces. Ticking something off strikes it through rather than deleting it, so at the till you can still see what the week was supposed to be.",
            ],
            image: {
              src: "/projects/savee/shopping-list.webp",
              alt: "Savee, the shopping list grouped by aisle with quantities summed across recipes",
              caption: "Aisle by aisle, in the units the shop uses",
              w: 1170,
              h: 2532,
            },
          },

          {
            kind: "flow",
            label: "05 · The anti-waste loop",
            heading: "Nothing is bought without a meal already pointing at it.",
            body: [
              "The loop closes because the list can only ever contain ingredients that a scheduled recipe asked for, at the portion size you set. An impulse buy has nowhere to enter.",
            ],
            caption: "Discovery, planning and the shopping list are the same gesture.",
            spec: {
              phases: ["1 · Watch", "2 · Save", "3 · Shop", "4 · Cook"],
              nodes: [
                {
                  id: "feed",
                  col: 1,
                  row: 2,
                  kind: "start",
                  title: "A recipe plays",
                  sub: "short, full bleed, one after another",
                },
                {
                  id: "keep",
                  col: 2,
                  row: 2,
                  kind: "decision",
                  title: "Worth cooking",
                },
                {
                  id: "date",
                  col: 3,
                  row: 1,
                  title: "Schedule it",
                  sub: "the recipe lands on a day",
                },
                {
                  id: "portions",
                  col: 3,
                  row: 2,
                  kind: "auto",
                  title: "Sized to your portions",
                  sub: "every quantity scales with the stepper",
                },
                {
                  id: "list",
                  col: 3,
                  row: 3,
                  kind: "auto",
                  title: "Folded into the list",
                  sub: "grouped by aisle, summed across recipes",
                },
                {
                  id: "shop",
                  col: 4,
                  row: 2,
                  title: "Buy exactly that",
                  sub: "nothing on the list without a meal behind it",
                },
                {
                  id: "cook",
                  col: 4,
                  row: 3,
                  kind: "end",
                  title: "Cook what you bought",
                  sub: "the week closes with an empty fridge, on purpose",
                },
              ],
              edges: [
                { from: "feed", to: "keep" },
                { from: "keep", to: "date", label: "yes" },
                { from: "keep", to: "feed", label: "no", dashed: true },
                { from: "date", to: "portions" },
                { from: "portions", to: "list" },
                { from: "list", to: "shop" },
                { from: "shop", to: "cook" },
              ],
            },
          },

          {
            kind: "gallery",
            label: "06 · Screens",
            heading: "The app in use.",
            columns: 3,
            body: [
              "Discovery by cuisine, a recipe scheduled with its portions and its own list, and the one list everything adds up to.",
            ],
            images: [
              {
                src: "/projects/savee/2.webp",
                alt: "Savee, search with cuisine filters and a grid of short recipe videos",
                caption: "Search, by cuisine rather than by ingredient",
                w: 1170,
                h: 2532,
              },
              {
                src: "/projects/savee/3.webp",
                alt: "Savee, a recipe scheduled to a date with a portion stepper and its ingredient list",
                caption: "A recipe, dated and sized",
                w: 1170,
                h: 2532,
              },
              {
                src: "/projects/savee/1.webp",
                alt: "Savee, the aggregated shopping list with items ticked off",
                caption: "Everything the week needs, in one list",
                w: 1170,
                h: 2532,
              },
            ],
          },

          {
            kind: "text",
            label: "07 · Identity",
            heading: "Dark, quick, and never preachy.",
            image: {
              src: "/projects/savee/process/logo.webp",
              alt: "Savee, the wordmark on the dark splash screen",
              caption: "The wordmark, from the file",
              w: 390,
              h: 844,
            },
            body: [
              "Sustainability design defaults to guilt: earth tones, wilting leaves, a quiet accusation. That was the one thing to avoid, because guilt is a terrible daily companion and this app has to be opened on a Tuesday when nobody feels like cooking.",
              "So the interface is dark and the food is the only thing with colour in it, which is how every video app that people actually enjoy is built. One green accent carries the brand and marks the single action that matters, saving a recipe. Green because the food is green, not because the cause is.",
            ],
          },

          {
            kind: "text",
            label: "08 · Target",
            heading: "A quarter less waste in the first year.",
            tone: "band",
            body: [
              "The project set a target of cutting per capita household food waste by 25% in the first year of use, against the UN's goal of halving global food waste by 2030.",
              "It is a target, not a result. Savee was designed and prototyped as a Master's project, not shipped to households, so what is defensible here is the reasoning and the design, not an outcome.",
            ],
            stats: [
              {
                number: "25%",
                caption:
                  "target reduction in per capita household food waste within the first year.",
              },
              {
                number: "SDG 12.3",
                caption:
                  "the UN goal of halving global food waste by 2030, which the target is set against.",
              },
              {
                number: "Daily",
                caption:
                  "the engagement loop: one reminder, one recipe, one less wasted ingredient.",
              },
            ],
          },

          {
            kind: "text",
            label: "09 · Reflections",
            heading: "Make the good thing the lazy thing.",
            lead: true,
            body: [
              "The research kept saying the same thing in different words: nobody wastes food on purpose, they waste it because planning costs effort at the exact moment they have none. Any design that answers that with education is answering the wrong question.",
              "So the whole product is one move, repeated. Put the plan first, derive everything else from it, and let the sustainable outcome be a side effect of the easiest available path. That is the idea I have taken into every project since.",
            ],
          },
        ]}
      />
    </>
  );
}
