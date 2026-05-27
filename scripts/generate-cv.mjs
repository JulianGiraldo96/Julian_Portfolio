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
<title>Julian David Giraldo Rojas - CV</title>
<style>
  @page { size: A4; margin: 10mm 12mm; }
  * { box-sizing: border-box; }
  html, body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8.4pt;
    line-height: 1.28;
    color: #000;
    margin: 0;
  }
  h1 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15pt;
    font-weight: 700;
    text-align: left;
    margin: 0 0 1px 0;
  }
  .title { font-size: 9pt; font-weight: 700; margin-bottom: 1px; }
  .contact { font-size: 8.4pt; margin-bottom: 1px; }
  .links { font-size: 8.4pt; margin-bottom: 4px; }
  h2 {
    font-size: 9.5pt;
    font-weight: 700;
    border-bottom: 0.6pt solid #000;
    padding-bottom: 1px;
    margin: 5px 0 2px 0;
    text-transform: uppercase;
  }
  h3 {
    font-size: 8.8pt;
    font-weight: 700;
    margin: 4px 0 0 0;
  }
  .meta { font-size: 8.2pt; font-weight: 400; margin: 0 0 1px 0; }
  ul {
    margin: 1px 0 2px 0;
    padding-left: 14px;
    list-style: disc;
  }
  ul li { margin-bottom: 1px; }
  p { margin: 1px 0; }
  .skills-row { margin: 2px 0; }
  .skills-row b { font-weight: 700; }
  b, strong { font-weight: 700; }
</style>
</head>
<body>
  <h1>Julian David Giraldo Rojas</h1>
  <p class="title">Product Designer - End-to-end UX/UI for B2B Software and Internal Tools</p>
  <p class="contact">Email: application@juliang.de | Phone: +49 15158844518 | Location: Berlin, Germany</p>
  <p class="links">Website: juliang.de | LinkedIn: linkedin.com/in/julian-gr | Portfolio: behance.net/JulianGR</p>

  <h2>Professional Summary</h2>
  <p>Product Designer based in Berlin, MA in Visual and Experience Design (UE Berlin), 8+ years across product, brand, and visual design. Focused on B2B software, internal tools, and data-heavy interfaces. Designed and shipped the internal ERP at Duo Sicilian Ice Cream, used daily across 9 locations, 6 departments, 23+ staff. End-to-end skills: user research, information architecture, Figma, design systems, prototyping, engineering handoff.</p>

  <h2>Professional Experience</h2>

  <h3>Product Designer - Duo Sicilian Ice Cream, Berlin, Germany</h3>
  <p class="meta">October 2024 - Present</p>
  <ul>
    <li>Designed and shipped Duo's internal ERP from zero, used daily across 9 locations and 6 departments (operations, logistics, production, HR, finance, management).</li>
    <li>Owned the full product process end-to-end: discovery interviews, information architecture for 40+ document types, wireframes, Figma prototypes, high-fidelity UI, design system, developer handoff, post-launch iteration.</li>
    <li>Designed a role-based access model with six distinct roles, reducing onboarding friction and preventing accidental edits across modules.</li>
    <li>Built a three-state status system (ok, warn, critical) applied consistently across inventory, expiring items, HR compliance, deliveries, and production.</li>
    <li>Shipped 13 modules: dashboard, inventory, flavours and stock, expiring items, movements, orders, deliveries, logistics GPS, suppliers, production, staff, reports, settings.</li>
    <li>Use the system daily as an operator, creating a continuous feedback loop with users.</li>
  </ul>

  <h3>Product Designer (Freelance) - TaurusWebs, Bogota, Colombia (Remote)</h3>
  <p class="meta">February 2019 - Present</p>
  <ul>
    <li>Lead designer for custom internal platforms and client-facing applications built from scratch.</li>
    <li>Designed the Taurus Ecosystem, a unified internal workspace combining CRM (Twenty), knowledge base (AppFlowy), encrypted chat (Matrix), tied through single SSO identity. Owned discovery, IA, user flows, Figma UI, prototype, stakeholder pitch.</li>
    <li>Translated complex technical and infrastructure decisions (data sovereignty, hosting, security) into product narratives for non-technical stakeholders.</li>
    <li>Led brand identity, web design, and creative direction for client work across Latin America and the USA.</li>
  </ul>

  <h3>Senior Graphic Designer and Lead Designer - Greens Group (Greens Supermarket, Fresh To Go, Blok Foods), Swieqi, Malta</h3>
  <p class="meta">August 2019 - November 2023</p>
  <ul>
    <li>Led visual identity and digital design across three food brands. Promoted from Graphic Designer (Aug 2019 - Aug 2021) to Senior Graphic Designer (Sep 2021 - Nov 2023). Lead Designer on contract for Blok Foods (Feb 2022 - Nov 2023).</li>
    <li>Designed and shipped multiple brand websites for the supermarket chain, from concept to live deployment.</li>
    <li>Built a multi-channel design system across web, photography, video, animation, packaging, and in-store communications, keeping a multi-person creative team consistent across parallel campaigns.</li>
  </ul>

  <h2>Education</h2>
  <p><b>Master of Arts, Visual and Experience Design</b> - UE University of Applied Sciences, Berlin, Germany (2023 - 2025)</p>
  <p><b>Bachelor of Arts, Marketing and Advertising</b> - Politecnico Grancolombiano, Bogota, Colombia (2015 - 2019)</p>

  <h2>Skills</h2>
  <p class="skills-row"><b>Design:</b> Product Design, UX Design, UI Design, Interaction Design, Information Architecture, End-to-end Product Design, Systems Thinking, Visual Design, Brand Identity, Web Design, Motion Design</p>
  <p class="skills-row"><b>Process:</b> User Research, Usability Testing, Discovery, Jobs-to-be-Done, Wireframing, Prototyping, Design Systems, Design Tokens, Accessibility (WCAG 2.1 AA)</p>
  <p class="skills-row"><b>Tools:</b> Figma, Framer, Adobe Creative Suite (Photoshop, Illustrator, InDesign, After Effects), HTML, CSS, Next.js, Notion, Linear</p>
  <p class="skills-row"><b>Domains:</b> B2B SaaS, Internal Tools, Data-heavy Interfaces, CRM, ERP, Brand, Web</p>
  <p class="skills-row"><b>Collaboration:</b> Cross-functional Work, Agile, Stakeholder Management, Pitch Decks, Developer Handoff</p>

  <h2>Languages</h2>
  <p>Spanish (Native), English (C1 - Fluent), German (A2 - Studying)</p>
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
