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
      currentSlug="savee"
      meta={{
        index: "01",
        title: "Savee",
        subtitle: "A social planning app that makes responsible consumption the path of least resistance.",
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
            "Savee treats food planning the way social media treats content discovery: an infinite, personalised feed of recipe videos. Behind the scroll sits a complete system: a smart pantry, an auto-updated shopping list, a weekly cooking calendar, and an alert engine that acts before ingredients expire.",
            "The result is an app that doesn't just inspire cooking. It closes the loop between what you watch, what you buy, and what you actually eat.",
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
                "of global food waste comes from households. Around 631 million tonnes a year.",
            },
            {
              icon: "triangle",
              number: "30–40%",
              caption:
                "of food gets thrown out straight from the fridge, mostly impulse buys that never had a recipe attached.",
            },
            {
              icon: "globe",
              number: "1B+",
              caption:
                "meals wasted every day worldwide (UNEP Food Waste Index 2024).",
            },
          ],
          footer:
            "Poor storage makes it worse: ethylene gas and mould create a domino effect. The fix isn't willpower. It's better planning tools.",
        },

        /* ─── 03 Onboarding ─── */
        {
          kind: "questions",
          label: "03 · Onboarding",
          heading: "Eight questions that personalise everything.",
          body: [
            "Before the feed appears, Savee asks a short set of questions. Every answer shapes the algorithm, the shopping cadence, and the portion sizes, right from day one.",
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
            "The core interface is a vertical video feed. Each interaction on the right-hand action bar does one thing, and together they drive the whole planning loop.",
          ],
          items: [
            {
              title: "♥ Like",
              body: "Signals interest to the algorithm. The more you like, the more the feed learns your taste. Cuisine, time, difficulty, and season all adapt quietly.",
            },
            {
              title: "Save",
              body: "Bookmarks a video without committing to it. Saved recipes have their own tab and can be moved to the cooking calendar whenever you're ready.",
            },
            {
              title: "🍴+ Add to list",
              body: "Adds the recipe to the active shopping list and immediately asks when you want to cook it. One tap and the week is planned.",
            },
            {
              title: "Creator card",
              body: "At the bottom of every video is the creator's name and a short recipe title. Tap it to see the full recipe, ingredients, difficulty, and estimated cook time.",
            },
            {
              title: "+ Post (creator)",
              body: "Creators (and eventually regular users) upload recipe videos through the + button. The community builds the catalogue.",
            },
          ],
        },

        /* ─── 05 Calendar ─── */
        {
          kind: "text",
          label: "05 · Calendar & schedule",
          heading: "Plan the week. Never wonder what's for dinner.",
          body: [
            "After adding a recipe to the shopping list, Savee shows a horizontal week view. Each day column shows what's already scheduled, and a + button lets you slot the new recipe into any open day.",
            "The calendar is the connective tissue of the app. It links discovery (the feed) to action (shopping and cooking) and feeds back into the daily reminders.",
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
            "The Fork tab is the operational core of Savee. A toggle in the top-right switches between the flat shopping list and the recipe card view: two ways of looking at the same data.",
          ],
          items: [
            {
              title: "Smart shopping list",
              body: "Pulls all ingredients from your scheduled recipes, grouped by category and sorted by aisle. Savee subtracts what's already in your pantry and flags duplicates. Live shopping mode lets you check items off as you go.",
            },
            {
              title: "Recipe card view (toggle)",
              body: "Switches to a card-per-recipe layout showing difficulty, scheduled date (moveable), estimated cook time, and a full ingredient breakdown.",
            },
            {
              title: "Live portion sync",
              body: "Move the servings slider on any recipe card and the ingredient quantities update instantly, in the card and in the shopping list. Cook for two or ten without doing the math yourself.",
            },
            {
              title: "Moveable cooking date",
              body: "Drag the date chip on a recipe card to reschedule. The calendar and shopping cadence update right away. No friction, no double-entry.",
            },
            {
              title: "Ingredient-level expiry awareness",
              body: "Ingredients from past purchases carry an estimated expiry date. When one gets close, a warning icon appears on the relevant recipe card so you can cook it before it's wasted.",
            },
          ],
        },

        /* ─── 07 Anti-waste loop ─── */
        {
          kind: "text",
          label: "07 · Anti-waste loop",
          heading: "The app that remembers what your fridge forgets.",
          body: [
            "Every day you open Savee, it surfaces the recipe you should cook today. No searching, no indecision. The daily push notification shows the video thumbnail, the cook time, and the first three ingredients.",
            "A second alert watches the pantry for ingredients that weren't used in past recipes and are getting close to expiry. It suggests a recipe that uses them, turning near-waste into tonight's dinner.",
            "If food does get wasted, Savee logs it on your profile so you can spot patterns over time and adjust your shopping frequency or portion sizes. Awareness is the last resort. Prevention is the whole point.",
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
            "The bottom navigation covers every intent in the app. The order is deliberate: discovery first, action last.",
          ],
          items: [
            {
              title: "Home",
              body: "The personalised feed. Infinite vertical scroll of recipe videos shaped by your preferences, cooking history, and what's in your pantry.",
            },
            {
              title: "Search",
              body: "Find recipes by ingredient, cuisine, dietary filter, difficulty, or cook time. Works for planned searches and for 'what can I make with spinach?' moments alike.",
            },
            {
              title: "Fork",
              body: "The shopping list and recipe schedule in one place. Toggle between the flat list and the card-per-recipe view. The operational core of the app.",
            },
            {
              title: "Saved",
              body: "Two sub-tabs: bookmarked videos for future inspiration, and cooked recipes with ratings. Everything you've interacted with, in one place.",
            },
            {
              title: "Profile",
              body: "All onboarding preferences are editable here: diet, skill level, household size, shopping frequency, equipment. Also shows waste-saved stats and cooking streaks.",
            },
          ],
        },

        /* ─── 09 Design ─── */
        {
          kind: "text",
          label: "09 · Design & identity",
          heading: "Fresh, vital, environmental by default.",
          body: [
            "The visual language uses vibrant greens and a confident display typeface to communicate freshness and environmental intent, without the guilt-trip tone that most sustainability apps default to.",
            "The interface is dark-first to put recipe videos front and centre. The fork-and-plough mark connects the origin of food to the plate: a minimal icon that encodes the whole philosophy.",
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
            "Savee's measurable goal is to reduce per-capita household food waste by 25% within the first year of consistent use. It's a direct contribution to UN SDG 12.3, which targets halving global food waste by 2030.",
            "The approach is behavioural, not punitive: better planning, better awareness, better habits. When the daily loop becomes routine, waste reduction is just what happens.",
          ],
          stats: [
            {
              icon: "percent",
              number: "25%",
              caption:
                "target reduction in per-capita household food waste within the first year.",
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
                "engagement loop: one reminder, one recipe, one less wasted ingredient per day.",
            },
          ],
        },

        /* ─── 11 Screens ─── */
        {
          kind: "screens",
          label: "11 · Screens",
          heading: "The app in motion.",
          body: [
            "Key screens from the Home feed, recipe discovery, and the Shopping List: the three surfaces users spend the most time with in the daily loop.",
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
            "From first login to daily waste-free cooking. One continuous loop across four phases: Onboarding, Discover & Schedule, Shop & Cook, Track & Loop.",
          ],
        },
      ]}
    />
  );
}
