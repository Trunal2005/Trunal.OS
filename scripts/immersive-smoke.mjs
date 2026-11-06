import { chromium } from "playwright";
import assert from "node:assert/strict";
const base = process.env.TEST_URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base + "#journey", { waitUntil: "networkidle" });
  await page.locator('canvas[data-renderer="webgl"]').waitFor();
  assert.match(await page.locator("#station-title").innerText(), /Journey/);
  await page.getByRole("button", { name: "Reset world view" }).click();
  await page.getByRole("button", { name: "2D", exact: true }).click();
  await page
    .getByRole("button", { name: "Explore Selected work", exact: true })
    .click();
  await page.locator(".terminal-card").first().waitFor({ state: "visible" });
  assert.equal(await page.locator(".terminal-card").count(), 5);
  await page
    .getByRole("button", { name: "Read AI Revenue Recovery case study" })
    .click();
  await page.locator("dialog").waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "hidden" });
  for (const file of ["og.png", "favicon.svg", "robots.txt"])
    assert.equal(
      (await page.request.get(new URL(file, base).href)).status(),
      200,
    );
  console.log(
    "PASS: subpath assets, 3D journey deep link, 2D work, project dialog and Escape.",
  );
} finally {
  await browser.close();
}
