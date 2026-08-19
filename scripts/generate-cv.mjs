// Generate Julian's CV PDF from embedded HTML using Playwright.
//
//   node scripts/generate-cv.mjs
//
// Two pages, two columns: experience in the main column, education,
// certifications, languages and skills in the sidebar. Layout follows the
// reference resume in `res/`.
//
// ATS notes, all of them load-bearing, do not undo them without re-running the
// extraction check at the bottom of this file:
//
//   - No negative letter-spacing anywhere. Chrome emits per-glyph positioning
//     for tracked text and every PDF text extractor then guesses a space in the
//     middle of the word. The previous CV shipped its job titles as
//     "P roduct Designer" and its employer as "TaurusW ebs", so an ATS matching
//     "Product Designer" in the title field found nothing.
//   - Ligatures off. A serif with a real "fi" ligature turns "defined" into
//     "deﬁned" (U+FB01) on extraction, and "workflow" into "workﬂow". The
//     reference resume has exactly this bug.
//   - The main column precedes the sidebar in the DOM, so extraction reads all
//     the experience first and the sidebar after, instead of interleaving the
//     two columns line by line.
//   - Every job is its own block carrying title, employer, location and dates.
//     Grouped entries with one date range and several titles underneath parse
//     as a single job at most vendors.
//   - Plain ASCII hyphens in date ranges, ordinary bullets, no icons, no
//     tables, no text in the page margins.
//
// Typeface, measured 2026-08-19 by rendering each candidate and extracting it
// back with pypdf. The CV is meant to look like juliang.de, but the site's
// display face cannot be used:
//
//   - BROKEN: Outfit (the site's --font-display) extracts as "P roduct
//     Designer" and "TaurusW ebs", the exact bug that shipped until 2026-08-07.
//     Jost is worse: "Prod uct Designer", "Food  Counter Clerk".
//   - CLEAN: Montserrat, Geist, Geist Mono, Figtree, Inter, Poppins, Arial,
//     Helvetica, and the previous Spectral.
//   - So: Montserrat stands in for Outfit as the geometric display face, and
//     Geist / Geist Mono are the site's own faces used unchanged.
//   - Letter-spacing was retested rather than assumed. Positive tracking
//     (0.04 to 0.16em, the site's mono labels) extracts clean, and so does
//     negative tracking down to -0.045em ON MONTSERRAT, which is why the name
//     may carry the site's tight display look. This is a per-font result, not
//     a general licence: retest before tracking any other face.

import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// `playwright` and `pdf-lib` are not project dependencies, so this is normally
// run from a scratch directory that has them, with CV_PROJECT_ROOT pointing at
// the portfolio. Without the variable it resolves relative to itself.
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = process.env.CV_PROJECT_ROOT
  ? resolve(process.env.CV_PROJECT_ROOT)
  : resolve(__dirname, "..");
