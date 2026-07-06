// Generate Julian's CV PDF from embedded HTML using Playwright.
// Run: node scripts/generate-cv.mjs

import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const repoRoot = resolve(projectRoot, "..");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Julian David Giraldo Rojas — CV</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 11mm 14mm; }
  * { box-sizing: border-box; }
  :root {
    --fg: #1a1a1a;
    --muted: #a3a3a0;
    --muted-strong: #8a8a88;
    --border: rgba(10,10,10,0.10);
  }
  html, body {
    font-family: "Geist", -apple-system, "Helvetica Neue", Arial, sans-serif;
    font-size: 9pt;
    line-height: 1.42;
    color: var(--fg);
    margin: 0;
    font-weight: 400;
  }
  .display {
    font-family: "Outfit", "Geist", sans-serif;
    font-weight: 600;
    letter-spacing: -0.005em;
    line-height: 1;
  }

  .header { margin-bottom: 8px; }
  h1.name {
    font-size: 21pt;
    margin: 0 0 5px 0;
  }
  .role-line {
    font-family: "Outfit", sans-serif;
    font-weight: 400;
    font-size: 8.6pt;
    letter-spacing: 0.02em;
    color: var(--muted);
    margin: 0 0 3px 0;
  }
  .contact-line {
    font-size: 8.4pt;
    color: var(--fg);
    margin: 0;
  }
  .contact-line .dot { color: var(--muted); margin: 0 5px; }

  section { margin-top: 9px; }
  h2 {
    font-family: "Outfit", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    font-size: 8pt;
    font-weight: 600;
    color: var(--muted-strong);
    border-top: 0.6pt solid var(--border);
    padding-top: 6px;
    margin: 9px 0 5px 0;
  }

  p.summary {
    font-size: 9pt;
    line-height: 1.45;
    margin: 0;
  }

  .job { margin-top: 7px; }
  .job:first-of-type { margin-top: 0; }
  .job-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 1px;
  }
  .job-title {
    font-family: "Outfit", sans-serif;
    font-size: 9.6pt;
    font-weight: 600;
  }
  .job-title .at { color: var(--muted-strong); font-weight: 400; }
  .job-date {
    font-size: 8pt;
    color: var(--muted);
    white-space: nowrap;
  }
  .job-loc {
    font-size: 8pt;
    color: var(--muted);
    margin-bottom: 2px;
  }

  ul {
    margin: 2px 0 0 0;
    padding-left: 12px;
    list-style: disc;
  }
  ul li {
    margin-bottom: 2px;
    font-size: 8.8pt;
    line-height: 1.4;
    padding-left: 2px;
  }
  ul li::marker { color: var(--muted); }

  .edu-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 2px;
  }
  .edu-row .degree { font-family: "Outfit", sans-serif; font-size: 9pt; font-weight: 600; }
  .edu-row .school { color: var(--muted-strong); }
  .edu-row .date { font-size: 8pt; color: var(--muted); white-space: nowrap; }

  .skill-row {
    display: flex;
    gap: 12px;
    margin-bottom: 3px;
    align-items: baseline;
  }
  .skill-row .label {
    font-family: "Outfit", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    font-size: 6.9pt;
    font-weight: 500;
    color: var(--muted);
    width: 74px;
    flex-shrink: 0;
  }
  .skill-row .val {
    font-size: 8.8pt;
    flex: 1;
    line-height: 1.4;
  }

  b, strong { font-weight: 500; }
