// Generate Julian's CV PDF from embedded HTML using Playwright.
// Run: node scripts/generate-cv.mjs

import { chromium } from "playwright";
import { writeFileSync, copyFileSync, mkdirSync } from "fs";
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
<style>
  @page { size: A4; margin: 11mm 14mm; }
  * { box-sizing: border-box; }
  :root {
    --fg: #0a0a0a;
    --muted: #8a8a88;
    --border: rgba(10,10,10,0.10);
    --subtle: #e9e9e6;
  }
  html, body {
    font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 9pt;
    line-height: 1.42;
    color: var(--fg);
    margin: 0;
    font-weight: 400;
  }
  .display {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 600;
    letter-spacing: -0.005em;
    line-height: 1;
  }
  .mono {
    font-family: "SF Mono", Menlo, Consolas, monospace;
    text-transform: uppercase;
    letter-spacing: 0.10em;
    font-size: 7.2pt;
    color: var(--muted);
  }
  .header { margin-bottom: 6px; }
  .rule-top {
    height: 1px;
    width: 40px;
    background: var(--fg);
    opacity: 0.4;
    margin: 0 0 6px 0;
  }
  h1.name {
    font-size: 22pt;
    margin: 0 0 4px 0;
  }
  .role-line {
    margin: 4px 0 0 0;
  }
  .role-line .sep { opacity: 0.35; margin: 0 6px; }
  .role-line .key { color: var(--fg); }
  .contact-line {
    margin-top: 3px;
    font-size: 8.4pt;
    color: var(--fg);
  }
  .contact-line a { color: var(--fg); text-decoration: none; }
  .contact-line .dot { color: var(--muted); margin: 0 5px; }

  section { margin-top: 8px; }
  h2 {
    font-family: "SF Mono", Menlo, Consolas, monospace;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 8pt;
    color: var(--fg);
    border-top: 0.6pt solid var(--border);
    padding-top: 5px;
    margin: 8px 0 5px 0;
    font-weight: 500;
    display: flex;
    align-items: baseline;
    gap: 10px;
  }
  h2::before {
    content: attr(data-num);
    color: var(--muted);
    font-weight: 400;
  }

  p.summary {
    font-size: 9pt;
    line-height: 1.45;
    margin: 0;
    color: var(--fg);
  }

  .job { margin-top: 6px; }
  .job:first-of-type { margin-top: 0; }
  .job-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 1px;
  }
  .job-title {
    font-size: 9.4pt;
    font-weight: 500;
  }
  .job-title .at { color: var(--muted); font-weight: 400; }
  .job-date {
    font-family: "SF Mono", Menlo, Consolas, monospace;
    font-size: 7pt;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }
  .job-loc {
    font-family: "SF Mono", Menlo, Consolas, monospace;
    font-size: 6.8pt;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 2px;
  }
  ul {
    margin: 2px 0 0 0;
    padding-left: 0;
    list-style: none;
  }
  ul li {
    position: relative;
    padding-left: 12px;
    margin-bottom: 2px;
    font-size: 8.8pt;
    line-height: 1.38;
  }
  ul li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--muted);
    font-size: 7.5pt;
    top: 1px;
  }

  .edu-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 2px;
  }
  .edu-row .degree { font-size: 9pt; font-weight: 500; }
  .edu-row .school { color: var(--muted); }
  .edu-row .date {
    font-family: "SF Mono", Menlo, Consolas, monospace;
    font-size: 7pt;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }

  .skills-grid { margin-top: 0; }
  .skill-row {
    display: flex;
    gap: 12px;
    margin-bottom: 3px;
    align-items: baseline;
  }
  .skill-row .label {
    font-family: "SF Mono", Menlo, Consolas, monospace;
    font-size: 6.8pt;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: var(--muted);
    width: 70px;
    flex-shrink: 0;
  }
  .skill-row .val {
    font-size: 8.8pt;
    color: var(--fg);
    flex: 1;
    line-height: 1.4;
  }

  .lang-row {
    display: flex;
    gap: 32px;
    margin-top: 2px;
  }
  .lang-row .lang b {
    font-weight: 500;
    color: var(--fg);
  }
  .lang-row .lang .lvl { color: var(--muted); margin-left: 4px; }

  b, strong { font-weight: 500; }