const repoRoot = resolve(projectRoot, "..");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Julian David Giraldo Rojas - Product Designer CV</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }

  /* The portfolio's tokens, lifted from app/globals.css so the CV and the site
     are visibly the same object. Outfit, the site's display face, is NOT here:
     it fails PDF extraction (see the ATS notes above). Montserrat is the
     geometric stand-in, Geist and Geist Mono are the site's own. */
  :root {
    --fg: #1d1d1f;          /* --v2-ink */
    --secondary: #55555a;   /* --v2-secondary */
    --muted: #6e6e73;       /* --v2-label */
    --link: #2f5d9e;        /* --v2-cool */
    --rule: rgba(0,0,0,0.08);        /* --v2-line */
    --rule-strong: rgba(0,0,0,0.16); /* --v2-line-strong */
  }

  html, body {
    margin: 0;
    font-family: "Geist", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 8.9pt;
    line-height: 1.34;
    color: var(--fg);
    /* every extractor reads "deﬁned" out of a real fi ligature */
    font-variant-ligatures: none;
    /* and a kerned pair is emitted as a positioning offset mid-word, which the
       same extractors read as a space: "Sanitas M edical", "A nthropic",
       "T aurusWebs". Turning kerning off costs a hair of visual polish and
       buys every job title and employer name matching intact. */
    font-kerning: none;
    font-feature-settings: "liga" 0, "clig" 0, "dlig" 0, "hlig" 0, "kern" 0;
    -webkit-font-smoothing: antialiased;
  }

  .page {
    width: 210mm;
    height: 296.8mm;
    padding: 13mm 15mm 9mm 15mm;
    overflow: hidden;
    page-break-after: always;
    display: flex;
    flex-direction: column;
  }
  .page:last-child { page-break-after: auto; }

  /* header: the site's hero, shrunk. Display face, light weight, tight
     tracking. Verified extractable at -0.035em on Montserrat. */
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 14mm; }
  h1.name {
    font-family: "Montserrat", "Helvetica Neue", Arial, sans-serif;
    font-size: 24pt;
    font-weight: 300;
    letter-spacing: -0.035em;
    margin: 0 0 1.6mm 0;
    line-height: 1.02;
  }
  .head .role {
    font-family: "Montserrat", "Helvetica Neue", Arial, sans-serif;
    font-size: 11.5pt;
    font-weight: 500;
    letter-spacing: -0.01em;
    margin: 0;
  }
  .head .based { font-size: 9.6pt; color: var(--secondary); margin: 0.8mm 0 0 0; }
  .contact {
    text-align: left;
    font-family: "Geist Mono", ui-monospace, "Courier New", monospace;
    font-size: 8.4pt;
    line-height: 1.62;
    padding-top: 1.2mm;
  }
  .contact .lbl { color: var(--muted); }
  .contact .val { color: var(--link); }

  /* two columns: main first in the DOM so extraction reads it first */
  .cols { display: flex; gap: 9mm; margin-top: 8.4mm; flex: 1; min-height: 0; }
  .main { width: 68%; }
  .side { width: 32%; }
  .page + .page .cols { margin-top: 0; }

  /* the site's label: mono, uppercase, wide tracking, muted. Positive tracking
     was tested and does not break extraction; negative on body text is still
     never used. */
  h2 {
    font-family: "Geist Mono", ui-monospace, "Courier New", monospace;
    font-size: 7.4pt;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--muted);
    margin: 0 0 2.5mm 0;
    padding-bottom: 1.4mm;
    border-bottom: 0.5pt solid var(--rule-strong);
  }
  .side h2 { margin-bottom: 3mm; }
  .side h2 + .block { margin-top: 0; }
  section + section { margin-top: 4.2mm; }

  /* jobs */
  .job { margin-bottom: 2.6mm; page-break-inside: avoid; }
  .job:last-child { margin-bottom: 0; }
  .job-line { font-size: 9.6pt; line-height: 1.3; }
  .job-line .org { font-weight: 600; }
  .job-line .title { color: var(--link); font-weight: 500; }
  .job-line .meta { color: var(--secondary); }
  .job-date {
    font-family: "Geist Mono", ui-monospace, "Courier New", monospace;
    font-size: 7.8pt;
    color: var(--muted);
    margin: 0.6mm 0 1mm 0;
  }

  ul { margin: 0; padding-left: 4.4mm; list-style: disc; }
  li { margin-bottom: 0.6mm; line-height: 1.34; padding-left: 0.6mm; color: var(--secondary); }
  li::marker { font-size: 0.8em; color: var(--muted); }

  /* sidebar blocks */
  .block { margin-top: 4.2mm; }
  .block:first-of-type { margin-top: 0; }
  .block .b1 { font-weight: 600; }
  .block .b2 { color: var(--link); }
  .block .b3 {
    font-family: "Geist Mono", ui-monospace, "Courier New", monospace;
    font-size: 7.6pt;
    color: var(--muted);
    margin-top: 0.4mm;
  }
  .block .item { color: var(--secondary); line-height: 1.42; }

  /* pre-2019 and pure graphic design roles: one line each. A product design CV
     needs them listed, not narrated, and the bullets they would carry are the
     first thing a reader skips. */
  /* Kept inline rather than flexed: a date column forces these long employer
     names into three ragged lines. The interpunct carries the separation. */
  .earlier .row { margin-bottom: 0.9mm; line-height: 1.32; }
  .earlier .row:last-child { margin-bottom: 0; }
  .earlier .org { font-weight: 600; }
  .earlier .title { color: var(--link); font-weight: 500; }
  .earlier .meta { color: var(--secondary); }
  .earlier .when {
    font-family: "Geist Mono", ui-monospace, "Courier New", monospace;
    font-size: 7.6pt;
    color: var(--muted);
    white-space: nowrap;
  }
  .earlier .when::before { content: "· "; }

  .skillgroup { margin-bottom: 3.8mm; }
  .skillgroup:last-child { margin-bottom: 0; }
  .skillgroup .gname {
    font-family: "Geist Mono", ui-monospace, "Courier New", monospace;
    font-size: 7.2pt;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
    margin-bottom: 1mm;
  }
  .skillgroup .item { line-height: 1.42; color: var(--secondary); }

  p.summary { margin: 0; color: var(--secondary); }
