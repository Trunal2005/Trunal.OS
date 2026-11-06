import { chromium } from "playwright";
import fs from "node:fs/promises";
import { settled } from "./scene-helpers.mjs";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const frames = [];
async function capture(page, name) {
  await page.screenshot({ path: `docs/round3-evidence/final-${name}.png` });
  frames.push({ name, at: new Date().toISOString(), route: page.url() });
}
try {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  for (const id of ["frontend", "backend", "ai", "data"]) {
    await desktop.goto(`http://127.0.0.1:4173/?qa=1#skills/${id}`);
    await settled(desktop, "skills");
    await desktop.locator(".skill-index").scrollIntoViewIfNeeded();
    await desktop.mouse.move(1300, 80);
    await capture(desktop, `skill-${id}-evidence`);
  }
  await desktop.close();
  for (const width of [390, 320, 844]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 844 ? 390 : width === 320 ? 780 : 844 },
    });
    for (const route of ["", "skills", "experience"]) {
      await page.goto(`http://127.0.0.1:4173/#${route}`, {
        waitUntil: "networkidle",
      });
      await capture(page, `mobile-${width}-${route || "home"}-viewport`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  await fs.writeFile(
    "docs/round3-evidence/delivery-captures.json",
    JSON.stringify(frames, null, 2),
  );
}
