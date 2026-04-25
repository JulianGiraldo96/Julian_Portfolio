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
        alt: "Savee app, three device views (dark, light, color)",
      }}
      sections={[
        /* ─── 01 Overview ─── */
        {
          kind: "text",
          label: "01 · Overview",
          heading: "A social network designed to end food waste at home.",
          body: [
            "Savee is a digital platform that treats food planning the way social media treats content discovery, through an infinite, personalised feed of recipe videos. Beneath the scroll lies a complete system: a smart pantry, an auto-updated shopping list, a weekly cooking calendar and a proactive alert engine that acts before ingredients expire.",
            "The result is an app that doesn't just inspire cooking, it closes the loop between what you watch, what you buy and what you actually eat.",
          ],
          image: {
            src: "/projects/savee/logo.png",
            alt: "Savee app - launch screen",
            position: "right",
          },
        },

        /* ─── 02 Context ─── */
        {
          kind: "text",
          label: "02 · Context",
          heading: "Why Savee?",
          body: [
            "According to the UNEP Food Waste Index 2024, the world throws away more than 1 billion meals a day. The biggest contributor isn't industry, it's the household.",
          ],
          stats: [
            {
              icon: "percent",
              number: "60%",
              caption:
                "of global food waste comes from households, roughly 631 million tonnes per year.",
            },
            {
              icon: "triangle",
              number: "30–40%",
              caption:
                "of food is discarded straight from the fridge, mostly impulse buys without a recipe to go with them.",
            },
            {
              icon: "globe",
              number: "1B+",
              caption:
                "meals wasted every day globally (UNEP Food Waste Index 2024).",
            },
          ],
          footer:
            "Improper storage accelerates spoilage further, ethylene gas and mould create a domino effect that multiplies the problem. The fix isn't willpower: it's better planning tools.",
        },

        /* ─── 03 Onboarding ─── */
        {
          kind: "questions",
          label: "03 · Onboarding",
          heading: "Eight questions that personalise everything.",
          body: [
            "Before the feed appears, Savee asks a short set of questions. Every answer shapes the algorithm, the shopping cadence and the portion sizes, from day one.",
          ],
          items: [
            {
              question: "What do you like to eat?",
              hint: "Cuisine types · multi-select",
            },
            {
              question: "Which meals do you cook at home?",
              hint: "Breakfast · lunch · dinner · brunch · snacks",
            },
            {
              question: "Any dietary requirements?",
              hint: "Vegan · vegetarian · gluten-free · halal · allergies",
            },
            {
              question: "How often do you shop for groceries?",
              hint: "Twice a week · weekly · bi-weekly · monthly",
            },
            {
              question: "How many people do you cook for?",
              hint: "Household size · adjusts portions automatically",
            },
            {
              question: "What's your cooking skill level?",
              hint: "Beginner ≤ 30 min · home cook · enthusiast 1 h+",
            },
            {
              question: "How much time do you have on weekdays?",
              hint: "Quick < 20 min · moderate 30–45 min · no rush",
            },
            {
              question: "What kitchen equipment do you have?",
              hint: "Oven · air fryer · slow cooker · wok · etc.",
            },
          ],
        },

        /* ─── 04 The feed ─── */
        {
          kind: "list",
          label: "04 · The feed",
          heading: "Social media-simple. Infinitely useful.",
          body: [
            "The core interface is a vertical video feed. Every interaction on the right-hand action bar does exactly one thing, and together they drive the entire planning loop.",
          ],
          items: [
            {
              title: "♥ Like",
              body: "Signals interest to the algorithm. The more you like, the more the feed learns your taste, recipes by cuisine, time, difficulty and season all adapt silently.",
            },
            {
              title: "Save",
              body: "Bookmarks a video without committing to it. Saved recipes live in their own tab and can be promoted to the cooking calendar at any point.",
            },
            {
              title: "🍴+ Add to list",
              body: "Adds the recipe to the active shopping list and immediately asks when you want to cook it. One tap plans the whole week.",
            },
            {
              title: "Creator card",
              body: "At the bottom of every video sits the creator's name and a brief recipe title. Tapping opens the full recipe, ingredients, difficulty level and estimated cook time.",
            },
            {
              title: "+ Post (creator)",
              body: "Creators, and eventually users, upload recipe videos through the + button on the action bar. The community grows the catalogue.",
            },
          ],
        },

        /* ─── 05 Calendar ─── */
        {
          kind: "text",
          label: "05 · Calendar & schedule",
          heading: "Plan the week. Never wonder what's for dinner.",
          body: [
            "After adding a recipe to the shopping list, Savee shows a horizontal week view. Each day column displays the recipes already scheduled underneath it; a + button lets you slot the new recipe on any open day.",
            "The calendar is the connective tissue of the app, it links discovery (the feed) to action (shopping and cooking) and closes the loop back to daily reminders.",
          ],
          image: {
            src: "/projects/savee/home-1.png",
            alt: "Savee calendar scheduling view",
            position: "right",
            bg: "bg-[#0a0a0a]",
          },
        },

        /* ─── 06 Fork — shopping list ─── */
        {
          kind: "list",
          label: "06 · Fork, shopping list",
          heading: "One toggle. Two views.",
          body: [
            "The Fork tab is the operational core of Savee. A toggle in the top-right switches between the flat shopping list and the recipe card view, two lenses on the same data.",
          ],
          items: [
            {
              title: "Smart shopping list",
              body: "Aggregates all ingredients from scheduled recipes, grouped by category and sorted by aisle. Savee subtracts what's already in your pantry and flags duplicates. A live shopping mode lets you check items off in-store.",
            },
            {
              title: "Recipe card view (toggle)",
              body: "Switches to a card-per-recipe layout showing difficulty, scheduled date (moveable), estimated cook time and a full ingredient breakdown for that recipe.",
            },
            {
              title: "Live portion sync",
              body: "Adjust the servings slider on any recipe card and the ingredient quantities update in real time, both in the card and directly in the shopping list. Cook for two or ten without manual recalculation.",
            },
            {
              title: "Moveable cooking date",
              body: "Drag the date chip on a recipe card to reschedule. The calendar view and the shopping cadence update instantly, no friction, no double-entry.",
            },
            {
              title: "Ingredient-level expiry awareness",
              body: "Ingredients sourced from past purchases carry an estimated expiry date. When they approach it, a warning icon appears on the relevant recipe card so you can prioritise it.",
            },
          ],
        },

        /* ─── 07 Anti-waste loop ─── */
        {
          kind: "text",
          label: "07 · Anti-waste loop",
          heading: "The app that remembers what your fridge forgets.",
          body: [
            "Every day you open Savee, it surfaces the recipe you should cook today, no searching, no indecision. The daily push notification shows the video thumbnail, the cook time and the first three ingredients.",
            "A second, parallel alert watches the pantry for ingredients that weren't consumed in past recipes and are approaching expiry. It suggests a recipe that uses them, turning near-waste into tonight's dinner.",
            "If food is wasted despite the nudges, Savee logs it on your profile so you can track the trend over time and adjust your shopping frequency or portion sizes. Waste awareness is the last resort; prevention is the design intent.",
          ],
          image: {
            src: "/projects/savee/shopping-list.png",
            alt: "Savee shopping list with expiry alerts",
            position: "right",
            bg: "bg-[#0a0a0a]",
          },
        },

        /* ─── 08 Navigation ─── */
        {
          kind: "list",
          label: "08 · Navigation",
          heading: "Five destinations. Zero friction.",
          body: [
            "The bottom navigation bar covers every intent in the app. The order is deliberate, discovery first, action last.",
          ],
          items: [
            {
              title: "Home",
              body: "The personalised feed. Infinite vertical scroll of recipe videos curated by your preferences, cook history and what's in your pantry.",
            },
            {
              title: "Search",
              body: "Find recipes by ingredient, cuisine, dietary filter, difficulty or cook time. Useful for planned searches and for ad-hoc 'what can I make with spinach?' queries.",
            },
            {
              title: "Fork",
              body: "The shopping list and recipe schedule. Toggle between the flat list and the card-per-recipe view. The operational hub of the app.",
            },
            {
              title: "Saved",
              body: "Two sub-tabs: bookmarked videos (future inspiration) and cooked recipes (cook history with ratings). The archive of everything you've interacted with.",
            },
            {
              title: "Profile",
              body: "All onboarding preferences are editable here, diet, skill level, household size, shopping frequency, equipment. Also shows waste-saved stats and cooking streaks.",
            },
          ],
        },

        /* ─── 09 Design ─── */
        {
          kind: "text",
          label: "09 · Design & identity",
          heading: "Fresh, vital, environmental by default.",
          body: [
            "The visual language leans on vibrant greens and a confident display typeface to communicate freshness, vitality and environmental commitment, without the guilt-trip tone common in sustainability apps.",
            "The interface is dark-first to put recipe videos centre stage. The fork-and-plough mark links the origin of food to the plate: a minimal icon that encodes the app's entire philosophy.",
          ],
          image: {
            src: "/projects/savee/asset-4.svg",
            alt: "Savee visual identity system",
            width: "25%",
          },
        },

        /* ─── 10 Impact ─── */
        {
          kind: "text",
          label: "10 · Impact",
          heading: "Cutting waste by 25% in the first year.",
          body: [
            "Savee's measurable goal is to reduce per-capita household food waste by 25% within the first year of consistent use. That's a direct contribution to UN SDG 12.3: halving global food waste by 2030.",
            "The mechanism is behavioural, not punitive, better planning, better awareness, better habits. When the daily loop becomes routine, waste reduction follows as a natural side-effect.",
          ],
          stats: [
            {
              icon: "percent",
              number: "25%",
              caption:
                "target reduction in per-capita household food waste within the first year of use.",
            },
            {
              icon: "leaf",
              number: "SDG 12.3",
              caption:
                "aligned with the UN goal of halving global food waste by 2030.",
            },
            {
              icon: "bolt",
              number: "Daily",
              caption:
                "engagement model, one reminder, one recipe, one less wasted ingredient per day.",
            },
          ],
        },

        /* ─── 11 Screens ─── */
        {
          kind: "screens",
          label: "11 · Screens",
          heading: "The app in motion.",
          body: [
            "Key screens from the Home feed, recipe discovery and Shopping List, the three surfaces users interact with most in the daily loop.",
          ],
          images: [
            {
              src: "/projects/savee/1.png",
              alt: "Savee — Screen 1",
            },
            {
              src: "/projects/savee/2.png",
              alt: "Savee — Screen 2",
            },
            {
              src: "/projects/savee/3.png",
              alt: "Savee — Screen 3",
            },
            {
              src: "/projects/savee/4.png",
              alt: "Savee — Screen 4",
            },
            {
              src: "/projects/savee/5.png",
              alt: "Savee — Screen 5",
            },
            {
              src: "/projects/savee/6.png",
              alt: "Savee — Screen 6",
            },
          ],
        },

        /* ─── 12 User flow ─── */
        {
          kind: "flow",
          label: "12 · User flow",
          heading: "End-to-end journey.",
          body: [
            "From first login to daily waste-free cooking, one continuous loop across four phases: Onboarding, Discover & Schedule, Shop & Cook, Track & Loop.",
          ],
        },
      ]}
    />
  );
}