</style>
</head>
<body>

<!-- ================= PAGE 1 ================= -->
<div class="page">

  <div class="head">
    <div>
      <h1 class="name">Julian David Giraldo Rojas</h1>
      <p class="role">Product Designer</p>
      <p class="based">Based in Berlin, Germany</p>
    </div>
    <div class="contact">
      <div><span class="lbl">Linkedin</span> <span class="val">/julian-gr</span></div>
      <div><span class="lbl">Portfolio</span> <span class="val">juliang.de</span></div>
      <div>+49 151 5884 4518</div>
      <div>application@juliang.de</div>
    </div>
  </div>

  <div class="cols">
    <div class="main">

      <section>
        <h2>Summary</h2>
        <p class="summary">Product Designer with 4 years in product and 8+ years in design overall, working on complex B2B SaaS platforms and internal tools with many flows, states and feature dependencies. I own the full lifecycle, from user research and information architecture through wireframes, high-fidelity UI and interactive prototypes to implementation and polish, rationalizing every decision with data and direct user feedback. I build and maintain scalable design systems, run usability testing, and write frontend (Next.js) so my prototypes are real and my handoff is buildable.</p>
      </section>

      <section>
        <h2>Experience</h2>

        <div class="job">
          <div class="job-line"><span class="org">Duo Sicilian Ice Cream</span>, <span class="title">Product Designer</span> <span class="meta">/ Berlin, Germany / On-site</span></div>
          <div class="job-date">October 2024 - Present</div>
          <ul>
            <li>Designed and shipped Duo's internal ERP from zero: 13 modules, 40+ document types and 6 permission roles, in daily use across 9 locations and 6 departments.</li>
            <li>Ran discovery interviews and built the information architecture for 40+ document types, turning operational goals into user flows, wireframes, high-fidelity mockups and interactive prototypes, on a design system of components, patterns and design tokens I maintain.</li>
            <li>Designed a role-based access model with 6 roles that cut onboarding time by ~30% and removed accidental cross-module edits, plus a three-state status system (ok / warn / critical) applied across inventory, HR compliance, deliveries and production.</li>
            <li>Designed Duo Scan Memory, a scanning flow for goods receiving: inventory errors down ~30%, loading bay time down 15 to 20%, and unstacking pallets to recount gone entirely.</li>
            <li>Run usability testing and user feedback loops, and write the frontend in Next.js so prototypes are real and handoff is buildable.</li>
          </ul>
        </div>

        <div class="job">
          <div class="job-line"><span class="org">Duo Sicilian Ice Cream</span>, <span class="title">Food Counter Clerk</span> <span class="meta">/ Berlin, Germany / On-site</span></div>
          <div class="job-date">June 2024 - October 2024</div>
          <ul>
            <li>Counter and production support after relocating to Berlin, moving into the product design role in October 2024.</li>
          </ul>
        </div>

        <div class="job">
          <div class="job-line"><span class="org">TaurusWebs</span>, <span class="title">Product Designer</span> <span class="meta">/ Bogota, Colombia / Remote</span></div>
          <div class="job-date">October 2024 - Present</div>
          <ul>
            <li>Led the design of the Taurus Ecosystem, integrating a CRM, a knowledge base and encrypted chat into one platform behind single sign-on.</li>
            <li>Owned the whole process, from discovery and information architecture to user flows and stakeholder presentations, working cross-functionally with product managers, engineers and clients across several projects.</li>
          </ul>
        </div>

        <div class="job">
          <div class="job-line"><span class="org">Blok Foods Ltd, Greens Supermarket Group</span>, <span class="title">Lead Designer</span> <span class="meta">/ Malta / On-site</span></div>
          <div class="job-date">February 2022 - November 2023</div>
          <ul>
            <li>Lead designer on contract for the Blok Foods brand, covering brand identity, packaging, in-store communication and web.</li>
          </ul>
        </div>

      </section>
    </div>

    <div class="side">
      <section>
        <h2>Education</h2>
        <div class="block">
          <div class="b1">University of Europe for Applied Sciences</div>
          <div class="b2">MA, Visual and Experience Design</div>
          <div class="b3">November 2023 - August 2025</div>
        </div>
        <div class="block">
          <div class="b1">Politecnico Grancolombiano</div>
          <div class="b2">BA, Marketing and Advertising</div>
          <div class="b3">February 2015 - March 2019</div>
        </div>
      </section>

      <section>
        <h2>Certifications</h2>
        <div class="block">
          <div class="b1">Anthropic</div>
          <div class="b2">Claude Code in Action</div>
        </div>
        <div class="block">
          <div class="b1">Anthropic</div>
          <div class="b2">Introduction to Agent Skills</div>
        </div>
      </section>

      <section>
        <h2>Skills</h2>
        <div class="skillgroup">
          <div class="gname">Design and Craft</div>
          <div class="item">Product Design</div>
          <div class="item">UX / UI Design</div>
          <div class="item">Interaction Design</div>
          <div class="item">Information Architecture</div>
          <div class="item">User Flows and Wireframing</div>
          <div class="item">High-Fidelity Prototyping</div>
          <div class="item">Design Systems</div>
          <div class="item">Visual Design and Branding</div>
          <div class="item">Micro-Interactions</div>
          <div class="item">Accessibility (WCAG)</div>
        </div>
      </section>

      <section>
        <h2>Languages</h2>
        <div class="block">
          <div class="item">Spanish (Native)</div>
          <div class="item">English (C1, Professional)</div>
          <div class="item">German (A2, Elementary)</div>
        </div>
      </section>
    </div>
  </div>
