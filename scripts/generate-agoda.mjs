// Generate Julian's Agoda application: tailored CV + cover letter PDFs.
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { PDFDocument } from "pdf-lib";

const DIR = "/Users/elputoamo/Library/CloudStorage/Dropbox/Documents/Personal Julian/Personal/2026/Aplications/1-Product_Designer/54-Agoda";

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
    <p class="summary">Product Designer with 4 years in product design and 7+ years in design overall, crafting user-centered products across consumer and B2B surfaces. I run discovery phases, help define product requirements with PMs and engineers, and test prototypes and hypotheses with real users, translating quantitative and qualitative insights into design decisions. I think and craft at a system level: I build design systems that keep a growing family of products cohesive and consistent. I am AI-native and write frontend (Next.js), so my prototypes are real and my handoff is buildable. Colombian, based in Berlin after living and working across three continents: I design for people whose needs, behaviors and expectations differ by region. Curious, optimistic, and comfortable with ambiguity.</p>
  </section>
  <section><h2>Experience</h2>
    <div class="job">
      <div class="job-head"><div class="job-title">Product Designer <span class="at">· Duo Sicilian Ice Cream</span></div><div class="job-date">Oct 2024 - Present</div></div>
      <div class="job-loc">Berlin, Germany · On-site</div>
      <ul>
        <li>Own product design end to end on a complex operational platform (13 modules, 40+ document types, 6 permission roles): discovery, requirements definition, sophisticated flows and customer journeys, high-fidelity UI, used daily across 9 locations.</li>
        <li>Test prototypes and hypotheses with real users; translate qualitative feedback and usage data into design decisions. Redesigned onboarding end to end, cutting onboarding time by ~30%.</li>
        <li>Champion cohesion and consistency: built and maintain the design system (components, patterns, design tokens) that unites a growing family of modules and features.</li>
        <li>Present work to peers and leadership, run design critiques with engineers, and write up process and decisions as I go.</li>
        <li>Design AI-powered UX and Copilot-style features; I write frontend (Next.js), so prototypes are real and handoff is buildable.</li>
      </ul>
    </div>
    <div class="job">
      <div class="job-head"><div class="job-title">Product Designer <span class="at">· TaurusWebs (Freelance)</span></div><div class="job-date">Feb 2019 - Present</div></div>
      <div class="job-loc">Bogot&aacute;, Colombia · Remote · User Experience Designer (2019-2022) &rarr; Junior Product Designer (2022-2024) &rarr; Product Designer (2024-Present)</div>
      <ul>
        <li>Design consumer-facing web and mobile apps and B2B platforms end to end for clients across Latin America and the USA: discovery and ideation workshops, customer journeys, high-fidelity UI, interactive prototypes.</li>
        <li>Craft at a system level: redesigned the bulk operations of a livestock management platform, cutting a 6-hour setup workflow to under 1 hour (~83% less effort, under 1 minute per record).</li>
        <li>Balance multiple client priorities and deliver in fast-paced, dynamic environments, aligning stakeholders around a shared vision and approach.</li>
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
    <div class="skill-row"><div class="label">Design</div><div class="val">User-centered Design · Interaction Design · Sophisticated Flows &amp; Customer Journeys · Visual Design · Accessibility · Intuitive, Seamless Functionality</div></div>
    <div class="skill-row"><div class="label">Research</div><div class="val">Discovery Phases · Prototype &amp; Hypothesis Testing with Users · Usability Testing · Quantitative &amp; Qualitative Insights · Data-informed Decisions</div></div>
    <div class="skill-row"><div class="label">Systems</div><div class="val">Design Systems · Cohesion &amp; Consistency across a Family of Products · Components · Patterns · Design Tokens</div></div>
    <div class="skill-row"><div class="label">AI / Build</div><div class="val">AI-powered UX · Claude Code · Gemini · NotebookLM · HTML · CSS · JavaScript · Next.js · Figma · FigJam</div></div>
    <div class="skill-row"><div class="label">Collab</div><div class="val">Design Critiques · Workshops · Presenting to Peers &amp; Leadership (async and in-person) · Cross-functional Squads (PM, Eng) · Feedback with Kindness &amp; Candor</div></div>
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
  <div class="meta"><div class="row"><span class="label">Application</span><span class="label">Product Designer · Agoda Design Team · Bangkok</span></div></div>

  <div class="to"><b>Hi Agoda Design Team,</b></div>

  <p>Your purpose is bridging the world through travel. My whole career has been a version of that journey: I am Colombian, I built my design foundations in Bogot&aacute;, grew as a designer in Malta, and now design products in Berlin. I have been the traveler landing somewhere new and depending on good tools to figure things out, which is exactly the customer Agoda serves. So this role reads personal to me, not just professional.</p>

  <p>I am a Product Designer with 4 years in product design and 7+ years in design overall. At Duo I own product design end to end on an operational platform with 13 modules and 6 permission roles used daily across 9 locations: I run discovery, define requirements with stakeholders, test prototypes and hypotheses with the real people who use it, and champion the design system that keeps a growing family of features cohesive and consistent. Redesigning its onboarding cut onboarding time by about 30%. At TaurusWebs I design consumer-facing web and mobile apps for clients across Latin America and the USA, so designing for different regions, behaviors and expectations is familiar ground. And because I write frontend (Next.js) and work AI-native, my prototypes are real, testable products rather than pictures of ideas.</p>

  <p>I have not worked at an online travel agency yet. What I bring instead is the customer side of travel lived across three continents, strong visual design craft (my background spans brand and visual identity work for consumer brands), and a habit of translating quantitative and qualitative insights into decisions I can defend in a critique. Data-driven is not a buzzword to me; it is how I justify every design choice.</p>

  <p>The idea of joining a scrappy, hands-on team in Bangkok that still shapes product strategy genuinely excites me. One more city, one more culture to learn from: that is the pattern of my life so far. My portfolio is at juliang.de. I would love to talk.</p>

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
await pdf(clHtml, `${DIR}/Julian_Giraldo_CoverLetter_Agoda_EN.pdf`, "Julian David Giraldo Rojas | Cover Letter");
await browser.close();
