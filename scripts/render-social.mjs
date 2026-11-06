import { chromium } from "playwright";
import fs from "node:fs/promises";
import { settled } from "./scene-helpers.mjs";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.goto((process.env.TEST_URL || "http://127.0.0.1:4173/") + "?qa=1");
  await settled(page);
  await page.screenshot({ path: "public/og.png" });
  try {
    await fs.copyFile("public/og.png", "dist/og.png");
  } catch {
    /* A later static build also copies the public asset. */
  }
} finally {
  await browser.close();
}
