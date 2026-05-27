"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BerlinClock } from "./Clock";

const links = [
  { hash: "#top", label: "Home" },
  { hash: "#work", label: "Works" },
  { hash: "#about", label: "About" },
  { hash: "#contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const go = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setOpen(false);
    const scroll = () => {
      const lenis = window.__lenis;
      if (hash === "#top") {
        lenis?.scrollTo(0);
      } else {
        const el = document.querySelector(hash);
        if (el) lenis?.scrollTo(el as HTMLElement, { offset: -20 });
      }
      history.replaceState(null, "", hash === "#top" ? "/" : hash);
    };
    if (onHome) {
      // Small delay so menu close animation runs before scrolling
      setTimeout(scroll, 250);
    } else {
      router.push(`/${hash === "#top" ? "" : hash}`);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 px-6 md:px-10 py-6 mix-blend-difference"
      >
        <nav className="mx-auto max-w-[1600px] flex items-center justify-between md:grid md:grid-cols-3 text-white">
          <Link
            href="/"
            onClick={(e) => go(e, "#top")}
            className="font-mono text-[12px] tracking-[0.18em] uppercase justify-self-start"
            data-cursor-hover
          >
            Julian
            <span className="align-super text-[0.7em] ml-0.5">©</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center justify-center gap-8 font-mono text-[12px] md:text-sm uppercase tracking-[0.18em]">
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

          {/* Desktop clock */}
          <div className="hidden md:block justify-self-end">
            <BerlinClock />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative h-6 w-8 flex flex-col justify-center items-end gap-[5px]"
            data-cursor-hover
          >
            <motion.span
              animate={open ? { rotate: 45, y: 7, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block h-px bg-white origin-center"
            />
            <motion.span
              animate={open ? { opacity: 0, x: 10 } : { opacity: 1, x: 0, width: "70%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="block h-px bg-white"
              style={{ width: "70%" }}
            />
            <motion.span
              animate={open ? { rotate: -45, y: -7, width: "100%" } : { rotate: 0, y: 0, width: "85%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block h-px bg-white origin-center"
              style={{ width: "85%" }}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-black text-white"
          >
            <motion.ul
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
                closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
              }}
              className="h-full w-full flex flex-col items-center justify-center gap-8 font-display"
            >
              {links.map((l) => (
                <motion.li
                  key={l.hash}
                  variants={{
                    open: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                    closed: { y: 30, opacity: 0, transition: { duration: 0.3 } },
                  }}
                >
                  <a
                    href={onHome ? l.hash : `/${l.hash === "#top" ? "" : l.hash}`}
                    onClick={(e) => go(e, l.hash)}
                    className="text-4xl tracking-tight uppercase"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  open: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                  closed: { y: 20, opacity: 0, transition: { duration: 0.3 } },
                }}
                className="mt-10 font-mono text-[12px] tracking-[0.18em] uppercase opacity-70"
              >
                <BerlinClock />
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
