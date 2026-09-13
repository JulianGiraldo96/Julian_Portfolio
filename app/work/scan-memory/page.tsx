import type { Metadata } from "next";
import { V2CaseStudy } from "@/components/v2/V2CaseStudy";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "Duo Scan Memory | Julian Giraldo",
  description:
    "Scan Memory for Duo's inventory app: a receiving screen that remembers every unit scanned, flavour by flavour, instead of showing only the last one. Inventory errors down around 30%, loading bay time down 15 to 20%, and no more unstacking pallets to find a miscount.",
  alternates: { canonical: `${SITE}/work/scan-memory` },
  openGraph: {
    type: "article",
    title: "Duo Scan Memory",
    description:
      "A receiving screen that remembers every unit scanned, instead of showing only the last one.",
    url: `${SITE}/work/scan-memory`,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Duo Scan Memory",
  description:
    "A receiving screen that remembers every unit scanned, flavour by flavour, so the loading bay stops counting by hand.",
  url: `${SITE}/work/scan-memory`,
  datePublished: "2025-01-01",
  author: {
    "@type": "Person",
    name: "Julian Giraldo",
    jobTitle: "Product Designer",
    url: `${SITE}`,
  },
  about: {
    "@type": "SoftwareApplication",
    name: "Duo Scan Memory",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "The inventory application for Duo Sicilian Ice Cream, connected directly to the Duo ERP. Handles goods received at the loading bay by barcode scan.",
  },
  keywords:
    "product design, warehouse UX, barcode scanning, inventory, error prevention, internal tools",
};

