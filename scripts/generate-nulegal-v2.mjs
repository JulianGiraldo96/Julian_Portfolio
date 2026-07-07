// Generate Julian's nu:legal application (v2, updated framing): tailored CV + cover letter PDFs.
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { PDFDocument } from "pdf-lib";

const DIR = "/Users/elputoamo/Library/CloudStorage/Dropbox/Documents/Personal Julian/Personal/2026/Aplications/1-Product_Designer/46-nulegal";

const fontLinks = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const cvStyle = `
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
    font-size: 8.7pt;
    line-height: 1.4;
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

  .header { margin-bottom: 6px; }
  h1.name {
    font-size: 19pt;
    margin: 0 0 4px 0;
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

  section { margin-top: 7px; }
  h2 {
    font-family: "Outfit", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 8pt;
    font-weight: 600;
    color: var(--muted-strong);
    border-top: 0.6pt solid var(--border);
    padding-top: 4px;
    margin: 7px 0 4px 0;
  }

  p.summary {
    font-size: 8.7pt;
    line-height: 1.42;
    margin: 0;
  }

  .job { margin-top: 5px; }
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
    margin-bottom: 1px;
    font-size: 8.6pt;
    line-height: 1.38;
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
    margin-bottom: 2px;
    align-items: baseline;
  }
  .skill-row .label {
    font-family: "Outfit", sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 6.9pt;
    font-weight: 500;
    color: var(--muted);
    width: 74px;
    flex-shrink: 0;
  }
  .skill-row .val {
    font-size: 8.6pt;
    flex: 1;
    line-height: 1.4;
  }

  b, strong { font-weight: 500; }
`;

const cvHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"/>${fontLinks}<style>${cvStyle}</style></head><body>
  <div class="header">
    <h1 class="name display">Julian David Giraldo Rojas</h1>
    <p class="role-line">Product Designer · Berlin, DE</p>
    <p class="contact-line">application@juliang.de<span class="dot">·</span>+49 151 5884 4518<span class="dot">·</span>juliang.de<span class="dot">·</span>linkedin.com/in/julian-gr<span class="dot">·</span>behance.net/JulianGR</p>
  </div>
  <section><h2>Summary</h2>
    <p class="summary">Product Designer with 4 years in product design and 7+ years in design overall, used to being the only designer in the room. I independently run the complete design process: plan and run user tests with real users, analyze them, and turn insights directly into product improvements, from UX concept through UI design to implementation-ready Figma. I am good at reducing complexity, not by leaving things out but by making them understandable. Figma pro: components, variants, auto layout, design tokens, shared libraries engineering can actually use. I am comfortable with AI as a working tool, not a buzzword: I prototype with Claude Code and write frontend (Next.js), so my handoff is buildable. Beyond product, I bring years of brand, marketing and website design. Structured, opinionated, high ownership. Based in Berlin.</p></p>
  </section>
  <section><h2>Experience</h2>
    <div class="job">
      <div class="job-head"><div class="job-title">Product Designer <span class="at">· Duo Sicilian Ice Cream</span></div><div class="job-date">Oct 2024 - Present</div></div>
      <div class="job-loc">Berlin, Germany · On-site</div>
      <ul>
        <li>Sole designer of a complex, document-heavy platform (13 modules, 40+ document types, 6 permission roles) used daily across 9 locations: I own the entire design area, no art director, no big structure.</li>
        <li>Reduce complexity without leaving things out: turned dense bureaucratic workflows (permissions, compliance documents, multi-role processes) into flows operators understand at a glance, including an ok / warning / critical status system.</li>
        <li>Plan and run user tests with the real staff who use the product, analyze results, and ship the improvements: an onboarding redesign cut onboarding time by ~30%.</li>
        <li>Built and actively grow the design system (components, variants, auto layout, design tokens, shared library) so it scales with the product and stays usable for engineering.</li>
        <li>Work directly and iteratively with engineering and management; use AI actively to rethink process (Claude Code prototypes, research synthesis) and write frontend (Next.js), so iterations ship fast.</li>
      </ul>
    </div>
    <div class="job">
      <div class="job-head"><div class="job-title">Product Designer <span class="at">· TaurusWebs (Freelance)</span></div><div class="job-date">Feb 2019 - Present</div></div>
      <div class="job-loc">Bogot&aacute;, Colombia · Remote · User Experience Designer (2019-2022) &rarr; Junior Product Designer (2022-2024) &rarr; Product Designer (2024-Present)</div>
      <ul>
        <li>Run complete design processes independently for B2B platforms and consumer web and mobile apps across Latin America and the USA: discovery, user flows, UI, prototypes, delivery with engineering.</li>
        <li>Made a dense enterprise workflow understandable: redesigned bulk operations on a livestock management platform, cutting a 6-hour setup workflow to under 1 hour (~83% less effort).</li>
        <li>Defend clear, well-reasoned design decisions directly with founders and stakeholders, and question existing workflows when they deserve it.</li>
      </ul>
    </div>
    <div class="job">
      <div class="job-head"><div class="job-title">Senior Graphic Designer / Lead Designer <span class="at">· Greens Group</span></div><div class="job-date">Aug 2019 - Nov 2023</div></div>
      <div class="job-loc">Greens Supermarket · Fresh To Go · Blok Foods · Swieqi, Malta · On-site</div>
      <ul>
        <li>Led visual identity and digital design across three consumer food brands, with strong visual design craft in UI, layout and typography. Promoted from Graphic Designer to Senior; Lead Designer on contract for Blok Foods (2022-2023).</li>
        <li>Built a multi-channel design system from the ground up for a multi-person creative team.</li>
      </ul>
    </div>
  </section>
  <section><h2>Education</h2>
    <div class="edu-row"><div><span class="degree">MA Visual &amp; Experience Design</span> <span class="school">· UE University of Applied Sciences, Berlin (consumer mobile app thesis)</span></div><div class="date">2025</div></div>
    <div class="edu-row"><div><span class="degree">BA Marketing &amp; Advertising</span> <span class="school">· Polit&eacute;cnico Grancolombiano, Bogot&aacute;</span></div><div class="date">2019</div></div>
  </section>
  <section><h2>Skills</h2>
    <div class="skill-row"><div class="label">UX / UI</div><div class="val">Complete Design Process (independent) · UX Concepts · UI Design · Reducing Complexity · Information Architecture · Accessibility</div></div>
    <div class="skill-row"><div class="label">Research</div><div class="val">User Tests with Real Users (plan, run, analyze) · Insights to Product Improvements · Usability Testing · Discovery</div></div>
    <div class="skill-row"><div class="label">Figma</div><div class="val">Components · Variants · Auto Layout · Design Tokens · Design Library · Design System Maintenance &amp; Growth · Usable for Engineering</div></div>
    <div class="skill-row"><div class="label">AI / Build</div><div class="val">AI as a Working Tool · Claude Code · Gemini · NotebookLM · HTML · CSS · JavaScript · Next.js · Buildable Handoff</div></div>
    <div class="skill-row"><div class="label">Brand</div><div class="val">Brand Identity · Marketing Assets · Website Design (concept to live) · Visual Craft (typography, layout) · 4 Years Multi-brand Experience</div></div>
    <div class="skill-row"><div class="label">Languages</div><div class="val">English (C1) · Spanish (Native) · German (A2)</div></div>
  </section>
