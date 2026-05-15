import type { Metadata } from "next";
import { CaseStudy } from "@/components/CaseStudy";

export const metadata: Metadata = {
  title: "ERP Duo — Julian Giraldo",
  description:
    "Custom ERP system for Duo — nine locations, multiple departments, role-based access, and full document traceability across operations, HR, logistics, and client orders.",
};

export default function ErpDuoPage() {
  return (
    <CaseStudy
      currentSlug="erp-duo"
      meta={{
        index: "02",
        title: "ERP Duo",
        subtitle: "Structuring nine locations worth of operational data into one auditable system.",
        year: "2026",
        role: "Product Design · UX · Interaction Design",
        tags: ["ERP", "Data Architecture", "Role-Based Access", "Operations"],
        status: "Live · 2026",
      }}
      cover={{
        src: "/projects/erp-duo/cover.png",
        alt: "Duo ERP Dashboard on iMac",
      }}
      sections={[
        {
          kind: "text",
          label: "01 · Challenge",
          heading: "Nine locations. No single source of truth.",
          body: [
            "Duo operates across nine locations with distinct operational rhythms — production, retail, logistics, and administration running in parallel, often without visibility into each other. The fundamental problem was not software: it was that critical operational data lived in spreadsheets, messaging apps, and individual inboxes with no structure, no version control, and no audit trail.",
            "The project required identifying every data type that mattered to the business, defining ownership and update cadence for each, and designing a system where that data could be entered once, routed correctly, and acted upon by the right person at the right time.",
          ],
          stats: [
            {
              icon: "dot",
              number: "9",
              caption: "locations generating independent streams of operational and transactional data.",
            },
            {
              icon: "bolt",
              number: "6",
              caption: "departments mapped — operations, logistics, production, HR, finance, and management.",
            },
            {
              icon: "triangle",
              number: "40+",
              caption: "distinct document types requiring structured capture, versioning, and traceability.",
            },
          ],
        },

        {
          kind: "list",
          label: "02 · Data scope",
          heading: "Before designing screens, mapping every data type that had to exist.",
          body: [
            "The first phase was a complete audit of what the business actually tracked — formally or informally. The output was a data map covering six operational domains, each with defined ownership, update frequency, and downstream dependencies.",
          ],
          items: [
            {
              title: "Inventory & stock",
              body: "Products, raw materials, and consumables across all locations. Each item carries current quantity, minimum threshold, expiry date, supplier reference, and movement history. Stock changes trigger automatic status recalculations — no manual flag required.",
            },
            {
              title: "Client orders & requisitions",
              body: "Every incoming order is assigned a unique reference, linked to a client record, and tracked through fulfilment stages. Order documents — confirmations, delivery notes, invoices — are attached directly to the order record, not filed separately.",
            },
            {
              title: "Production batches",
              body: "Each production run is logged with date, quantities, assigned operator, and ingredient consumption. This creates a direct traceability link from a finished product back to the raw materials used — critical for quality control and supplier disputes.",
            },
            {
              title: "HR & employee documentation",
              body: "Employee records include contracts, ID documents, certifications, and any time-sensitive compliance documents. The system flags approaching expiry dates and blocks scheduling for employees with overdue documentation.",
            },
            {
              title: "Logistics & delivery",
              body: "Outbound deliveries are linked to the orders they fulfil and the stock they draw from. Each delivery has a status trail, an assigned driver, and a route record — creating a complete chain from order receipt to confirmed delivery.",
            },
            {
              title: "Supplier & procurement",
              body: "Purchase orders are linked to suppliers, tied to stock replenishment triggers, and tracked through receipt and payment. Every transaction generates a document record that persists in the audit log indefinitely.",
            },
          ],
        },

        {
          kind: "text",
          label: "03 · Traceability",
          heading: "Every document linked. Every action logged.",
          body: [
            "Traceability was the non-negotiable requirement from the outset. The business operates in a context where an external audit, a supplier dispute, or an HR inspection can happen at any point — and the cost of not having documentation in order is high.",
            "The system is designed so that every object — an order, a delivery, a stock movement, an employee record — carries a complete, timestamped history of every change made to it, by whom, and from which access level. Documents are attached at the record level, not the folder level. A delivery note lives on the delivery. A contract lives on the employee. Nothing is stored in a generic file system that requires manual cross-referencing.",
          ],
          image: {
            src: "/projects/erp-duo/hr.png",
            alt: "ERP Duo — Staff Shifts with HR compliance alerts",
            position: "right",
            bg: "bg-[#f5f5f3]",
          },
        },

        {
          kind: "questions",
          label: "04 · Role-based access",
          heading: "Each department sees what it owns and can act on it.",
          body: [
            "The access model was designed around a core principle: no user should encounter data that requires context they don't have. Role-based views reduce cognitive load, prevent accidental edits to records outside a user's responsibility, and make onboarding significantly faster.",
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
            "An ERP handles high information density by definition. The design challenge was to make that density navigable rather than overwhelming — without resorting to progressive disclosure that hides data people need to act fast.",
          ],
          items: [
            {
              title: "Status as structure",
              body: "A three-state semantic system (ok / warn / crit) is applied consistently across every module. Status is never decorative — it triggers a left-border colour, a row highlight, and a filter option. Critical items are always surfaced; they cannot be buried by pagination.",
            },
            {
              title: "Document attachment at the record level",
              body: "Files are uploaded and stored on the specific record they belong to, not in a global documents folder. This makes retrieval instant and context-dependent — the right document is always one click from the relevant data.",
            },
            {
              title: "Sidebar navigation with badge counts",
              body: "Active alert counts appear as badges on the relevant nav items — expiring documents, pending orders, critical stock. The sidebar communicates system state before a single page loads.",
            },
            {
              title: "Monospaced numerics",
              body: "All quantitative data — stock counts, currency, timestamps, document IDs — renders in a monospace typeface. This is not a stylistic choice: it makes columns scannable and prevents misreading digit-dense strings.",
            },
          ],
        },

        {
          kind: "gallery",
          label: "06 · Interface",
          heading: "The system in use.",
          body: [
            "Key screens from the live deployment — the Logistics GPS module tracking all active routes across Berlin, and the Staff Shifts view surfacing HR compliance alerts alongside daily scheduling for all locations.",
          ],
          images: [
            {
              src: "/projects/erp-duo/gps.png",
              alt: "ERP Duo — Logistics GPS module · 7 routes · Berlin",
              caption: "Logistics GPS · live routes · Berlin",
            },
          ],
        },

        {
          kind: "demo",
          label: "07 · Live demo",
          heading: "The interface in use.",
          body: [
            "The demo below shows the dashboard, inventory, and flavours modules. Navigate via the left sidebar. All data displayed in this preview is entirely fictional and serves only to demonstrate the interface in a realistic operational context. It does not represent or reveal any real data from the company.",
          ],
          url: "/projects/erp-duo/demo.html",
        },
      ]}
    />
  );
}
