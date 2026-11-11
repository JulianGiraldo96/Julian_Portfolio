"use client";

import Link from "next/link";
import { ProjectFolder } from "./ProjectFolder";
import { academic, professional } from "./projects";

/* The product work as rows of expanding cards. The home page shows the
   shipped row on its own; the Product design page shows both, shipped first,
   university second, in the same frame with the same live demos, and the
   label above each row is what tells them apart. */

export function RowHead({
  label,
  aside,
  filled = true,
}: {
  label: string;
  aside?: React.ReactNode;
  /* the hero ledger's dot: filled for what runs, hollow for what was studied */
  filled?: boolean;
}) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-label)]">
      <span className="flex items-center gap-2.5">
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${
            filled ? "bg-[var(--v2-accent)]" : "border border-current opacity-70"
          }`}
        />
        <span className="text-[var(--v2-ink)]">{label}</span>
      </span>
      {aside && <span>{aside}</span>}
    </div>
  );
}

/* the "all of it" link at the end of a row head, on the page it points to */
export function MoreLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="-my-2 inline-flex items-center gap-1.5 whitespace-nowrap py-2 text-[var(--v2-label)] transition-colors duration-200 hover:text-[var(--v2-ink)]"
    >
      {children}
      <span aria-hidden>↗︎</span>
    </Link>
  );
}

export function ProjectRow({
  label,
  aside,
  list,
  offset,
}: {
  label: string;
  aside?: React.ReactNode;
  list: typeof professional;
  offset: number;
}) {
  return (
    <div>
      <RowHead label={label} aside={aside} filled={offset === 0} />
      <ul className="flex list-none flex-col gap-6 md:flex-row md:items-stretch md:gap-4">
        {list.map((p, i) => (
          <ProjectFolder
            key={p.slug}
            project={p}
            index={offset + i}
            wide={false}
            row
            tall={list.length === 2}
          />
        ))}
      </ul>
    </div>
  );
}

export function ProductWork() {
  return (
    <div className="flex flex-col gap-14 md:gap-20">
      <ProjectRow
        label="Shipped"
        aside="In production"
        list={professional}
        offset={0}
      />
      <ProjectRow
        label="Academic"
        aside="University"
        list={academic}
        offset={professional.length}
      />
    </div>
  );
}