</style>
</head>
<body>
  <div class="header">
    <div class="rule-top"></div>
    <h1 class="name display">Julian David Giraldo Rojas</h1>
    <p class="role-line mono">
      <span class="key">role</span><span class="sep">→</span>Product Designer<span class="sep">·</span><span class="key">loc</span><span class="sep">→</span>Berlin, DE<span class="sep">·</span><span class="key">focus</span><span class="sep">→</span>B2B SaaS, Internal Tools
    </p>
    <p class="contact-line">
      application@juliang.de<span class="dot">·</span>+49 151 5884 4518<span class="dot">·</span>juliang.de<span class="dot">·</span>linkedin.com/in/julian-gr<span class="dot">·</span>behance.net/JulianGR
    </p>
  </div>

  <section>
    <h2 data-num="01">Profile</h2>
    <p class="summary">Product Designer based in Berlin. MA in Visual and Experience Design from UE Berlin, 9+ years of experience across product, brand, and visual design. Focused on B2B software, internal tools, and data-heavy interfaces where dense information has to feel calm and usable. Designed and shipped the internal ERP at Duo Sicilian Ice Cream, used daily across 9 locations, 6 departments, 23+ staff — also one of the operators, which creates a tight feedback loop end-to-end.</p>
  </section>

  <section>
    <h2 data-num="02">Experience</h2>

    <div class="job">
      <div class="job-head">
        <div class="job-title">Product Designer <span class="at">— Duo Sicilian Ice Cream</span></div>
        <div class="job-date">Oct 2024 — Present</div>
      </div>
      <div class="job-loc">Berlin, Germany · On-site</div>
      <ul>
        <li>Designed and shipped Duo's internal ERP from zero, used daily across 9 locations and 6 departments (operations, logistics, production, HR, finance, management).</li>
        <li>End-to-end ownership: discovery interviews, information architecture for 40+ document types, wireframes, Figma prototypes, high-fidelity UI, design system, dev handoff, post-launch iteration.</li>
        <li>Designed a role-based access model with six distinct roles, cutting onboarding friction and preventing accidental edits across modules.</li>
        <li>Built a three-state status system (ok / warn / critical) applied consistently across inventory, expiring items, HR compliance, deliveries, production.</li>
        <li>Shipped 13 modules: dashboard, inventory, flavours &amp; stock, expiring items, movements, orders, deliveries, logistics GPS, suppliers, production, staff, reports, settings.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-head">
        <div class="job-title">Product Designer <span class="at">— TaurusWebs (Freelance)</span></div>
        <div class="job-date">Feb 2019 — Present</div>
      </div>
      <div class="job-loc">Bogotá, Colombia · Remote</div>
      <ul>
        <li>Lead designer for custom internal platforms and client-facing applications, built from scratch.</li>
        <li>Designed the Taurus Ecosystem: a unified internal workspace combining CRM (Twenty), knowledge base (AppFlowy) and encrypted chat (Matrix), tied through single SSO. Owned discovery, IA, user flows, Figma UI, prototype, stakeholder pitch.</li>
        <li>Translated complex technical and infrastructure decisions (data sovereignty, hosting, security) into product narratives non-technical stakeholders could sign off on.</li>
        <li>Led brand identity, web design and creative direction for client work spanning Latin America and the USA.</li>
      </ul>
    </div>

    <div class="job">
      <div class="job-head">
        <div class="job-title">Senior Graphic Designer / Lead Designer <span class="at">— Greens Group</span></div>
        <div class="job-date">Aug 2019 — Nov 2023</div>
      </div>
      <div class="job-loc">Greens Supermarket · Fresh To Go · Blok Foods — Swieqi, Malta · On-site</div>
      <ul>
        <li>Led visual identity and digital design across three food brands. Promoted from Graphic Designer (Aug 2019 — Aug 2021) to Senior Graphic Designer (Sep 2021 — Nov 2023). Lead Designer on contract for Blok Foods (Feb 2022 — Nov 2023).</li>
        <li>Designed and shipped multiple brand websites for the chain, concept to live deployment.</li>
        <li>Built a multi-channel design system across web, photography, video, animation, packaging and in-store communications, keeping a multi-person creative team consistent across parallel campaigns.</li>
      </ul>
    </div>
  </section>

  <section>
    <h2 data-num="03">Education</h2>
    <div class="edu-row">
      <div><span class="degree">MA Visual &amp; Experience Design</span> <span class="school">— UE University of Applied Sciences, Berlin</span></div>
      <div class="date">2023 — 2025</div>
    </div>
    <div class="edu-row">
      <div><span class="degree">BA Marketing &amp; Advertising</span> <span class="school">— Politécnico Grancolombiano, Bogotá</span></div>
      <div class="date">2015 — 2019</div>
    </div>
  </section>

  <section>
    <h2 data-num="04">Skills</h2>
    <div class="skills-grid">
      <div class="skill-row"><div class="label">Design</div><div class="val">Product Design · UX/UI · Interaction Design · Information Architecture · End-to-end Product Design · Systems Thinking · Visual Design · Brand Identity · Web Design · Motion Design</div></div>
      <div class="skill-row"><div class="label">Process</div><div class="val">User Research · Usability Testing · Discovery · JTBD · Wireframing · Prototyping · Design Systems · Design Tokens · Accessibility (WCAG 2.1 AA)</div></div>
      <div class="skill-row"><div class="label">Tools</div><div class="val">Figma · Framer · Adobe Creative Suite · HTML · CSS · Next.js (basics) · Notion · Linear</div></div>
      <div class="skill-row"><div class="label">Domains</div><div class="val">B2B SaaS · Internal Tools · Data-heavy Interfaces · CRM · ERP · Brand · Web</div></div>
      <div class="skill-row"><div class="label">Collab</div><div class="val">Cross-functional Work · Agile · Stakeholder Management · Pitch Decks · Dev Handoff</div></div>
    </div>
  </section>

  <section>
    <h2 data-num="05">Languages</h2>
    <div class="lang-row">
      <div class="lang"><b>Spanish</b><span class="lvl">— Native</span></div>
      <div class="lang"><b>English</b><span class="lvl">— C1 Fluent</span></div>
      <div class="lang"><b>German</b><span class="lvl">— A2 Studying</span></div>
    </div>
  </section>
</body>
</html>`;

const browser = await chromium.launch();
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
