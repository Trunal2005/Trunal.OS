import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto(process.env.TEST_URL || "http://127.0.0.1:5173/?qa=1", {
  waitUntil: "networkidle",
});
await page.waitForFunction(
  () => window.__TRUNAL_SCENE__?.flight === "settled",
  {},
  { timeout: 30000 },
);
await page.waitForTimeout(500);
await page.screenshot({
  path: `docs/3d-rebuild-evidence/${process.env.PHASE || "phase-1"}-overview.png`,
});
console.log({
  errors,
  scene: await page.evaluate(() => window.__TRUNAL_SCENE__),
});
await fs.writeFile(
  "docs/3d-rebuild-evidence/phase-errors.json",
  JSON.stringify(errors),
);
await browser.close();
