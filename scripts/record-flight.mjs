import { chromium } from "playwright";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { settled, actualPick } from "./scene-helpers.mjs";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await page.goto("http://127.0.0.1:4173/?qa=1");
  await settled(page);
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", (event) => {
    frames.push({ data: event.data, time: event.metadata.timestamp });
    void cdp.send("Page.screencastFrameAck", { sessionId: event.sessionId });
  });
  await page.evaluate(() => {
    window.__flightSamples = [];
    window.__sampler = setInterval(() => {
      const s = window.__TRUNAL_SCENE__;
      if (s)
        window.__flightSamples.push({
          t: performance.now(),
          camera: s.camera,
          target: s.target,
          flight: s.flight,
        });
    }, 20);
  });
  await cdp.send("Page.startScreencast", {
    format: "jpeg",
    quality: 80,
    maxWidth: 1440,
    maxHeight: 900,
    everyNthFrame: 1,
  });
  await actualPick(page, "work");
  await settled(page, "work");
  await page.waitForTimeout(100);
  await cdp.send("Page.stopScreencast");
  const samples = await page.evaluate(() => {
    clearInterval(window.__sampler);
    return window.__flightSamples;
  });
  const seen = new Set();
  const saved = [];
  for (const frame of frames) {
    const bytes = Buffer.from(frame.data, "base64");
    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    if (seen.has(hash)) continue;
    seen.add(hash);
    const path = `docs/3d-rebuild-evidence/sequence/flight-${String(saved.length).padStart(3, "0")}.jpg`;
    await fs.writeFile(path, bytes);
    saved.push({ path, timestamp: frame.time, sha256: hash });
  }
  const steps = [];
  async function step(name) {
    await page.screenshot({
      path: `docs/3d-rebuild-evidence/sequence/${name}.png`,
    });
    steps.push({
      name,
      at: new Date().toISOString(),
      camera: await page.evaluate(() => window.__TRUNAL_SCENE__.camera),
      target: await page.evaluate(() => window.__TRUNAL_SCENE__.target),
    });
  }
  await actualPick(page, "project-bi");
  await page.locator("dialog").waitFor({ state: "visible" });
  await page.waitForFunction(
    () =>
      window.__TRUNAL_SCENE__.flight === "settled" &&
      window.__TRUNAL_SCENE__.target[0] < -7,
  );
  await step("008-case-open");
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "hidden" });
  await settled(page, "work");
  await step("009-case-closed");
  await page.getByRole("button", { name: "Reset world view" }).click();
  await settled(page);
  await step("010-reset-overview");
  await actualPick(page, "opensource");
  await settled(page, "opensource");
  for (const state of ["merged", "open"]) {
    await page
      .getByRole("combobox", { name: "Contribution state" })
      .selectOption(state);
    await page.locator(".pr-group").scrollIntoViewIfNeeded();
    await step(`011-${state}-contributions`);
  }
  await fs.writeFile(
    "docs/3d-rebuild-evidence/flight-recording.json",
    JSON.stringify({ frames: saved, samples, steps }, null, 2),
  );
  assert.ok(saved.length >= 3, "Insufficient actual compositor frames");
  assert.ok(
    samples.some((s) => s.flight === "moving"),
    "No intermediate camera state recorded",
  );
  console.log({
    compositorFrames: saved.length,
    movingSamples: samples.filter((s) => s.flight === "moving").length,
  });
} finally {
  await browser.close();
}
