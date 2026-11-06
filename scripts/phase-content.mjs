import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { settled, actualPick, distance } from "./scene-helpers.mjs";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const report = [];
try {
  await page.goto("http://127.0.0.1:5173/?qa=1", { waitUntil: "networkidle" });
  await settled(page);
  await actualPick(page, "work");
  const work = await settled(page, "work");
  await page
    .getByRole("button", { name: "Read AI Revenue Recovery case study" })
    .click();
  await page.locator("dialog").waitFor({ state: "visible" });
  await page.waitForFunction((before) => {
    const s = window.__TRUNAL_SCENE__;
    return (
      s.flight === "settled" &&
      Math.hypot(...s.target.map((v, i) => v - before[i])) > 0.5
    );
  }, work.target);
  const detail = await page.evaluate(() => window.__TRUNAL_SCENE__);
  assert.ok(distance(detail.target, work.target) > 0.5);
  await page.screenshot({
    path: "docs/3d-rebuild-evidence/phase-3-project-detail.png",
  });
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "hidden" });
  await settled(page, "work");
  const blue = page.locator(".future-bay");
  await blue.scrollIntoViewIfNeeded();
  assert.equal(await blue.locator("a,button,img").count(), 0);
  await page.screenshot({
    path: "docs/3d-rebuild-evidence/phase-3-blue-cred.png",
  });
  report.push({
    projectCamera: detail.camera,
    projectTarget: detail.target,
    scrollY: await page.evaluate(() => scrollY),
  });
  await page
    .getByRole("button", { name: "Explore Journey", exact: true })
    .click();
  await settled(page, "journey");
  const before = await page.evaluate(() => window.__TRUNAL_SCENE__.target);
  await page.getByRole("button", { name: /Learning the foundations/ }).click();
  await page.waitForFunction(
    () =>
      window.__TRUNAL_SCENE__.flight === "settled" &&
      window.__TRUNAL_SCENE__.target[0] < 0,
  );
  const after = await page.evaluate(() => window.__TRUNAL_SCENE__.target);
  assert.ok(distance(before, after) > 1);
  await page.screenshot({
    path: "docs/3d-rebuild-evidence/phase-3-milestone.png",
  });
  report.push({ milestoneBefore: before, milestoneAfter: after });
  for (const [width, height] of [
    [1280, 800],
    [768, 1024],
    [390, 844],
    [320, 780],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("http://127.0.0.1:5173/?qa=1");
    await settled(page);
    await page.screenshot({
      path: `docs/3d-rebuild-evidence/phase-3-${width}.png`,
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    report.push({ width, scrollY: await page.evaluate(() => scrollY) });
  }
  console.log(report);
  await fs.writeFile(
    "docs/3d-rebuild-evidence/phase-3-content.json",
    JSON.stringify(report, null, 2),
  );
} finally {
  await browser.close();
}
