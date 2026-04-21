import { chromium } from "playwright";

const URL = "https://fair-office-758527.framer.app";
const out = "/tmp/framer_snaps";
import { mkdirSync } from "fs";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2000);

// Full page
await page.screenshot({ path: `${out}/full.png`, fullPage: true });

// Hero
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/hero.png` });

// Scroll through
const steps = 6;
const total = await page.evaluate(() => document.body.scrollHeight);
for (let i = 1; i <= steps; i++) {
  const y = Math.round((total - 900) * (i / steps));
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/scroll_${i}.png` });
}

await browser.close();
console.log("done:", out);
