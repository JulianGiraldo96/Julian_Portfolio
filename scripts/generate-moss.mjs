// Generate Julian's Moss application (Staff Brand Designer): tailored CV + cover letter PDFs.
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { PDFDocument } from "pdf-lib";

const DIR = "/Users/elputoamo/Library/CloudStorage/Dropbox/Documents/Personal Julian/Personal/2026/Aplications/1-Product_Designer/61-Moss";

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
    <p class="role-line">Brand &amp; Product Designer · Berlin, DE</p>
    <p class="contact-line">application@juliang.de<span class="dot">·</span>+49 151 5884 4518<span class="dot">·</span>juliang.de<span class="dot">·</span>linkedin.com/in/julian-gr<span class="dot">·</span>behance.net/JulianGR</p>
  </div>
  <section><h2>Summary</h2>
    <p class="summary">Designer with 7+ years across brand and product, grounded in a BA in Marketing &amp; Advertising and an MA in Visual &amp; Experience Design. My craft foundation is brand-first: four years leading visual identity, campaigns, motion and multi-channel content for three consumer brands, holding typography, composition and consistency to a high bar across a multi-person creative team. Today I combine that with product design and a deep Figma practice: architecting and governing design systems (auto layout, components, tokens, governance) as strategic assets. I am AI-native in the specific sense Moss means: I build AI workflows others adopt, from prompt practices to coded prototypes (Claude Code, Next.js), and I know when AI multiplies and when human judgment must lead. Fast, precise, high ownership. Based in Berlin.</p></p>
  </section>
  <section><h2>Experience</h2>
    <div class="job">
      <div class="job-head"><div class="job-title">Product Designer <span class="at">· Duo Sicilian Ice Cream</span></div><div class="job-date">Oct 2024 - Present</div></div>
      <div class="job-loc">Berlin, Germany · On-site</div>
      <ul>
        <li>Own design end to end on a complex fintech-adjacent platform (13 modules, 40+ document types) used daily across 9 locations, where craft and speed coexist by necessity.</li>
        <li>Architect and govern the design system in Figma as a strategic asset: components, auto layout, design tokens, and the adoption decisions that keep a growing surface consistent.</li>
        <li>Built AI workflows the team actually adopted: research synthesis (NotebookLM), ideation (Gemini) and coded prototyping (Claude Code + Next.js), turning AI from a siloed trick into shared practice.</li>
        <li>Hold the craft standard across the product: typography, layout and composition treated as core work, not afterthought; review and elevate work across cross-functional peers.</li>
      </ul>
    </div>
    <div class="job">
      <div class="job-head"><div class="job-title">Product Designer <span class="at">· TaurusWebs (Freelance)</span></div><div class="job-date">Feb 2019 - Present</div></div>
      <div class="job-loc">Bogot&aacute;, Colombia · Remote · User Experience Designer (2019-2022) &rarr; Junior Product Designer (2022-2024) &rarr; Product Designer (2024-Present)</div>
      <ul>
        <li>Lead brand identity, web design and creative direction for client work spanning Latin America and the USA, from concept-driven creative platforms to shipped digital products.</li>
        <li>Present and defend creative direction directly with founders and stakeholders, bringing them along with clear rationale.</li>
      </ul>
    </div>
    <div class="job">
      <div class="job-head"><div class="job-title">Senior Graphic Designer / Lead Designer <span class="at">· Greens Group</span></div><div class="job-date">Aug 2019 - Nov 2023</div></div>
      <div class="job-loc">Greens Supermarket · Fresh To Go · Blok Foods · Swieqi, Malta · On-site</div>
      <ul>
        <li>Led visual identity and creative output across three consumer brands: 360&deg; campaigns, social content, packaging, photography, video, motion and animation, holding a consistently high craft bar. Promoted Graphic Designer to Senior; Lead Designer on contract for Blok Foods (2022-2023).</li>
        <li>Built the multi-channel design system and quality guidelines from the ground up, reviewing and elevating work across a multi-person creative team running parallel campaigns: shared ownership of the craft standard in practice.</li>
        <li>Developed concept-driven creative platforms that unified storytelling across touchpoints, from in-store to digital.</li>
      </ul>
    </div>
  </section>
  <section><h2>Education</h2>
    <div class="edu-row"><div><span class="degree">MA Visual &amp; Experience Design</span> <span class="school">· UE University of Applied Sciences, Berlin (consumer mobile app thesis)</span></div><div class="date">2025</div></div>
    <div class="edu-row"><div><span class="degree">BA Marketing &amp; Advertising</span> <span class="school">· Polit&eacute;cnico Grancolombiano, Bogot&aacute;</span></div><div class="date">2019</div></div>
  </section>
  <section><h2>Skills</h2>
    <div class="skill-row"><div class="label">Brand</div><div class="val">Creative Direction · Concept-driven Creative Platforms · 360&deg; Campaigns · Social Content · Storytelling across Touchpoints · Brand Systems</div></div>
    <div class="skill-row"><div class="label">Craft</div><div class="val">Typography · Composition · Layout · Digital Design · Motion &amp; Animation (video, brand content) · Detail Obsession</div></div>
    <div class="skill-row"><div class="label">Figma</div><div class="val">Design System Architecture &amp; Governance · Auto Layout · Components · Design Tokens · Scalability &amp; Adoption Decisions</div></div>
    <div class="skill-row"><div class="label">AI</div><div class="val">AI-native Workflows Others Adopt · Claude Code · Gemini · NotebookLM · Coded Prototypes (Next.js, HTML, CSS, JS) · Judgment on Value vs Hype</div></div>
    <div class="skill-row"><div class="label">Collab</div><div class="val">Senior Creative Voice with Marketing, Product &amp; External Partners · Reviewing &amp; Elevating Team Work · Mentoring · Clear Rationale · Multiple Projects under Tight Timelines</div></div>
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
  <div class="meta"><div class="row"><span class="label">Application</span><span class="label">Staff Brand Designer (f/m/d) · Moss · Berlin</span></div></div>

  <div class="to"><b>Hi Moss team,</b></div>

  <p>Straight up: my title history says Senior, not Staff. If that line is a hard filter, I will save you time. But your posting describes a rare combination, brand craft plus design-system governance plus genuinely AI-native practice, and that intersection is exactly where I live, so I am introducing myself anyway.</p>

  <p>My foundation is brand: a BA in Marketing &amp; Advertising and four years leading visual identity for three consumer brands in Malta, 360&deg; campaigns, social content, packaging, video and motion, while building the design system and quality guidelines that kept a multi-person creative team consistent across parallel campaigns. Reviewing and elevating other people's work was the daily job. Typography, composition and layout are not afterthoughts to me; they are the work.</p>

  <p>Since then I have added what most brand designers lack: product depth and real AI practice. I architect and govern design systems in Figma (auto layout, components, tokens, adoption decisions) on a platform used daily across 9 locations. And on AI I have a concrete point of view: it multiplies ideation, research and production, and it fails where judgment lives. I build workflows others adopt, from research synthesis in NotebookLM to coded prototypes with Claude Code and Next.js, so "high-converting and on-brand" gets tested on working things, not debated in the abstract.</p>

  <p>Honest gaps beyond the title: my motion work comes from brand content and video, not years of After Effects, Jitter or Rive pipelines; I would set direction with the team while deepening that toolset. Moss is a brand I would enjoy raising the bar for, finance is dense material and dense material is my specialty. Berlin-based, portfolio at juliang.de. I would love to talk.</p>

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
await pdf(cvHtml, `${DIR}/Julian_Giraldo_CV_BrandDesigner.pdf`, "Julian David Giraldo Rojas | CV");
await pdf(clHtml, `${DIR}/Julian_Giraldo_CoverLetter_Moss_EN.pdf`, "Julian David Giraldo Rojas | Cover Letter");
await browser.close();
