"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BerlinClock } from "./Clock";

const links = [
  { hash: "#top", label: "Home" },
  { hash: "#work", label: "Works" },
  { hash: "#archives", label: "Archives" },
  { hash: "#contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  const go = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    if (onHome) {
      const lenis = window.__lenis;
      if (hash === "#top") {
        lenis?.scrollTo(0);
      } else {
        const el = document.querySelector(hash);
        if (el) lenis?.scrollTo(el as HTMLElement, { offset: -20 });
      }
      history.replaceState(null, "", hash === "#top" ? "/" : hash);
    } else {
      router.push(`/${hash === "#top" ? "" : hash}`);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 px-6 md:px-10 py-6 mix-blend-difference"
    >
      <nav className="mx-auto max-w-[1600px] grid grid-cols-3 items-center text-white">
        <Link
          href="/"
          onClick={(e) => go(e, "#top")}
          className="font-mono text-[11px] tracking-[0.18em] uppercase justify-self-start"
          data-cursor-hover
        >
          Julian
          <span className="align-super text-[0.7em] ml-0.5">©</span>
        </Link>

        <ul className="flex items-center justify-center gap-8 font-mono text-[11px] md:text-xs uppercase tracking-[0.18em]">
          {links.map((l) => (
            <li key={l.hash}>
              <a
                href={onHome ? l.hash : `/${l.hash === "#top" ? "" : l.hash}`}
                onClick={(e) => go(e, l.hash)}
                className="relative group"
                data-cursor-hover
              >
                <span>{l.label}</span>
                <span className="absolute left-0 right-0 -bottom-1 h-px bg-white origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out" />
              </a>
            </li>
          ))}
        </ul>

        <div className="justify-self-end">
          <BerlinClock />
        </div>
      </nav>
    </motion.header>
  );
}