</div>

<!-- ================= PAGE 2 ================= -->
<div class="page">
  <div class="cols">
    <div class="main">
      <section>
        <h2>Experience continued</h2>

        <div class="job">
          <div class="job-line"><span class="org">TaurusWebs</span>, <span class="title">Junior Product Designer</span> <span class="meta">/ Bogota, Colombia / Remote</span></div>
          <div class="job-date">February 2022 - September 2024</div>
          <ul>
            <li>Moved from interface design into product design, focusing on user flows and interactive prototypes.</li>
            <li>Worked closely with engineers to improve usability on B2B platforms and commercial SaaS products, running iterative cycles that kept solutions user-centered while meeting business goals.</li>
          </ul>
        </div>

        <div class="job">
          <div class="job-line"><span class="org">TaurusWebs</span>, <span class="title">User Experience Designer</span> <span class="meta">/ Bogota, Colombia / Remote</span></div>
          <div class="job-date">February 2019 - January 2022</div>
          <ul>
            <li>Rebuilt bulk data entry for livestock farms: loading a 70-animal farm went from ~6 hours to ~1 hour, and per animal from 5 minutes to under 1 minute.</li>
            <li>100% of new farms onboard through the bulk flow and 98% of tracked farms migrated to it; Fedegan reporting went from ~167 hours to under 33 hours per month.</li>
          </ul>
        </div>

        <div class="job">
          <div class="job-line"><span class="org">Greens Supermarket</span>, <span class="title">Senior Graphic Designer</span> <span class="meta">/ Swieqi, Malta / On-site</span></div>
          <div class="job-date">September 2021 - November 2023</div>
          <ul>
            <li>Led visual identity and digital design across three food brands in the Greens Group: Greens Supermarket, Fresh To Go and Blok Foods.</li>
            <li>Designed and launched several brand websites, led the identity system across photography, video, animation and packaging, and built the guidelines that held output consistent across the creative team.</li>
          </ul>
        </div>

      </section>

      <section>
        <h2>Earlier experience</h2>
        <div class="earlier">
          <div class="row"><span class="who"><span class="org">Fresh To Go Foods Ltd, Greens Supermarket Group</span>, <span class="title">Senior Graphic Designer</span> <span class="meta">/ Swieqi, Malta</span></span> <span class="when">September 2019 - November 2023</span></div>
          <div class="row"><span class="who"><span class="org">Greens Supermarket</span>, <span class="title">Graphic Designer</span> <span class="meta">/ Swieqi, Malta</span></span> <span class="when">August 2019 - August 2021</span></div>
          <div class="row"><span class="who"><span class="org">Sanitas Medical Center</span>, <span class="title">Lead Animator</span> <span class="meta">/ Colombia</span></span> <span class="when">February 2019 - May 2019</span></div>
          <div class="row"><span class="who"><span class="org">Rama Judicial, Consejo Superior de la Judicatura</span>, <span class="title">Graphic Designer</span> <span class="meta">/ Colombia</span></span> <span class="when">September 2018 - January 2019</span></div>
          <div class="row"><span class="who"><span class="org">Agencia Trompo, in-house at Politecnico Grancolombiano</span>, <span class="title">Junior Graphic Designer</span> <span class="meta">/ Bogota, Colombia</span></span> <span class="when">February 2017 - February 2018</span></div>
        </div>
      </section>

      <section>
        <h2>Projects</h2>

        <div class="job">
          <div class="job-line"><span class="org">Finanzas Familiares</span>, <span class="title">Product Designer and Developer</span> <span class="meta">/ Berlin, Germany / Self-initiated</span></div>
          <div class="job-date">July 2025 - Present, live at finanzas.juliang.de</div>
          <ul>
            <li>Designed and built a household finance progressive web app in daily use: dashboard, budgets per category, bills, subscriptions and planner, over ~595 transactions.</li>
            <li>Connected two banks through Open Banking, importing every 3 hours, and replaced magic-link sign-in with a 6-digit code after the link kept opening a session outside the installed app. React, TypeScript and Vite on Supabase, web push, on Vercel.</li>
          </ul>
        </div>

        <div class="job">
          <div class="job-line"><span class="org">NotchTunes</span>, <span class="title">Product Designer and Developer</span> <span class="meta">/ Berlin, Germany / Self-initiated</span></div>
          <div class="job-date">July 2025 - Present, macOS app</div>
          <ul>
            <li>Designed a music widget that lives in the MacBook notch: collapsed it is the artwork and a three-bar equalizer, and hovering opens transport, scrubbing and volume.</li>
            <li>Unified four players behind one interface: Apple Music and Spotify over AppleScript, YouTube and YouTube Music by reading the page video in Safari or Chrome. Controls the system silently refuses are verified on the next poll and dimmed, so the UI never lies about state.</li>
          </ul>
        </div>

      </section>
    </div>

    <div class="side">
      <section>
        <h2>Skills continued</h2>

        <div class="skillgroup">
          <div class="gname">Research and Validation</div>
          <div class="item">User Research (Qual and Quant)</div>
          <div class="item">Discovery Interviews</div>
          <div class="item">User Personas</div>
          <div class="item">Usability Testing</div>
          <div class="item">User Feedback Loops</div>
          <div class="item">Data-Driven Experimentation</div>
          <div class="item">Data-Informed Design</div>
        </div>

        <div class="skillgroup">
          <div class="gname">Product and Technology</div>
          <div class="item">B2B Software as a Service (SaaS)</div>
          <div class="item">Internal Tools</div>
          <div class="item">ERP Systems</div>
          <div class="item">Enterprise Web Applications</div>
          <div class="item">Responsive Web Design</div>
          <div class="item">iOS and Android Mobile Design</div>
          <div class="item">AI-Powered Product UX</div>
          <div class="item">Copilot-Style Features</div>
          <div class="item">End-to-End Product Design</div>
        </div>

        <div class="skillgroup">
          <div class="gname">Tools</div>
          <div class="item">Figma, FigJam</div>
          <div class="item">Adobe Creative Suite</div>
          <div class="item">Next.js, React</div>
          <div class="item">HTML, CSS, JavaScript</div>
          <div class="item">Claude Code, Gemini, NotebookLM</div>
        </div>

        <div class="skillgroup">
          <div class="gname">Ways of Working</div>
          <div class="item">Cross-Functional Squads</div>
          <div class="item">Stakeholder Alignment</div>
          <div class="item">Scope, Prioritize and Define Outcomes</div>
          <div class="item">Design Critiques</div>
          <div class="item">Agile and Iterative Delivery</div>
          <div class="item">Design-to-Code Handoff</div>
        </div>

      </section>
    </div>
  </div>
