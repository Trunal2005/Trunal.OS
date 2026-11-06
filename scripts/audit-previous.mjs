import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const report = [];
for (const [width, height] of [
  [1440, 900],
  [390, 844],
  [768, 1024],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [],
    requests = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => requests.push(r.url()));
  try {
    const response = await page.goto(
      "https://portfolio-lyart-eight-70.vercel.app/",
      { waitUntil: "networkidle", timeout: 45000 },
    );
    await page.screenshot({
      path: `docs/evidence/previous-${width}.png`,
      fullPage: true,
    });
    report.push({
      width,
      height,
      status: response.status(),
      url: page.url(),
      text: await page.locator("body").innerText(),
      links: await page
        .locator("a")
        .evaluateAll((as) =>
          as.map((a) => ({ text: a.innerText, url: a.href })),
        ),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      errors,
      requests,
    });
  } catch (e) {
    report.push({ width, height, error: e.message, errors, requests });
  }
  await page.close();
}
await fs.writeFile(
  "docs/evidence/previous-audit.json",
  JSON.stringify(report, null, 2),
);
console.log(
  report.map(({ width, status, error, errors, overflow }) => ({
    width,
    status,
    error,
    errors,
    overflow,
  })),
);
await browser.close();
