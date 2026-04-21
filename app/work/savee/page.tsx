import type { Metadata } from "next";
import { CaseStudy } from "@/components/CaseStudy";

export const metadata: Metadata = {
  title: "Savee — Julian Giraldo",
  description:
    "Social planner that cuts household food waste through smart meal planning, automated shopping lists and proactive expiry alerts.",
};

export default function SaveePage() {
  return (
    <CaseStudy
      meta={{
        index: "01",
        title: "Savee",
        subtitle: "Rethinking responsible consumption through social planning.",
        year: "2025",
        role: "UX Design · Visual Identity",
        tags: ["Sustainability", "UX", "FoodTech"],
        note: "Developed as part of a Master's project focused on sustainability and technology.",
      }}
      cover={{
        src: "/projects/savee/cover.png",
        alt: "Savee app — three device views (dark, light, color)",
      }}
      sections={[
        {
          kind: "text",
          label: "01 · Executive summary",
          heading: "A social network for your pantry.",
          body: [
            "Savee is a digital platform designed to cut one of the largest inefficiencies in the global food system: waste at home. Through a social-feed interface, the app combines smart recipe planning, automated shopping lists and a proactive alert system based on the life cycle of each ingredient.",
          ],
          image: {
            src: "/projects/savee/logo.png",
            alt: "Savee logo",
            aspect: "aspect-[16/10]",
            bg: "bg-[#0a0a0a]",
          },
        },
        {
          kind: "text",
          label: "02 · Context",
          heading: "Why Savee?",
          body: [
            "According to the UNEP Food Waste Index 2024, the world throws away more than 1 billion meals a day.",
          ],
          stats: [
            {
              icon: "percent",
              number: "60%",
              caption:
                "of global food waste comes from households — about 631 million tonnes per year.",
            },
            {
              icon: "triangle",
              number: "30–40%",
              caption:
                "of food is thrown out straight from the fridge, mostly from impulse buys or lacking clear recipes at the store.",
            },
            {
              icon: "globe",
              number: "1B+",
              caption:
                "meals wasted every day globally (UNEP Food Waste Index 2024).",
            },
          ],
          footer:
            "Improper storage also accelerates the spoilage of nearby fresh produce — ethylene gas and mould create a domino effect that multiplies the problem.",
        },
        {
          kind: "text",
          label: "03 · Solution",
          heading: "An assistant that thinks about your pantry and your calendar.",
          body: [
            "Savee is built as a social network for planning — not just a recipe book, but a tool that adapts to the rhythm of your week and the contents of your fridge.",
          ],
          image: {
            src: "/projects/savee/home.png",
            alt: "Savee home screen",
            aspect: "aspect-[4/5] md:aspect-[16/10]",
            bg: "bg-[#0a0a0a]",
          },
        },
        {
          kind: "list",
          label: "04 · Pillars",
          heading: "Four technical pillars.",
          items: [
            {
              title: "Adaptive planning",
              body: "Dinner for two or a gathering of ten — adjust servings or mark a special date and Savee rebalances portions and ingredients automatically.",
            },
            {
              title: "Smart shopping list",
              body: "Based on the chosen recipes, the app generates an optimised list for your next grocery run, avoiding excess that ends up in the bin.",
            },
            {
              title: "Proactive expiry alerts",
              body: "Savee knows what you bought and when — it nudges: \u201CYour spinach expires soon, add it to tonight's dinner?\u201D",
            },
            {
              title: "Recipe prioritisation",
              body: "On low-energy days, Savee surfaces quick recipes that use the ingredients closest to expiring — nothing gets lost.",
            },
          ],
        },
        {
          kind: "text",
          label: "05 · Design & UX",
          heading: "Fresh, vital, and environmental by default.",
          body: [
            "The visual language leans on vibrant greens and a confident display type to communicate freshness, vitality and environmental commitment.",
            "The feed interface is inspired by modern visual platforms, encouraging discovery and new ways to make use of everyday ingredients. Minimal icons — the fork/ploughing-tool mark — link the origin of food to the plate on the table.",
          ],
          image: {
            src: "/projects/savee/asset-4.svg",
            alt: "Savee visual identity",
            aspect: "aspect-[16/10]",
            bg: "bg-[#e9e9e6]",
          },
        },
        {
          kind: "text",
          label: "06 · Impact",
          heading: "Cutting waste by 25% in the first year.",
          body: [
            "Savee's goal is to reduce per-capita household food waste by 25% within the first year of use — a direct contribution to the UN Sustainable Development Goal 12.3: halving global food waste by 2030.",
          ],
        },
      ]}
    />
  );
}
