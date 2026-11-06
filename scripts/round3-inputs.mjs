import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const reports = [];
try {
  for (const [label, url] of [
    ["old-portfolio", "https://portfolio-lyart-eight-70.vercel.app/"],
    ["reference", "https://merodev.net/"],
    [
      "article",
      "https://tympanus.net/codrops/2025/01/21/the-journey-of-creating-a-3d-portfolio/",
    ],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    try {
      const r = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await page.waitForTimeout(1500);
      if (label === "old-portfolio") {
        for (let y = 0; y < 6000; y += 700) {
          await page.evaluate((y) => scrollTo(0, y), y);
          await page.waitForTimeout(150);
        }
        await page.evaluate(() => scrollTo(0, 0));
      }
      await page.screenshot({
        path: `docs/round3-evidence/input-${label}.png`,
        fullPage: label === "old-portfolio",
      });
      reports.push({
        label,
        status: r.status(),
        text: (await page.locator("body").innerText()).slice(0, 18000),
        links: await page
          .locator("a[href]")
          .evaluateAll((as) =>
            as
              .map((a) => ({ text: a.textContent?.trim(), url: a.href }))
              .filter((a) => a.text),
          ),
      });
    } catch (e) {
      reports.push({ label, error: e.message });
    }
    await page.close();
  }
  await fs.writeFile(
    "docs/round3-evidence/input-research.json",
    JSON.stringify(reports, null, 2),
  );
  console.log(
    reports.map((r) => ({
      label: r.label,
      status: r.status,
      error: r.error,
      text: r.text?.slice(0, 150),
    })),
  );
} finally {
  await browser.close();
}
