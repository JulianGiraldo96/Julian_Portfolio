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
  html, body {
    font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 8.6pt;
    line-height: 1.28;
    color: #111;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    font-variant-ligatures: none;
  }
  h1 {
    font-family: "Times New Roman", Times, serif;
    font-size: 20pt;
    font-weight: 700;
    text-align: center;
    margin: 0 0 3px 0;
    letter-spacing: -0.01em;
  }
  .title {
    text-align: center;
    font-size: 9pt;
    margin-bottom: 2px;
  }
  .contact {
    text-align: center;
    font-size: 9pt;
    margin-bottom: 2px;
  }
  .links {
    text-align: center;
    font-size: 9pt;
    font-weight: 600;
    margin-bottom: 12px;
  }
  h2 {
    font-size: 8.4pt;
    font-weight: 700;
    letter-spacing: 0.22em;
    border-bottom: 0.6pt solid #111;
    padding-bottom: 2px;
    margin: 7px 0 4px 0;
    text-transform: uppercase;
  }
  .job-header {
    margin-top: 4px;
    margin-bottom: 1px;
  }
  .job-header b { font-weight: 700; }
  .job-header .meta { color: #222; font-style: italic; }
  .freelance-pill {
    display: inline-block;
    font-size: 7pt;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: 0.6pt solid #111;
    border-radius: 999px;
    padding: 1px 6px;
    margin-left: 6px;
    vertical-align: 1px;
  }
  ul {
    margin: 2px 0 0 0;
    padding-left: 14px;
    list-style: none;
  }
  ul li {
    position: relative;
    padding-left: 8px;
    margin-bottom: 1px;
  }
  ul li::before {
    content: "–";
    position: absolute;
    left: -6px;
  }
  table.skills {
    width: 100%;
    border-collapse: collapse;
    margin-top: 2px;
  }
  table.skills td {
    vertical-align: top;
    padding: 2px 8px 2px 0;
  }
  table.skills td.label {
    width: 95px;
    font-weight: 700;
  }
  .edu p { margin: 2px 0; }
  .edu b { font-weight: 700; }
  .lang { display: flex; gap: 28px; font-size: 9.2pt; margin-top: 2px; }
  .lang b { font-weight: 700; }
  b, strong { font-weight: 700; }
</style>
</head>
<body>
  <h1>Julian David Giraldo Rojas</h1>
  <div class="title">Product Designer · End-to-end UX/UI for B2B software &amp; internal tools</div>
  <div class="contact">application@juliang.de · +49 15158844518 · Berlin, Germany</div>
  <div class="links">juliang.de · linkedin.com/in/julian-gr · behance.net/JulianGR</div>

  <h2>Profile</h2>
  <p>Product Designer based in Berlin with a Master's in Visual and Experience Design from UE Berlin and 8+ years across product, brand, and visual design. I focus on <b>B2B software, internal tools and data-heavy interfaces</b>, work where dense information has to feel calm and usable. My differentiator: I design products I also use myself. The ERP I designed and shipped at Duo Sicilian Ice Cream is in daily production across nine locations, six departments and 23+ staff, and I'm one of the operators using it. That tight feedback loop shapes how I work end-to-end: research, information architecture, Figma, design systems, prototyping, and shipping with engineering.</p>

  <h2>Experience</h2>

  <div class="job-header"><b>Product Designer</b> | Duo Sicilian Ice Cream, Berlin <span class="meta">· Oct 2024 – Present</span></div>
  <ul>
    <li>Designed and shipped Duo's internal ERP from zero, now used daily across <b>9 locations and 6 departments</b> (operations, logistics, production, HR, finance, management).</li>
    <li>Owned the full product process end-to-end: discovery interviews with each department, information architecture for 40+ document types, wireframes, interactive prototypes in Figma, high-fidelity UI, design system, dev handoff and post-launch iteration.</li>
    <li>Designed a <b>role-based access model</b> with six distinct roles so each user only sees the data they own. This cuts onboarding friction and prevents accidental edits across modules.</li>
    <li>Built a three-state status system (ok / warn / critical) applied consistently across inventory, expiring items, HR compliance, deliveries and production. Critical items are always surfaced, never buried.</li>
    <li>Shipped 13 modules: dashboard, inventory, flavours &amp; stock, expiring items, movements, orders, deliveries, logistics GPS, suppliers, production, staff, reports and settings.</li>
    <li>Use the system daily as one of the operators, which creates an honest, continuous feedback loop with the rest of the users.</li>
  </ul>

  <div class="job-header"><b>Product Designer (Freelance)</b> | Big-O, Bogotá (remote) <span class="meta">· Oct 2017 – Present</span> <span class="freelance-pill">Freelance</span></div>
  <ul>
    <li>Freelance lead designer for custom internal platforms and client-facing applications built from scratch.</li>
    <li>Designed the <b>Taurus Ecosystem</b>, a unified internal workspace combining a CRM (Twenty), knowledge base (AppFlowy) and encrypted chat (Matrix), all tied together through a single SSO identity. Self-hosted, fully owned by the client. Owned discovery, IA, user flows, Figma UI, prototype and stakeholder pitch.</li>
    <li>Translated complex technical and infrastructure decisions (data sovereignty, hosting, security) into clear product narratives that non-technical stakeholders could sign off on.</li>
    <li>Cross-functional work with PMs, engineers and clients across multiple parallel projects on tight timelines.</li>
  </ul>

  <div class="job-header"><b>Design Lead</b> | Greens Supermarket, Swieqi, Malta <span class="meta">· Apr 2021 – Nov 2023</span></div>
  <ul>
    <li>Designed and shipped multiple brand websites for the supermarket chain, from concept to live deployment.</li>
    <li>Built a multi-channel design system across web, photography, video, animation, packaging and in-store communications, keeping a multi-person creative team consistent across parallel campaigns.</li>
    <li>Led the visual identity strategy and managed design workflows end-to-end.</li>
  </ul>

  <h2>Education</h2>
  <div class="edu">
    <p><b>MA Visual &amp; Experience Design</b>, UE University of Applied Sciences, Berlin <span style="font-style:italic">· 2023 – 2025</span></p>
    <p><b>BA Marketing &amp; Advertising</b>, Politécnico Grancolombiano, Bogotá <span style="font-style:italic">· 2015 – 2019</span></p>
  </div>

  <h2>Skills &amp; Tools</h2>
  <table class="skills">
    <tr><td class="label">Design</td><td>Product Design · UX/UI Design · Interaction Design · Information Architecture · End-to-end Product Design · Systems Thinking · Visual Design</td></tr>
    <tr><td class="label">Process</td><td>User Research · Usability Testing · Discovery · JTBD · Wireframing · Prototyping · Design Systems · Design Tokens · Accessibility (WCAG 2.1 AA)</td></tr>
    <tr><td class="label">Tools</td><td>Figma · Framer · Adobe Creative Suite · HTML &amp; CSS · Next.js (basics) · Notion · Linear</td></tr>
    <tr><td class="label">Domains</td><td>B2B SaaS · Internal Tools · Data-heavy Interfaces · CRMs &amp; ERPs · Brand &amp; Web</td></tr>
    <tr><td class="label">Collaboration</td><td>Cross-functional Work · Agile · Stakeholder Management · Pitch Decks · Dev Handoff</td></tr>
  </table>

  <h2>Languages</h2>
  <div class="lang">
    <div><b>Spanish</b> – Native</div>
    <div><b>English</b> – C1 (Fluent)</div>
    <div><b>German</b> – A2 (Studying)</div>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
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