</body></html>`;

const clStyle = `
  @page { size: A4; margin: 11mm 14mm; }
  * { box-sizing: border-box; }
  :root { --fg:#1a1a1a; --muted:#a3a3a0; --border:rgba(10,10,10,0.10); }
  html, body { font-family:"Geist",-apple-system,"Helvetica Neue",Arial,sans-serif; font-size:10pt; line-height:1.5; color:var(--fg); margin:0; }
  .display { font-family:"Outfit","Geist",sans-serif; font-weight:600; letter-spacing:-0.005em; line-height:1; }
  h1.name { font-size:18pt; margin:0 0 4px 0; }
  .contact-line { margin-top:3px; font-size:8.4pt; }
  .contact-line .dot { color:var(--muted); margin:0 5px; }
  .meta { margin:10px 0 18px; font-size:8.6pt; }
  .meta .row { display:flex; justify-content:space-between; align-items:baseline; }
  .to { margin-bottom:14px; font-size:9.4pt; } .to b { font-weight:500; }
  p { margin:0 0 11px 0; }
  .sign { margin-top:16px; } .sign b { font-weight:500; }
  .label { font-family:"Outfit",sans-serif; text-transform:uppercase; letter-spacing:0.09em; font-size:7pt; font-weight:500; color:var(--muted); }
`;
const clHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"/>${fontLinks}<style>${clStyle}</style></head><body>
  <h1 class="name display">Julian David Giraldo Rojas</h1>
  <p class="contact-line">application@juliang.de<span class="dot">·</span>+49 151 5884 4518<span class="dot">·</span>juliang.de<span class="dot">·</span>linkedin.com/in/julian-gr</p>
  <div class="meta"><div class="row"><span class="label">Application</span><span class="label">Product Designer (UX/UI) · nu:legal · Berlin/Potsdam</span></div></div>

  <div class="to"><b>Hi nu:legal team,</b></div>

  <p>Being the first and only designer in the room is not a risk I am taking with your role; it is the job I already do. At Duo I own the entire design area of a document-heavy operational platform, no art director, no structure above me: 13 modules, 40+ document types, 6 permission roles, used daily across 9 locations. Legal is new territory for me, but dense, bureaucratic, rule-bound workflows are the through-line of my whole career, and my specialty is exactly what you ask for: reducing complexity by making things understandable, not by leaving them out.</p>

  <p>I run the complete design process independently. I plan and run user tests with the real people who use the product, analyze them, and turn insights directly into shipped improvements; an onboarding redesign cut onboarding time by about 30%. I am a Figma pro in the specific sense you mean: components, variants, auto layout, design tokens, and a library engineering actually consumes. And I use AI to rethink process, not as decoration: I prototype with Claude Code and write frontend (Next.js), so what we test is a working product, not a static mock.</p>

  <p>Beyond product, I can carry the outside face too: I spent four years leading brand, marketing assets and websites for a multi-brand group in Malta, and I design and build my own site. Working directly with founders, defending decisions with reasons, and questioning workflows that deserve questioning is my preferred way of working.</p>

  <p>My portfolio is at juliang.de, real case studies with the process and UX decisions visible, no AI-generated filler. I would love to walk you through them. Berlin-based, ready for Potsdam days.</p>

  <div class="sign"><b>Julian</b><br/><span class="label">juliang.de · Berlin</span></div>
</body></html>`;

mkdirSync(DIR, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
async function pdf(html, out, title) {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  const buf = await page.pdf({ format: "A4", printBackground: true, margin: { top: "14mm", bottom: "14mm", left: "16mm", right: "16mm" } });
  await page.close();
  // Strip headless-browser fingerprints; set clean, human-authored metadata.
  const doc = await PDFDocument.load(buf);
  doc.setTitle(title);
  doc.setAuthor("Julian David Giraldo Rojas");
  doc.setSubject("");
  doc.setKeywords([]);
  doc.setCreator("Julian David Giraldo Rojas");
  doc.setProducer("Julian David Giraldo Rojas");
  doc.setCreationDate(new Date());
  doc.setModificationDate(new Date());
  writeFileSync(out, await doc.save());
  console.log("written:", out);
}
await pdf(cvHtml, `${DIR}/Julian_Giraldo_CV_ProductDesigner.pdf`, "Julian David Giraldo Rojas | CV");
await pdf(clHtml, `${DIR}/Julian_Giraldo_CoverLetter_nulegal_EN.pdf`, "Julian David Giraldo Rojas | Cover Letter");
await browser.close();
