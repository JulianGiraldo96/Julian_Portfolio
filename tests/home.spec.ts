import { test, expect } from "@playwright/test";

/* Requires the preview server running first: ./scripts/preview.sh */

test("home loads and the hero renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("calm");
});

test("case study nav from the ledger works", async ({ page }) => {
  await page.goto("/");
  const ledger = page.getByRole("navigation", { name: "Case studies index" });
  await ledger.getByRole("link", { name: /ERP DUO/i }).click();
  await expect(page).toHaveURL(/\/work\/erp-duo/);
});