export default function ScanMemoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <V2CaseStudy
        currentSlug="scan-memory"
        coverScreen="scan-memory"
        tint="#F2EFE8"
        tintDark="#1C1A16"
        meta={{
          index: "03",
          title: "Duo Scan Memory",
          subtitle:
            "The receiving screen showed one barcode at a time and forgot it the moment you scanned the next. Giving it a memory ended the recounts, and the box carrying that went with them.",
          year: "2025",
          role: "Product Design · UX",
          tags: ["Web", "Internal tool", "Warehouse"],
          status: "Shipped, 2025",
        }}
        sections={[
          {
            kind: "columns",
            label: "00 · Overview",
            heading: "A screen that could not tell you what you had just done.",
            columns: [
              {
                title: "My role",
                body: "Designer on the feature, end to end: sitting with the logistics team at the bay, framing what was actually going wrong, designing the interaction, and shipping the screen with the developers.",
              },
              {
                title: "The challenge",
                body: "Goods arriving at the store were scanned one unit at a time, and the screen only ever showed the last barcode read. Nobody could see a running total, so nobody knew what had already gone in.",
              },
              {
                title: "The goal",
                body: "Make the scan visible. If the screen remembers every unit and groups it by flavour, the count is right the first time and nothing has to be checked by hand afterwards.",
              },
            ],
            meta: "Product: internal inventory app, wired straight into the Duo ERP",
          },

          {
            kind: "text",
            label: "01 · The product",
            heading: "The app that puts stock into the ERP.",
            body: [
              "Duo Sicilian Ice Cream runs its operation on an internal ERP: stock, flavours, expiry, orders, deliveries, production and staff across nine locations. The inventory app is the door into it. Everything a store receives is scanned there, and what the scan says becomes what the ERP believes.",
              "That makes the receiving screen the highest leverage surface in the whole chain. If it is wrong, every number built on top of it is wrong too, and somebody downstream pays for it.",
            ],
          },

          {
            kind: "text",
            label: "02 · The problem",
            heading: "One barcode on screen, and then it was gone.",
            body: [
              "The old screen was a full page, almost blank, like a document with a single field in it. You scanned a unit, its code appeared in that field, and the moment you scanned the next one the previous code was replaced. There was no list, no total, no history: at any moment the screen could tell you exactly one thing, the last item you had read.",
              "It got worse because of where the scanning actually happened. The handheld scanner was wired to a computer that was not at the loading bay, so the person scanning was rarely looking at the screen at all. They scanned by feel, at the pallet, and the only feedback available was several metres away.",
              "So people lost count. Extra flavours got scanned by mistake, and sometimes units from a pallet that was not even meant for that store. Nobody noticed until the store's total came out wrong.",
            ],
          },

          {
            kind: "flow",
            label: "02b · Before",
            heading: "Every miscount ended in the same place: carrying boxes.",
            body: [
              "The screen could not tell you what had gone in, so the only way to check was physical. Boxes of ice cream are heavy, and they had to come off the stack and go back on again just to find out where the number had gone wrong.",
            ],
            caption:
              "The last phase is the cost: unstacking a delivery by hand to find a mistake the screen could have prevented.",
            archifySrc: "/flows/scan-memory-before.html",
            spec: {
              phases: [
                "1 · Scan at the bay",
                "2 · What you see",
                "3 · What goes wrong",
                "4 · Fix it by hand",
              ],
              nodes: [
                {
                  id: "bay",
                  col: 1,
                  row: 2,
                  kind: "start",
                  title: "Scan at the loading bay",
                  sub: "handheld scanner, wired to a computer across the room",
                },
                {
                  id: "last",
                  col: 2,
                  row: 2,
                  title: "Only the last code shows",
                  sub: "each scan replaces the one before it",
                },
                {
                  id: "blind",
                  col: 2,
                  row: 3,
                  kind: "alert",
                  title: "No running total",
                  sub: "you never see how much has gone in",
                },
                {
                  id: "extra",
                  col: 3,
                  row: 2,
                  kind: "alert",
                  title: "Extra units scanned",
                  sub: "a wrong flavour, or a pallet meant for another store",
                },
                { id: "check", col: 3, row: 3, kind: "decision", title: "Store total matches" },
                {
                  id: "boxes",
                  col: 4,
                  row: 2,
                  kind: "alert",
                  title: "Unstack the delivery",
                  sub: "heavy boxes off the pallet and back on, just to find the error",
                },
                {
                  id: "type",
                  col: 4,
                  row: 3,
                  kind: "alert",
                  title: "Recount, then type it in",
                  sub: "counted on paper, keyed into the system by hand",
                },
              ],
              edges: [
                { from: "bay", to: "last" },
                { from: "last", to: "blind" },
                { from: "blind", to: "extra" },
                { from: "extra", to: "check" },
                { from: "check", to: "boxes", label: "no" },
                { from: "boxes", to: "type" },
              ],
              lanes: [
                { row: 2, label: "At the bay" },
                { row: 3, label: "Where it falls apart" },
              ],
              cards: [
                {
                  title: "A write only screen",
                  items: [
                    "The screen showed exactly one thing: the last barcode read",
                    "No running total meant nobody could see a shortage forming",
                    "Finding the miscount meant unstacking a delivery by hand",
                  ],
                },
              ],
            },
          },

          {
            kind: "list",
            label: "03 · What the bay actually needed",
            heading: "The fix was memory, not a better form.",
            body: [
              "Watching a delivery come in made the shape of the problem obvious. Nothing about the scanning was hard. What was missing was any record of it.",
            ],
            items: [
              {
                title: "Feedback has to survive the walk",
                body: "The person scanning is at the pallet and the screen is across the room. Anything that only exists for one second, like a code that gets replaced, may as well not exist at all.",
              },
              {
                title: "People count in flavours, not barcodes",
                body: "Nobody at the bay thinks in unit codes. They think in Pistacchio, Stracciatella, Nocciola. A list grouped by flavour with a count against each is the shape the work already has.",
              },
              {
                title: "The store has to be chosen before the first scan",
                body: "Half the wrong units came from pallets destined elsewhere. Picking the store up front turns that from a mistake you discover later into a context the screen already knows.",
              },
              {
                title: "A mistake should be undone the same way it was made",
                body: "If you scanned something in by accident, the natural correction is to scan it again to take it off. Typing a correction is a second chance to get it wrong.",
              },
            ],
          },

          {
            kind: "wires",
            label: "03b · What we tried",
            heading: "Four ways to make a scan visible.",
            body: [
              "The constraint shaped every option: the person scanning is at the pallet and the screen is across the room, so whatever goes on it has to be readable at a glance and survive not being watched. These are the frames that got drawn before the list won.",
            ],
            frames: [
              {
                slug: "ticker",
                title: "Ticker",
                note: "The smallest change: keep the big field, slide the previous codes underneath it. Readable, but it still only remembers the last handful, so the total was never there.",
              },
              {
                slug: "tiles",
                title: "Flavour tiles",
                note: "One tile per flavour, counts big enough to read from the pallet. Best at distance, but the grid grows with the catalogue and stops fitting on a screen.",
              },
              {
                slug: "manifest",
                title: "Manifest and arrivals",
                note: "The delivery note on one side, what was scanned on the other, ticking off as they match. The strongest check, and the one that needs a manifest the bay does not always get.",
              },
              {
                slug: "list",
                title: "Running list",
                chosen: true,
                note: "Store first, the field where it always was, and everything scanned laid out below with a count against each. Nothing new to learn, and the total is always on screen.",
              },
            ],
          },

          {
            kind: "text",
            label: "04 · The solution",
            heading: "The screen remembers, and shows the count while you work.",
            body: [
              "You choose the store from the same dropdown, before anything else. Then you scan exactly as you did before, with the same handheld, in the same place. Nothing about the physical job changed, which is why nobody had to be retrained.",
              "What changed is the bottom of the screen, which used to be empty. Every scan now lands in a list: each flavour and how many units of it have gone in, updating as you go, with a total across the top. When the pallet is done you press Accept and it goes straight into the ERP, with no one retyping anything.",
              "If something was scanned by mistake there are two ways back. You can fix the row where you are looking at it: step a unit off with the minus, add one with the plus, or drop the whole flavour with the delete on the right. Or you choose Remove unit and scan that unit again, which is the faster path when you still have the box in your hand. Either way there is no keyboard in the loop, so there is no typo in the loop.",
            ],
          },

          {
            kind: "flow",
            label: "04b · After",
            heading: "The count builds itself, and corrects itself.",
            body: [
              "Same scanner, same bay, same movements. The difference is that the screen now holds everything that has happened, and offers the two things you actually want at the end: send it, or take one back off.",
            ],
            caption: "No paper, no keyboard, and nothing to recount.",
            archifySrc: "/flows/scan-memory-after.html",
            spec: {
              phases: [
                "1 · Choose the store",
                "2 · Scan",
                "3 · See the count",
                "4 · Send it",
              ],
              nodes: [
                {
                  id: "store",
                  col: 1,
                  row: 2,
                  kind: "start",
                  title: "Pick the store",
                  sub: "same dropdown, before the first scan",
                },
                {
                  id: "scan",
                  col: 2,
                  row: 2,
                  title: "Scan exactly as before",
                  sub: "same handheld, nothing new to learn",
                },
                {
                  id: "list",
                  col: 3,
                  row: 1,
                  kind: "auto",
                  title: "The count builds itself",
                  sub: "every flavour and how many of each, live",
                },
                {
                  id: "wrong",
                  col: 3,
                  row: 4,
                  kind: "decision",
                  title: "Something scanned by mistake",
                },
                {
                  id: "accept",
                  col: 4,
                  row: 1,
                  kind: "end",
                  title: "Accept",
                  sub: "straight into the ERP, nothing retyped",
                },
                {
                  id: "remove",
                  col: 4,
                  row: 4,
                  title: "Remove unit",
                  sub: "scan that same unit again to take it off",
                },
              ],
              edges: [
                { from: "store", to: "scan" },
                { from: "scan", to: "list" },
                { from: "list", to: "wrong" },
                { from: "wrong", to: "accept", label: "no" },
                { from: "wrong", to: "remove", label: "yes" },
                { from: "remove", to: "list" },
              ],
              lanes: [
                { row: 1, label: "On the screen" },
                { row: 2, label: "At the bay" },
                { row: 4, label: "If something's off" },
              ],
              cards: [
                {
                  title: "Feedback survives the walk",
                  items: [
                    "The list lives on screen the whole time, not for one second",
                    "A mistake is undone the same way it was made: scan again",
                  ],
                },
                {
                  title: "The result",
                  items: [
                    "Inventory errors down about 30%",
                    "Loading bay time down 15 to 20%",
                    "Unstacking a pallet to find a miscount is gone",
                  ],
                },
              ],
            },
          },

          {
            kind: "text",
            label: "05 · Results",
            heading: "The number is right the first time.",
            body: [
              "Errors in the general inventory dropped by roughly 30%, and the time a delivery spends at the loading bay came down by 15 to 20%. Those are the numbers the operation tracks.",
              "The result the team actually talks about is not on that list. Before this, finding a miscount meant carrying boxes of ice cream off the stack and putting them back, over and over, to work out where the difference was. That work is simply gone. The logistics team were the happiest people about the change, and they were right to be: the screen absorbed a job that used to be done with their backs.",
            ],
          },

          {
            kind: "dots",
            label: "05b · The numbers",
            heading: "The same three figures, counted out.",
            body: [
              "Every dot in the top row is what it used to be. The bottom row is what is left.",
            ],
            rows: [
              {
                label: "Errors in the general inventory",
                value: "~30% fewer",
                total: 10,
                now: 7,
                note: "Roughly three errors in every ten stopped happening, because the count is now visible while it is being made rather than checked afterwards.",
              },
              {
                label: "Time at the loading bay",
                value: "15 to 20% less",
                total: 20,
                now: 16,
                note: "One dot is six minutes of a two hour window. Nothing gets scanned twice and nothing gets checked afterwards, so the delivery closes sooner.",
              },
              {
                label: "Unstacking a pallet to find a miscount",
                value: "Gone",
                total: 10,
                now: 0,
                note: "The check that used to be done by carrying boxes off the stack and putting them back does not happen at all any more. This is the change the logistics team actually talk about.",
              },
            ],
          },

          {
            kind: "text",
            label: "06 · Reflections",
            heading: "The interface was write only.",
            lead: true,
            body: [
              "The old screen accepted input and gave nothing back. Everything it was told, it immediately forgot. That is a strange thing to build, and nobody set out to build it: it was a form that grew into a workflow without anyone stopping to ask what the person holding the scanner could actually see.",
              "The lesson I keep from it is that feedback is not a polish layer. Here it was the entire feature. The scanning was already fine. Making the result visible is what removed the recount, the retyping, and the box carrying underneath both.",
            ],
          },
        ]}
      />
    </>
  );
}
