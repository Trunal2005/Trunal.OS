import { chromium } from "playwright";
import fs from "node:fs/promises";
import { settled } from "./scene-helpers.mjs";
const dir = "docs/round3-evidence";
await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    page.on("pageerror", (e) => console.log(e.message));
    for (const route of [
      "",
      "skills",
      "experience",
      "about",
      "achievements",
      "opensource",
    ]) {
      await page.goto(`http://127.0.0.1:4173/?qa=1#${route}`, {
        waitUntil: "networkidle",
      });
      if (width > 900) await settled(page, route || null);
      await page.screenshot({
        path: `${dir}/phase-${width}-${route || "overview"}.png`,
      });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
