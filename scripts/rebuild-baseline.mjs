import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const report = [];
for (const [width, height] of [
  [1440, 900],
  [1280, 800],
  [390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  report.push({
    width,
    initial3d: await page
      .getByRole("button", { name: "3D", exact: true })
      .getAttribute("aria-pressed"),
    reducedMotion: await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    storage: await page.evaluate(() => ({ ...localStorage })),
  });
  for (const mode of ["3D", "2D"]) {
    await page.getByRole("button", { name: mode, exact: true }).click();
    await page.waitForTimeout(1600);
    await page.screenshot({
      path: `docs/3d-rebuild-evidence/before-${width}-${mode}.png`,
    });
  }
  await page.close();
}
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  const res = await page.goto("https://merodev.net/", {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page.waitForTimeout(6000);
  await page.screenshot({
    path: "docs/3d-rebuild-evidence/reference-first-view.png",
  });
  report.push({
    reference: res.status(),
    text: await page.locator("body").innerText(),
    buttons: await page.getByRole("button").allTextContents(),
    errors,
  });
} catch (e) {
  report.push({ referenceError: e.message });
}
await fs.writeFile(
  "docs/3d-rebuild-evidence/baseline.json",
  JSON.stringify(report, null, 2),
);
console.log(report);
await browser.close();
