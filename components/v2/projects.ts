import type { FolderProject } from "./ProjectFolder";

/* Every project, in one place. The home grid and the row at the foot of a
   case study read from the same list, so a card is the same card wherever it
   appears and there is nothing to keep in sync. */
export const work: FolderProject[] = [
  {
    slug: "erp-duo",
    href: "/work/erp-duo",
    feature: "Ops Dashboard",
    title: "ERP Duo",
    headline: "Nine locations. One system. Full control.",
    tags: ["9 locations", "13 modules", "Shipped"],
    year: "2024 to now",
    shape: "desktop",
    bg: "#EDEFEC",
    bgDark: "#1A1C19",
  },
  {
    slug: "scan-memory",
    feature: "Scan Memory",
    title: "Duo Scan Memory",
    headline: "The scanner remembers what you scanned.",
    tags: ["Warehouse", "-30% errors", "Shipped"],
    year: "2025",
    shape: "desktop",
    bg: "#F2EFE8",
    bgDark: "#1C1A16",
    href: "/work/scan-memory",
  },
  {
    slug: "taurus",
    feature: "Bulk Action",
    title: "TaurusWebs",
    headline: "From 6 hours to 1: digitizing a whole farm.",
    tags: ["Bulk entry", "6h to 1h", "Agtech"],
    year: "2020",
    shape: "desktop",
    bg: "#E7EEF8",
    bgDark: "#15191F",
    href: "/work/taurus",
  },
  {
    slug: "savee",
    academic: true,
    href: "/work/savee",
    feature: "Meal Planning",
    title: "Savee",
    headline: "Watch a recipe, and the shopping list writes itself.",
    tags: ["0 to 1", "Short video", "Zero waste"],
    year: "2025",
    shape: "phone",
    bg: "#E9F2EB",
    bgDark: "#232C25",
  },
  {
    slug: "meinerva",
    academic: true,
    href: "/work/meinerva",
    feature: "Guided Reading",
    title: "Meinerva",
    headline: "Look before you're told: making experimental art legible.",
    tags: ["Thesis", "Research", "Art & tech"],
    year: "2025",
    shape: "phone",
    bg: "#17171A",
    bgDark: "#141417",
    dark: true,
  },
];

/* "Design and other things" is hidden until it has real graphic design work in
   it: the tiles are currently placeholders and a banner, which undersells the
   rest of the page. Flip this to true and the section and its nav link both
   come back. */
export const showOtherThings = false;

/* The home page shows these as two sections: what shipped, and what was
   written at university. Both read from the list above so a project only ever
   has to be described once. */
export const professional = work.filter((p) => !p.academic);
export const academic = work.filter((p) => p.academic);
