import type { Metadata } from "next";
import { V2CaseStudy } from "@/components/v2/V2CaseStudy";

const SITE = "https://juliang.de";

export const metadata: Metadata = {
  title: "ERP Duo | Julian Giraldo",
  description:
    "A custom ERP for Duo Sicilian Ice Cream: nine locations, six departments, forty document types, role based access and a timestamped history on every record.",
  alternates: { canonical: `${SITE}/work/erp-duo` },
  openGraph: {
    type: "article",
    title: "ERP Duo",
    description:
      "Nine locations of operational data, brought into one system you can actually audit.",
    url: `${SITE}/work/erp-duo`,
    images: [`${SITE}/projects/erp-duo/cover.webp`],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "ERP Duo",
  description:
    "A custom ERP running nine locations and six departments for Duo Sicilian Ice Cream, with role based access and full document traceability.",
  image: `${SITE}/projects/erp-duo/cover.webp`,
  url: `${SITE}/work/erp-duo`,
  datePublished: "2026-01-01",
  author: {
    "@type": "Person",
    name: "Julian Giraldo",
    jobTitle: "Product Designer",
    url: `${SITE}`,
  },
  about: {
    "@type": "SoftwareApplication",
    name: "ERP Duo",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Enterprise resource planning for a nine location food business: inventory, orders, production batches, HR documentation, logistics and procurement.",
  },
  keywords:
    "product design, ERP, internal tools, data architecture, role based access, operations, B2B SaaS",
};

export default function ErpDuoV2Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <V2CaseStudy
        currentSlug="erp-duo"
        coverScreen="erp-duo"
        tint="#EDEFEC"
        tintDark="#1A1C19"
        meta={{
          index: "01",
          title: "ERP Duo",
          subtitle:
            "Nine locations of operational data, brought into one system you can actually audit.",
          year: "2026",
          role: "Product Design · UX · Interaction Design",
          tags: ["Web", "ERP", "Operations"],
          status: "Live, 2026",
        }}
        sections={[
          {
            kind: "columns",
            label: "00 · Overview",
            heading: "Nine locations. No single source of truth.",
            columns: [
              {
                title: "My role",
                body: "Product designer on the whole system: auditing what the business actually tracked, mapping the data model with the people who owned it, designing every module, and shipping the interface with the developers.",
              },
              {
                title: "The challenge",
                body: "Production, retail, logistics and administration all moved at the same time and mostly could not see each other. Critical data lived in spreadsheets, WhatsApp threads and personal inboxes: no structure, no version history, no audit trail.",
              },
              {
                title: "The goal",
                body: "A system where data is entered once, reaches the right person, and stays traceable. Not more software; one place where the record is the record.",
              },
            ],
            meta: "Product: internal ERP · nine locations · six departments",
          },

          {
            kind: "text",
            label: "01 · Scope",
            heading: "Map the data before drawing a single screen.",
            body: [
              "Phase one was an audit of everything the business tracked, formally or not. The result was a data map across six operational domains, each with a named owner, an update frequency, and a picture of what depends on it downstream.",
              "That map is why the system holds together. Every screen that came later is a view onto something that already had a shape, an owner and a lifecycle.",
            ],
            stats: [
              {
                number: "9",
                caption:
                  "locations, each generating its own operational and transactional data.",
              },
              {
                number: "6",
                caption:
                  "departments mapped: operations, logistics, production, HR, finance and management.",
              },
              {
                number: "40+",
                caption:
                  "document types that needed structured capture, versioning and a traceable history.",
              },
            ],
          },

          {
            kind: "list",
            label: "02 · The data model",
            heading: "Six domains, each with an owner and a lifecycle.",
            body: [
              "These are the objects the business actually runs on. Everything in the interface is a view onto one of them.",
            ],
            items: [
              {
                title: "Inventory and stock",
                body: "Products, raw materials and consumables across all locations. Each item carries quantity, minimum threshold, expiry, supplier reference and movement history. Stock changes recalculate status automatically, so nothing needs flagging by hand.",
              },
              {
                title: "Client orders and requisitions",
                body: "Every incoming order gets a reference, ties to a client record, and moves through fulfilment stages. Confirmations, delivery notes and invoices attach to the order rather than being filed somewhere else.",
              },
              {
                title: "Production batches",
                body: "Each run logs date, quantities, operator and ingredient consumption, which links a finished product back to the raw materials that made it. That link is what a quality check or a supplier dispute actually needs.",
              },
              {
                title: "HR and employee documentation",
                body: "Contracts, ID documents and certifications sit on the employee. The system flags expiry before it becomes a problem and blocks scheduling for anyone with overdue documentation.",
              },
              {
                title: "Logistics and delivery",
                body: "Outbound deliveries link to the orders they fulfil and the stock they draw from, with a status trail, an assigned driver and a route record. A full chain from order received to delivery confirmed.",
              },
              {
                title: "Suppliers and procurement",
                body: "Purchase orders tie to suppliers, trigger stock replenishment, and are tracked through receipt and payment. Every transaction leaves a record in the audit log that does not disappear.",
              },
            ],
          },

          {
            kind: "text",
            label: "03 · Traceability",
            heading: "Every document linked. Every action logged.",
            tone: "band",
            body: [
              "Traceability was not negotiable. Duo operates where an external audit, a supplier dispute or an HR inspection can land at any time, and the cost of not having the documentation in order is high.",
              "Every object carries a timestamped history of every change: who made it, when, and from which access level. Documents attach at the record level, not in a generic folder. A delivery note lives on the delivery, a contract lives on the employee. No cross-referencing by hand.",
            ],
            image: {
              src: "/projects/erp-duo/hr.webp",
              alt: "ERP Duo, staff shifts view with HR compliance alerts",
              caption: "Staff shifts, with document expiry surfaced next to the schedule",
              w: 1654,
              h: 2308,
            },
          },

          {
            kind: "wires",
            label: "03b · What we tried",
            heading: "Four ways into a system this big.",
            body: [
              "Forty document types and six departments is a lot of surface. The question was never what to build, it was how someone finds the one thing they came for. These are the frames that got drawn before the sidebar won.",
            ],
            frames: [
              {
                slug: "modules",
                title: "Module cards",
                note: "Every area as a card on a landing page. Easy to learn on day one, but it puts a full stop between you and the work every single time you switch task.",
              },
              {
                slug: "search",
                title: "Search first",
                note: "Type the order number, skip the navigation. Excellent once you know the system and unusable while you are still learning what exists.",
              },
              {
                slug: "tabs",
                title: "Top tabs",
                note: "One wide surface under a row of tabs. Roomy for tables, but tabs do not carry counts well and the row runs out at about six.",
              },
              {
                slug: "sidebar",
                title: "Sidebar with counts",
                chosen: true,
                note: "Persistent navigation carrying badge counts for expiring documents, pending orders and critical stock. The sidebar tells you the state of the business before you open anything.",
              },
            ],
          },

          {
            kind: "questions",
            label: "04 · Role based access",
            heading: "Each department sees what it owns and can act on it.",
            body: [
              "The access model rests on one principle: nobody should meet data they do not have the context to understand. Role based views cut cognitive load, prevent edits outside someone's area, and make onboarding much faster.",
            ],
            items: [
              {
                question: "What does the operations manager see?",
                hint: "full dashboard, inventory, production, expiry alerts",
              },
              {
                question: "What does the HR coordinator see?",
                hint: "employee records, document expiry, scheduling, compliance flags",
              },
              {
                question: "What does the logistics team see?",
                hint: "active deliveries, route status, driver assignment, order fulfilment",
              },
              {
                question: "What does finance see?",
                hint: "purchase orders, supplier invoices, payment status, cost reports",
              },
              {
                question: "What does a store manager see?",
                hint: "own location stock, daily orders, staff on shift, expiring items",
              },
              {
                question: "What does the administrator see?",
                hint: "everything, plus audit logs, user management and configuration",
              },
            ],
          },

          {
            kind: "list",
            label: "05 · Design decisions",
            heading: "Dense data. Immediate legibility.",
            body: [
              "ERPs are dense by nature. The challenge was making that density navigable without hiding things behind disclosure that slows people down exactly when they need to act.",
            ],
            items: [
              {
                title: "Status as structure",
                body: "One three-state system, ok, warn and critical, runs across every module. Status is never decorative: it drives a left border, a row highlight and a filter. Critical items cannot get buried by pagination.",
              },
              {
                title: "Documents on the record",
                body: "Files attach to the record they belong to rather than a global folder, so the right document is always one click from the data that raised the question.",
              },
              {
                title: "Counts in the navigation",
                body: "Expiring documents, pending orders and critical stock show as badges in the sidebar. You know where the problems are before opening a page.",
              },
              {
                title: "Monospaced numerics",
                body: "Stock counts, currency, timestamps and document IDs are set in a monospace face. Not a style choice: it makes columns scannable and stops people misreading digit dense strings.",
              },
            ],
          },

          {
            kind: "flow",
            label: "06 · Order flow",
            heading: "From new document to production.",
            body: [
              "The most travelled path in the system: create a document, fill the customer and the items, let the stock check run, surface anything critical, and send it to production through role based review.",
            ],
            caption: "The stock check runs on entry, so a shortage is caught before anyone approves it.",
            spec: {
              phases: [
                "1 · New document",
                "2 · Fill it",
                "3 · Automatic checks",
                "4 · Review and send",
              ],
              nodes: [
                {
                  id: "new",
                  col: 1,
                  row: 2,
                  kind: "start",
                  title: "New document",
                  sub: "order, delivery or invoice",
                },
                {
                  id: "fill",
                  col: 2,
                  row: 2,
                  title: "Customer and items",
                  sub: "pulled from the client and product records",
                },
                {
                  id: "stock",
                  col: 3,
                  row: 2,
                  kind: "auto",
                  title: "Stock check",
                  sub: "runs on entry, against every location",
                },
                {
                  id: "critical",
                  col: 3,
                  row: 3,
                  kind: "alert",
                  title: "Critical item",
                  sub: "flagged in the row and in the sidebar count",
                },
                {
                  id: "review",
                  col: 4,
                  row: 2,
                  kind: "decision",
                  title: "Approved by the owning role",
                },
                {
                  id: "prod",
                  col: 4,
                  row: 3,
                  kind: "end",
                  title: "Sent to production",
                  sub: "with a timestamped trail behind it",
                },
              ],
              edges: [
                { from: "new", to: "fill" },
                { from: "fill", to: "stock" },
                { from: "stock", to: "critical", label: "short" },
                { from: "stock", to: "review" },
                { from: "review", to: "prod", label: "yes" },
                { from: "critical", to: "fill", label: "resolve", dashed: true },
              ],
            },
          },

          {
            kind: "gallery",
            label: "07 · Interface",
            heading: "The system in use.",
            columns: 2,
            body: [
              "Two screens from the live deployment: logistics tracking active routes across Berlin, and the shifts view showing compliance alerts next to the daily schedule.",
            ],
            images: [
              {
                src: "/projects/erp-duo/gps.webp",
                alt: "ERP Duo, logistics GPS module tracking seven active routes across Berlin",
                caption: "Logistics, live routes, Berlin",
                w: 2400,
                h: 1152,
              },
            ],
          },

          {
            kind: "text",
            label: "08 · Reflections",
            heading: "The data model was the design.",
            lead: true,
            body: [
              "Almost none of the value here came from the screens. It came from the weeks spent working out what an order is, who owns an employee record, and what has to be true before a batch can close. Once those answers existed, most of the interface designed itself.",
              "The part I would defend hardest is the audit trail. It is invisible on a good day and it is the entire product on a bad one, which is a useful description of most infrastructure.",
            ],
          },
        ]}
      />
    </>
  );
}