</style>
</head>
<body>
  <div class="header">
    <h1 class="name display">Julian David Giraldo Rojas</h1>
    <p class="role-line">Product Designer (UX/UI) · B2B SaaS &amp; Internal Tools · Full-Lifecycle Ownership · Design Systems · AI UX · Berlin, DE</p>
    <p class="contact-line">
      application@juliang.de<span class="dot">·</span>+49 151 5884 4518<span class="dot">·</span>juliang.de<span class="dot">·</span>linkedin.com/in/julian-gr<span class="dot">·</span>behance.net/JulianGR
    </p>
  </div>

  <section>
    <h2>Summary</h2>
    <p class="summary">Product Designer (UX/UI) with 7+ years owning design across the full product lifecycle, from discovery and conceptualization to final implementation and polish, on complex B2B SaaS platforms and internal tools with many flows, states and feature dependencies. I translate ambitious business and user problems into intuitive, user-centered solutions, and I rationalize every decision with data, research insights and direct customer feedback. I contribute to and maintain scalable design systems that keep the whole interface consistent, run usability testing, user feedback loops and data-driven experimentation, and collaborate tightly in cross-functional squads with PMs, engineers and analysts. I am AI-native: I design AI-powered UX and Copilot-style features, and because I write frontend (Next.js) my prototypes are real and my handoff is buildable. Curious, pragmatic, and a consistently high bar for craft. Berlin-based, open to hybrid across the EU.</p>
  </section>

  <section>
    <h2>Experience</h2>

    <div class="job">
      <div class="job-head">
        <div class="job-title">Product Designer <span class="at">— Duo Sicilian Ice Cream</span></div>
        <div class="job-date">Oct 2024 — Present</div>
      </div>
      <div class="job-loc">Berlin, Germany · On-site</div>
      <ul>
        <li>Designed and shipped Duo's internal ERP from zero — a complex platform (13 modules, 40+ document types, 6 permission roles) in daily use across 9 locations and 6 departments, owning the full lifecycle from discovery to final implementation and polish.</li>
        <li>Shipped 13 interdependent modules (inventory, orders, deliveries, logistics GPS, suppliers, production, staff, reports and more) — translating operational goals into intuitive, user-centered flows, wireframes, high-fidelity mockups and interactive prototypes.</li>
        <li>Designed a role-based access model with 6 distinct roles; transformed onboarding UX, cutting onboarding time by ~30% and eliminating accidental cross-module edits.</li>
        <li>Built a three-state status system (ok / warn / critical) applied consistently across inventory, expiring items, HR compliance, deliveries and production.</li>
        <li>Contribute to and maintain a scalable design system (components, patterns, design tokens); run usability testing, user feedback loops and data-driven experimentation with real users to rationalize every decision.</li>
        <li>Design AI-powered UX and Copilot-style features, collaborating with engineering to scope, prioritize and define outcomes; I write frontend (Next.js) so prototypes are real and handoff is buildable.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-head">
        <div class="job-title">Lead Product Designer <span class="at">— TaurusWebs (Freelance)</span></div>
        <div class="job-date">Feb 2019 — Present</div>
      </div>
      <div class="job-loc">Bogotá, Colombia · Remote</div>
      <ul>
        <li>Owned end-to-end design of complex B2B platforms and commercial apps, from discovery and flows to high-fidelity UI and interactive prototypes across web and mobile.</li>
        <li>Designed the Taurus Ecosystem: a unified workspace integrating CRM, knowledge base and chat via single sign-on (SSO), with a scalable shared design system.</li>
        <li>Worked in cross-functional collaboration with engineers and stakeholders, rationalizing design decisions and defining outcomes together.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-head">
        <div class="job-title">Senior Graphic Designer / Lead Designer <span class="at">— Greens Group</span></div>
        <div class="job-date">Aug 2019 — Nov 2023</div>
      </div>
      <div class="job-loc">Greens Supermarket · Fresh To Go · Blok Foods — Swieqi, Malta · On-site</div>
      <ul>
        <li>Led visual identity and digital design across three brands, holding a consistently high bar for quality and craft. Promoted Graphic Designer to Senior; Lead Designer on contract for Blok Foods (2022–2023).</li>
        <li>Built and maintained a multi-channel design system from the ground up for a multi-person team.</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>Education</h2>
    <div class="edu-row">
      <div><span class="degree">MA Visual &amp; Experience Design</span> <span class="school">— UE University of Applied Sciences, Berlin (consumer mobile app thesis)</span></div>
      <div class="date">2025</div>
    </div>
    <div class="edu-row">
      <div><span class="degree">BA Marketing &amp; Advertising</span> <span class="school">— Politécnico Grancolombiano, Bogotá</span></div>
      <div class="date">2019</div>
    </div>
  </section>

  <section>
    <h2>Skills</h2>
    <div class="skill-row"><div class="label">Process</div><div class="val">Full-lifecycle Ownership (discovery → polish) · User Flows · Wireframes · High-fidelity Mockups · Interactive Prototypes · Scope, Prioritize &amp; Define Outcomes</div></div>
    <div class="skill-row"><div class="label">Complex UX</div><div class="val">Complex Platforms · Multiple Flows, States &amp; Feature Dependencies · Onboarding UX · Modular / Pricing Flows · Turning Ambitious Goals into Elegant, User-centered UX</div></div>
    <div class="skill-row"><div class="label">Systems</div><div class="val">Scalable Design Systems · Components · Patterns · Design Tokens · UI Consistency at Scale</div></div>
    <div class="skill-row"><div class="label">Research</div><div class="val">Usability Testing · User Feedback Loops · Data-driven Experimentation · Design Rationale (data + research + customer feedback) · Human Behaviour · Metrics</div></div>
    <div class="skill-row"><div class="label">AI / Build</div><div class="val">AI-powered UX · Copilot-style Features · Claude Code · Gemini · NotebookLM · HTML · CSS · JavaScript · Next.js · Figma · FigJam</div></div>
    <div class="skill-row"><div class="label">Domains</div><div class="val">B2B SaaS · Internal Tools · ERP Systems · Financial / Operational Tooling · Invoicing &amp; Accounting-adjacent Workflows · Cross-functional Squads (PM, Eng, Analysts)</div></div>
    <div class="skill-row"><div class="label">Languages</div><div class="val">Spanish (Native) · English (C1) · German (A2)</div></div>
  </section>

</body>
</html>`;

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  await document.fonts.ready;
});
const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: { top: "14mm", bottom: "14mm", left: "16mm", right: "16mm" },
});
await browser.close();

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
