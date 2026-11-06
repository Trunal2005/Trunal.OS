import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const report = {};
try {
  await page.goto("https://merodev.net/", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page
    .getByRole("button", { name: "Enter", exact: true })
    .click({ timeout: 15000 });
  await page.waitForTimeout(7000);
  await page.screenshot({
    path: "docs/3d-rebuild-evidence/reference-entered.png",
  });
  report.text = await page.locator("body").innerText();
  report.buttons = await page.getByRole("button").allTextContents();
  await page.mouse.move(650, 450);
  await page.mouse.down();
  await page.mouse.move(790, 450, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: "docs/3d-rebuild-evidence/reference-drag.png",
  });
} catch (e) {
  report.error = e.message;
}
await fs.writeFile(
  "docs/3d-rebuild-evidence/reference-observations.json",
  JSON.stringify(report, null, 2),
);
console.log(report);
await browser.close();
