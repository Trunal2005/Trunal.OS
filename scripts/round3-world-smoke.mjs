import { chromium } from "playwright";
import assert from "node:assert/strict";
import { settled, actualPick, distance } from "./scene-helpers.mjs";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const url = new URL(process.env.TEST_URL || "http://127.0.0.1:4173/");
  url.searchParams.set("qa", "1");
  await page.goto(url.href);
  const home = await settled(page);
  for (const id of [
    "projects",
    "skills",
    "experience",
    "opensource",
    "about",
    "achievements",
    "contact",
  ]) {
    await page.getByRole("button", { name: "Reset world view" }).click();
    await settled(page);
    await actualPick(page, id);
    const focus = await settled(page, id);
    assert.ok(distance(home.camera, focus.camera) > 4);
    assert.equal(focus.activePath, id);
  }
  console.log("PASS seven physical district picks and camera flights");
} finally {
  await browser.close();
}
