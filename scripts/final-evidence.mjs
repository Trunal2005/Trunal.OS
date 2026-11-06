import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { settled } from "./scene-helpers.mjs";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const base = process.env.TEST_URL || "http://127.0.0.1:4173/";
const result = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(base + "?qa=1#opensource");
  await settled(page, "opensource");
  for (const state of ["open", "merged"]) {
    await page
      .getByRole("combobox", { name: "Contribution state" })
      .selectOption(state);
    await page.locator(".pr-group").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `docs/3d-rebuild-evidence/03-${state}-pr-details.png`,
    });
    result.push({ state, rows: await page.locator(".pr-row").count() });
  }
  for (const [width, height] of [
    [844, 390],
    [320, 568],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(base + "?qa=1");
    await settled(page);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    const nav = await page.locator(".destination-nav").boundingBox();
    assert.ok(nav.y >= 0 && nav.y + nav.height <= height);
    await page
      .getByRole("button", { name: "Explore Selected work", exact: true })
      .click();
    await settled(page, "work");
    const panel = await page.locator(".station-panel").boundingBox();
    assert.ok(panel.y >= 0 && panel.y + panel.height <= height);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    assert.equal(
      axe.violations.length,
      0,
      JSON.stringify(
        axe.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ),
    );
    await page.screenshot({
      path: `docs/3d-rebuild-evidence/extra-${width}x${height}.png`,
    });
    result.push({
      width,
      height,
      nav,
      panel,
      axeViolations: axe.violations.length,
    });
  }
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto(base + "?qa=1");
  await settled(page);
  await page.screenshot({ path: "public/og.png" });
  await fs.copyFile("public/og.png", "dist/og.png");
  await fs.writeFile(
    "docs/3d-rebuild-evidence/final-extra-results.json",
    JSON.stringify(result, null, 2),
  );
  console.log(result);
} finally {
  await browser.close();
}