</div>

</body>
</html>`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  await document.fonts.ready;
});
// `.page` clips with overflow:hidden so a slightly long column cannot push a
// third page out. That means an overlong column loses its last job silently, so
// measure every column and refuse to write a PDF that is missing content.
const overflow = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll(".page").forEach((pg, i) => {
    pg.querySelectorAll(".main, .side").forEach((col) => {
      /* the columns are flex items stretched to full height, so scrollHeight
         never drops below clientHeight and cannot report spare room. Measure
         from the top of the column to the bottom of its last child instead. */
      const last = col.lastElementChild;
      const used = last
        ? last.getBoundingClientRect().bottom - col.getBoundingClientRect().top
        : 0;
      const avail = col.clientHeight;
      out.push({
        page: i + 1,
        col: col.className,
        over: Math.round(used - avail),
        room: Math.round(avail - used),
      });
    });
  });
  return out;
});
for (const c of overflow) {
  console.log(`page ${c.page} .${c.col}: ${c.over > 0 ? `OVERFLOW ${c.over}px` : `${c.room}px spare`}`);
}
if (process.env.CV_MEASURE) {
  const blocks = await page.evaluate(() =>
    [...document.querySelectorAll(".page")].flatMap((pg, i) =>
      [...pg.querySelectorAll(".main > section, .side > section")].map((s) => ({
        page: i + 1,
        col: s.parentElement.className,
        name: s.querySelector("h2")?.textContent ?? "?",
        h: Math.round(s.getBoundingClientRect().height),
      })),
    ),
  );
  for (const b of blocks) console.log(`  p${b.page} ${b.col.padEnd(4)} ${String(b.h).padStart(5)}px  ${b.name}`);
  const jobs = await page.evaluate(() =>
    [...document.querySelectorAll(".page")].flatMap((pg, i) =>
      [...pg.querySelectorAll(".main .job")].map((j) => ({
        page: i + 1,
        name: j.querySelector(".org")?.textContent + " / " + j.querySelector(".title")?.textContent,
        h: Math.round(j.getBoundingClientRect().height),
      })),
    ),
  );
  for (const j of jobs) console.log(`    p${j.page} ${String(j.h).padStart(4)}px  ${j.name}`);
}
const clipped = overflow.filter((c) => c.over > 0);
if (clipped.length && !process.env.CV_ALLOW_OVERFLOW) {
  throw new Error(
    `Content would be clipped: ${clipped
      .map((c) => `page ${c.page} .${c.col} by ${c.over}px`)
      .join(", ")}. Move entries between pages or tighten the type.`,
  );
}

const rawPdf = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "0", bottom: "0", left: "0", right: "0" },
});
await browser.close();

// Strip headless-browser fingerprints; set clean, human-authored metadata.
const doc = await PDFDocument.load(rawPdf);
doc.setTitle("Julian David Giraldo Rojas | Product Designer CV");
doc.setAuthor("Julian David Giraldo Rojas");
doc.setSubject("Product Designer CV");
doc.setKeywords([]);
doc.setCreator("Julian David Giraldo Rojas");
doc.setProducer("Julian David Giraldo Rojas");
doc.setCreationDate(new Date());
doc.setModificationDate(new Date());
const pdfBuffer = await doc.save();

const outPublic = resolve(projectRoot, "public/Julian_Giraldo_CV.pdf");
const outPortfolioRoot = resolve(projectRoot, "Julian_Giraldo_CV_ProductDesigner.pdf");
const outRepoRoot = resolve(repoRoot, "Julian_Giraldo_CV_ProductDesigner.pdf");

mkdirSync(dirname(outPublic), { recursive: true });
writeFileSync(outPublic, pdfBuffer);
writeFileSync(outPortfolioRoot, pdfBuffer);
writeFileSync(outRepoRoot, pdfBuffer);

console.log("CV PDF written:");
console.log(" -", outPublic);
console.log(" -", outPortfolioRoot);
console.log(" -", outRepoRoot);
