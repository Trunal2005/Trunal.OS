import { chromium } from "playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { settled, actualPick, distance } from "./scene-helpers.mjs";
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
try {
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:5173/?qa=1", {
    waitUntil: "networkidle",
  });
  const overview = await settled(page);
  await page.screenshot({
    path: "docs/3d-rebuild-evidence/phase-2-overview.png",
  });
  const checks = [];
  for (const id of [
    "work",
    "ai",
    "networks",
    "opensource",
    "journey",
    "contact",
  ]) {
    await page.getByRole("button", { name: "Reset world view" }).click();
    await settled(page);
    const point = await actualPick(page, id);
    const result = await settled(page, id);
    assert.ok(distance(result.camera, overview.camera) > 4);
    assert.ok(distance(result.target, overview.target) > 4);
    assert.ok(distance(result.orientation, overview.orientation) > 0.01);
    assert.equal(result.activePath, id);
    assert.equal(result.picks.at(-1).type, "Mesh");
    await page.screenshot({
      path: `docs/3d-rebuild-evidence/phase-2-${id}.png`,
    });
    checks.push({
      id,
      point,
      camera: result.camera,
      target: result.target,
      orientation: result.orientation,
      pick: result.picks.at(-1),
      geometry: result.geometries[id],
    });
  }
  await fs.writeFile(
    "docs/3d-rebuild-evidence/phase-2-interactions.json",
    JSON.stringify({ overview, checks, errors }, null, 2),
  );
  console.log({ passed: checks.map((c) => c.id), errors });
  assert.equal(errors.length, 0, errors.join("\n"));
} finally {
  await browser.close();
}
