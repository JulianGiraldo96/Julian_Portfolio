// Generate Julian's Aceve application: tailored CV + cover letter PDFs.
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { PDFDocument } from "pdf-lib";

const DIR = "/Users/elputoamo/Library/CloudStorage/Dropbox/Documents/Personal Julian/Personal/2026/Aplications/1-Product_Designer/59-Aceve";

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
    <p class="summary">Product Designer with 4 years in product design and 7+ years in design overall, specialized in digital tools for the people who run our physical world. I plan and execute user research, analyze data and present insights to stakeholders; I develop wireframes, interactive prototypes and high-fidelity designs to validate concepts with real user feedback; and I contribute to design systems that keep products consistent, scalable and usable for engineering. I know HTML, CSS and front-end principles first-hand because I write frontend (Next.js), and I work AI-first by habit: AI tools are part of how I research, prototype and ship. I facilitate workshops, mentor colleagues, and present and justify design decisions clearly. Based in Berlin.</p></p>
  </section>
  <section><h2>Experience</h2>
    <div class="job">
      <div class="job-head"><div class="job-title">Product Designer <span class="at">· Duo Sicilian Ice Cream</span></div><div class="job-date">Oct 2024 - Present</div></div>
      <div class="job-loc">Berlin, Germany · On-site</div>
      <ul>
        <li>Design the digital tools a physical-world business runs on: a platform with 13 modules, 40+ document types and 6 permission roles, used daily across 9 locations by production, logistics and delivery staff, giving busy non-technical operators back their time, clarity and confidence.</li>
        <li>Plan and execute research with real end users, analyze usage data and present insights to stakeholders; an onboarding redesign driven by those insights cut onboarding time by ~30%.</li>
        <li>Develop wireframes, interactive prototypes and high-fidelity designs to validate concepts before engineering commits; optimize user flows and interactions continuously.</li>
        <li>Contribute to and maintain the design system (components, patterns, design tokens), ensuring consistency, scalability and UI/UX best practices; document decisions and guidelines for internal teams.</li>
        <li>Work AI-first: prototype with Claude Code and write frontend (Next.js), so validation happens on working products; share UX best practices and mentor cross-functional colleagues.</li>
      </ul>
    </div>
    <div class="job">
      <div class="job-head"><div class="job-title">Product Designer <span class="at">· TaurusWebs (Freelance)</span></div><div class="job-date">Feb 2019 - Present</div></div>
      <div class="job-loc">Bogot&aacute;, Colombia · Remote · User Experience Designer (2019-2022) &rarr; Junior Product Designer (2022-2024) &rarr; Product Designer (2024-Present)</div>
      <ul>
        <li>Design B2B platforms and web and mobile apps end to end for clients across Latin America and the USA, aligning design solutions with user needs, technical feasibility and business objectives in Agile, cross-functional teams.</li>
        <li>Built digital tooling for another hands-on trade: redesigned bulk operations on a livestock management platform, cutting a 6-hour setup workflow to under 1 hour (~83% less effort) for farm operators.</li>
        <li>Facilitate design workshops and present and defend design decisions directly with founders and stakeholders.</li>
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
    <div class="skill-row"><div class="label">UX</div><div class="val">UX Design Principles · Product Design Methodologies · Interaction Design · Information Architecture · Accessibility Standards · User-friendly, Intuitive Interfaces</div></div>
    <div class="skill-row"><div class="label">Research</div><div class="val">User Research (plan, execute, analyze) · Usability Testing · User Psychology · Insights to Stakeholders · Data-informed Decisions</div></div>
    <div class="skill-row"><div class="label">Systems</div><div class="val">Design Systems · Consistency &amp; Scalability · Components · Patterns · Design Tokens · UX Documentation &amp; Guidelines</div></div>
    <div class="skill-row"><div class="label">Build / AI</div><div class="val">HTML · CSS · JavaScript · Next.js · Front-end Principles · AI-first Workflow · Claude Code · Gemini · NotebookLM · Figma · FigJam</div></div>
    <div class="skill-row"><div class="label">Collab</div><div class="val">Agile Cross-functional Teams (PM, Dev, Business) · Workshop Facilitation · Mentoring · Presenting &amp; Justifying Design Decisions · UX Advocacy</div></div>
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
  <div class="meta"><div class="row"><span class="label">Application</span><span class="label">UX Designer / Product Designer · Aceve · Berlin</span></div></div>

  <div class="to"><b>Hi Aceve team,</b></div>

  <p>You build digital tools for the people who construct and maintain our physical world. So do I. At Duo, a food production and retail business running 9 locations in Berlin, I design the platform that production staff, logistics drivers and shift managers depend on every day: 13 modules, 40+ document types, 6 permission roles. My users wear aprons and safety shoes, not headsets. Giving busy, non-technical operators back their time, clarity and confidence is not your mission statement to me; it is my job description.</p>

  <p>I am a Product Designer with 4 years in product design and 7+ years in design overall. I plan and run research with real end users and turn insights into shipped improvements; an onboarding redesign cut onboarding time by about 30%. I contribute to and maintain design systems that stay usable for engineering, I facilitate workshops and mentor colleagues, and I document my decisions as I go. Your "plus" is one of my strongest cards: I do not just know HTML and CSS principles, I write production frontend (Next.js). And since Aceve is AI-first: so am I. I prototype with Claude Code daily, so concepts get validated on working products, not static mocks.</p>

  <p>Now the honest part, since you invite people who do not tick every box: my German is A2 and actively improving, not C1. I work and present fluently in English, and my daily users at Duo are a multilingual, non-technical team, so designing across language barriers is familiar territory. If spoken German is a hard gate, I understand. But if potential and drive count the way your posting says, I believe the rest of this profile is exactly what you are looking for.</p>

  <p>I am Berlin-based, so your Heinrich-Heine-Platz office and three office days suit me well. My portfolio is at juliang.de. I would love to talk.</p>

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
await pdf(clHtml, `${DIR}/Julian_Giraldo_CoverLetter_Aceve_EN.pdf`, "Julian David Giraldo Rojas | Cover Letter");
await browser.close();
