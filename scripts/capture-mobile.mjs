import { chromium } from "playwright";
import { settled } from "./scene-helpers.mjs";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  for (const [width, height] of [
    [768, 1024],
    [390, 844],
    [320, 780],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto("http://127.0.0.1:5173/?qa=1", {
      waitUntil: "networkidle",
    });
    await settled(page);
    await page.screenshot({
      path: `docs/3d-rebuild-evidence/phase-4-${width}.png`,
    });
    console.log(
      width,
      await page
        .locator(".station-label")
        .evaluateAll((es) =>
          es.map((e) => ({
            id: e.dataset.worldLabel,
            left: e.getBoundingClientRect().left,
            right: e.getBoundingClientRect().right,
          })),
        ),
    );
    await page.close();
  }
} finally {
  await browser.close();
}
