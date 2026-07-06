import type { Metadata } from "next";
import { CaseStudy } from "@/components/CaseStudy";

export const metadata: Metadata = {
  title: "ERP Duo | Julian Giraldo",
  description:
    "Custom ERP system for Duo: nine locations, multiple departments, role-based access, and full document traceability across operations, HR, logistics, and client orders.",
};

export default function ErpDuoPage() {
  return (
    <CaseStudy
      currentSlug="erp-duo"
      meta={{
        index: "02",
        title: "ERP Duo",
        subtitle: "Nine locations of operational data, brought into one system you can actually audit.",
        year: "2026",
        role: "Product Design · UX · Interaction Design",
        tags: ["ERP", "Data Architecture", "Role-Based Access", "Operations"],
        status: "Live · 2026",
      }}
      cover={{
        src: "/projects/erp-duo/cover.webp",
        alt: "Duo ERP Dashboard on iMac",
      }}
      sections={[
        {
          kind: "text",
          label: "01 · Challenge",
          heading: "Nine locations. No single source of truth.",
          body: [
            "Duo runs across nine locations: production, retail, logistics, and administration all moving at the same time, mostly without visibility into each other. The real problem wasn't software. It was that critical data lived in spreadsheets, WhatsApp threads, and personal inboxes. No structure, no version history, no audit trail.",
            "The work started with mapping every data type that actually mattered to the business: who owns it, how often it changes, and where it needs to go. From there, the goal was a system where data gets entered once, reaches the right person, and stays traceable.",
          ],
          stats: [
            {
              icon: "dot",
              number: "9",
              caption: "locations each generating their own operational and transactional data.",
            },
            {
              icon: "bolt",
              number: "6",
              caption: "departments mapped: operations, logistics, production, HR, finance, and management.",
            },
            {
              icon: "triangle",
              number: "40+",
              caption: "document types that needed structured capture, versioning, and a traceable history.",
            },
          ],
        },

        {
          kind: "list",
          label: "02 · Data scope",
          heading: "Before designing screens, mapping every data type that had to exist.",
          body: [
            "Phase one was a full audit of what the business actually tracked, formally or not. The result was a data map across six operational domains, each with a clear owner, an update frequency, and a picture of what depends on it downstream.",
          ],
          items: [
            {
              title: "Inventory & stock",
              body: "Products, raw materials, and consumables across all locations. Each item carries current quantity, minimum threshold, expiry date, supplier reference, and movement history. Stock changes recalculate status automatically, so nothing needs manual flagging.",
            },
            {
              title: "Client orders & requisitions",
              body: "Every incoming order gets a unique reference, ties to a client record, and moves through fulfilment stages. Confirmations, delivery notes, and invoices attach directly to the order, not filed somewhere separately.",
            },
            {
              title: "Production batches",
              body: "Each production run logs date, quantities, operator, and ingredient consumption. That creates a direct link from a finished product back to the raw materials used, which matters a lot during quality checks or supplier disputes.",
            },
            {
              title: "HR & employee documentation",
              body: "Employee records hold contracts, ID documents, certifications, and anything time-sensitive. The system flags expiry dates before they become a problem and blocks scheduling for anyone with overdue documentation.",
            },
            {
              title: "Logistics & delivery",
              body: "Outbound deliveries link to the orders they fulfil and the stock they draw from. Each one has a status trail, an assigned driver, and a route record. A full chain from order receipt to confirmed delivery.",
            },
            {
              title: "Supplier & procurement",
              body: "Purchase orders tie to suppliers, connect to stock replenishment triggers, and get tracked through receipt and payment. Every transaction leaves a document record in the audit log that doesn't disappear.",
            },
          ],
        },

        {
          kind: "text",
          label: "03 · Traceability",
          heading: "Every document linked. Every action logged.",
          body: [
            "Traceability wasn't negotiable. Duo operates in a context where an external audit, a supplier dispute, or an HR inspection can land at any time, and the cost of not having your documentation in order is high.",
            "Every object in the system (an order, a delivery, a stock movement, an employee record) carries a full, timestamped history of every change: who made it, when, and from which access level. Documents attach at the record level, not in a generic folder. A delivery note lives on the delivery. A contract lives on the employee. No manual cross-referencing required.",
          ],
          image: {
            src: "/projects/erp-duo/hr.webp",
            alt: "ERP Duo · Staff Shifts with HR compliance alerts",
            position: "right",
            bg: "bg-[#f5f5f3]",
          },
        },

        {
          kind: "questions",
          label: "04 · Role-based access",
          heading: "Each department sees what it owns and can act on it.",
          body: [
            "The access model is built around one principle: nobody should encounter data they don't have the context to understand. Role-based views cut cognitive load, prevent accidental edits outside someone's area, and make onboarding a lot faster.",
          ],
          items: [
            {
              question: "What does the operations manager see?",
              hint: "Full dashboard · inventory · production · expiry alerts",
            },
            {
              question: "What does the HR coordinator see?",
              hint: "Employee records · document expiry · scheduling · compliance flags",
            },
            {
              question: "What does the logistics team see?",
              hint: "Active deliveries · route status · driver assignment · order fulfilment",
            },
            {
              question: "What does finance see?",
              hint: "Purchase orders · supplier invoices · payment status · cost reports",
            },
            {
              question: "What does a store manager see?",
              hint: "Own location stock · daily orders · staff on shift · expiring items",
            },
            {
              question: "What does the administrator see?",
              hint: "Everything · audit logs · user management · system configuration",
            },
          ],
        },

        {
          kind: "list",
          label: "05 · Design decisions",
          heading: "Dense data. Immediate legibility.",
          body: [
            "ERPs are dense by nature. The design challenge was making that density navigable without hiding data behind progressive disclosure that slows people down when they need to act fast.",
          ],
          items: [
            {
              title: "Status as structure",
              body: "A three-state system (ok / warn / crit) runs consistently across every module. Status is never decorative: it triggers a left-border colour, a row highlight, and a filter option. Critical items are always surfaced and can't get buried by pagination.",
            },
            {
              title: "Document attachment at the record level",
              body: "Files attach to the specific record they belong to, not a global documents folder. The right document is always one click away from the relevant data.",
            },
            {
              title: "Sidebar navigation with badge counts",
              body: "Alert counts show as badges on the relevant nav items: expiring documents, pending orders, critical stock. The sidebar tells you the system's state before you've opened a single page.",
            },
            {
              title: "Monospaced numerics",
              body: "All quantitative data (stock counts, currency, timestamps, document IDs) uses a monospace typeface. Not a stylistic choice: it makes columns scannable and stops people from misreading digit-dense strings.",
            },
          ],
        },

        {
          kind: "gallery",
          label: "06 · Interface",
          heading: "The system in use.",
          body: [
            "A couple of screens from the live deployment: the Logistics GPS module tracking active routes across Berlin, and the Staff Shifts view showing HR compliance alerts alongside daily scheduling for all locations.",
          ],
          images: [
            {
              src: "/projects/erp-duo/gps.webp",
              alt: "ERP Duo · Logistics GPS module · 7 routes · Berlin",
              caption: "Logistics GPS · live routes · Berlin",
            },
          ],
        },

        {
          kind: "demo",
          label: "07 · Live demo",
          heading: "The interface in use.",
          body: [
            "The demo below shows the dashboard, inventory, and flavours modules. Use the left sidebar to navigate. All data in this preview is fictional and exists only to show the interface in a realistic context. None of it reflects real company data.",
          ],
          url: "/projects/erp-duo/demo.html",
        },
        {
          kind: "flow",
          variant: "erp",
          label: "08 · Order flow",
          heading: "From new document to production.",
          body: [
            "End-to-end flow for the most-used path in the ERP: creating a new document (order, delivery, invoice), filling customer and item data, running auto stock checks, surfacing critical items via the three-state status system, and sending to production through role-based review.",
          ],
        },
      ]}
    />
  );
}
