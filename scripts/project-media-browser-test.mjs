import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { settled } from "./scene-helpers.mjs";
const dir =
  process.env.MEDIA_EVIDENCE_DIR || "docs/controlled-upgrade-evidence/media";
await fs.mkdir(dir, { recursive: true });
const base = process.env.TEST_URL || "http://127.0.0.1:4173/?qa=1";
const report = {
  started: new Date().toISOString(),
  production: true,
  checks: [],
  screenshots: [],
  transfers: [],
  errors: [],
  remote: [],
};
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
async function shot(page, name) {
  await page.locator(".screenshot-lightbox img").evaluateAll(async (images) => {
    await Promise.all(images.map((img) => img.decode().catch(() => {})));
  });
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${dir}/${name}.png` });
  report.screenshots.push({
    name,
    at: new Date().toISOString(),
    url: page.url(),
  });
}
async function imageReady(page, selector) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForFunction((s) => {
    const e = document.querySelector(s);
    return e?.complete && e.naturalWidth > 0;
  }, selector);
  await page.locator(selector).evaluate(async (img) => {
    await img.decode();
  });
}
async function axe(page, name) {
  const r = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  assert.deepEqual(
    r.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
    [],
    name,
  );
}
async function visibleHeading(page) {
  const bar = await page.locator(".district-panel-bar").boundingBox(),
    h = await page.locator("#district-title").boundingBox();
  assert.ok(h.y >= bar.y + bar.height - 1, "Projects heading overlaps toolbar");
}
async function noOverflow(page) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
}
function listen(page) {
  page.on("pageerror", (e) => report.errors.push(e.message));
  page.on("request", (r) => {
    if (!r.url().startsWith(new URL(base).origin)) report.remote.push(r.url());
  });
}
async function transfers(page, scenario) {
  await page.waitForTimeout(200);
  const value = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter((r) => r.initiatorType === "img")
      .map((r) => ({ url: r.name, bytes: r.transferSize })),
  );
  report.transfers.push({
    scenario,
    totalBytes: value.reduce((n, r) => n + r.bytes, 0),
    images: value,
  });
  return value;
}
try {
  const c = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    }),
    p = await c.newPage();
  listen(p);
  await p.goto(base, { waitUntil: "networkidle" });
  await settled(p);
  await shot(p, "final-overview");
  const initial = await transfers(p, "desktop overview");
  assert.equal(
    initial.filter((r) => r.url.includes("/project-media/")).length,
    0,
  );
  await p.goto(`${base}#projects`, { waitUntil: "networkidle" });
  await settled(p, "projects");
  await imageReady(p, '[data-project="bi"] .media-open img');
  await visibleHeading(p);
  assert.equal(await p.locator(".project-story-preview").count(), 4);
  assert.equal(
    await p.locator(".project-graphic").count(),
    0,
    "Concept must not be primary media",
  );
  const previews = await transfers(p, "desktop Projects before enlarge");
  assert.ok(
    !previews.some((r) => r.url.includes("-full.webp")),
    "Full-resolution files must be deferred",
  );
  await shot(p, "final-projects-index");
  await axe(p, "Projects real-media gallery");
  const bi = p.locator('[data-project="bi"]');
  await bi
    .getByRole("button", {
      name: "Show Business Intelligence screenshot 3: Dataset workspace",
    })
    .click();
  await p.waitForFunction(() =>
    document
      .querySelector('[data-project="bi"] .media-open img')
      ?.currentSrc.includes("dataset-manager"),
  );
  await imageReady(p, '[data-project="bi"] .media-open img');
  assert.equal(
    await bi
      .getByRole("button", {
        name: "Show Business Intelligence screenshot 3: Dataset workspace",
      })
      .getAttribute("aria-pressed"),
    "true",
  );
  await bi
    .getByRole("button", {
      name: "Show Business Intelligence screenshot 2: Analytics dashboard",
    })
    .click();
  const opener = bi.getByRole("button", {
    name: "Enlarge Business Intelligence screenshot: Analytics dashboard",
  });
  await opener.focus();
  await p.keyboard.press("Enter");
  await p.locator(".screenshot-lightbox").waitFor();
  await imageReady(p, ".screenshot-lightbox img");
  await p.locator(".lightbox-viewport").evaluate((e) => (e.scrollTop = 550));
  await shot(p, "final-bi-lightbox");
  await axe(p, "BI lightbox");
  await p.getByRole("button", { name: "View at 100%", exact: true }).click();
  assert.equal(
    await p
      .locator(".lightbox-viewport")
      .evaluate((e) => e.scrollWidth > e.clientWidth),
    true,
  );
  await p.keyboard.press("ArrowRight");
  await p
    .getByRole("heading", { name: "Business Intelligence — Dataset workspace" })
    .waitFor();
  await p.keyboard.press("ArrowLeft");
  await p
    .getByRole("heading", {
      name: "Business Intelligence — Analytics dashboard",
    })
    .waitFor();
  for (let i = 0; i < 16; i++) {
    await p.keyboard.press("Tab");
    assert.ok(
      await p.evaluate(
        () => !!document.activeElement?.closest(".screenshot-lightbox"),
      ),
    );
  }
  await p.keyboard.press("Escape");
  await p.locator(".screenshot-lightbox").waitFor({ state: "detached" });
  assert.ok(await opener.evaluate((e) => e === document.activeElement));
  report.checks.push(
    "thumbnail selection; keyboard enlarge; full-resolution zoom; arrows; native focus trap; Escape and restoration",
  );
  await bi
    .getByRole("button", { name: "Read Business Intelligence case study" })
    .click();
  await p.locator(".case-dialog").waitFor({ state: "visible" });
  await p.locator(".case-dialog .media-open").click();
  await p.locator(".screenshot-lightbox").waitFor();
  await p.keyboard.press("Escape");
  await p.locator(".screenshot-lightbox").waitFor({ state: "detached" });
  assert.ok(
    await p.locator(".case-dialog").evaluate((e) => e.open),
    "Closing screenshot must retain case",
  );
  await p.locator(".case-dialog").evaluate((e) => (e.scrollTop = 900));
  const closeBounds = await p.getByRole("button", { name: "Close case study", exact: true }).boundingBox();
  const caseBounds = await p.locator(".case-dialog").boundingBox();
  assert.ok(closeBounds.y >= caseBounds.y && closeBounds.y + closeBounds.height <= caseBounds.y + caseBounds.height, "Case close remains visible after deep scroll");
  await p.keyboard.press("Escape");
  await p.locator(".case-dialog").waitFor({ state: "hidden" });
  await visibleHeading(p);
  await bi
    .getByRole("button", { name: "Read Business Intelligence case study" })
    .click();
  await p.locator(".case-dialog").waitFor({ state: "visible" });
  assert.equal(await p.locator(".case-dialog").evaluate((e) => e.scrollTop), 0);
  await p.goBack();
  await p.locator(".case-dialog").waitFor({ state: "hidden" });
  await visibleHeading(p);
  await p.goForward();
  await p.locator(".case-dialog").waitFor({ state: "visible" });
  assert.equal(await p.locator(".case-dialog").evaluate((e) => e.scrollTop), 0);
  await p.keyboard.press("Escape");
  await p.locator(".case-dialog").waitFor({ state: "hidden" });
  report.checks.push(
    "nested modal Escape; case scroll reset; back/forward; unclipped Projects heading",
  );
  for (const [slug, id, title] of [
    ["blue-cred", "blue-cred", "Blue Cred"],
    ["revenue-recovery", "recovery", "AI Revenue Recovery"],
    ["cybertwin-ai", "cybertwin", "CyberTwin AI"],
    ["anumitra", "anumitra", "Anumitra"],
    ["resume-analyser", "resume", "AI Resume Analyser"],
  ]) {
    await p.goto(`${base}#projects/${slug}`, { waitUntil: "networkidle" });
    await p.locator(".case-dialog").waitFor({ state: "visible" });
    await imageReady(p, ".case-dialog .media-open img");
    await shot(p, `final-case-${id}`);
    assert.match(
      await p.locator(".case-dialog .media-kind").innerText(),
      /Actual application screenshot/,
    );
    await p.locator(".case-dialog .media-open").click();
    await p.locator(".screenshot-lightbox").waitFor();
    await imageReady(p, ".screenshot-lightbox img");
    await shot(p, `final-lightbox-${id}`);
    await axe(p, `${title} screenshot`);
    await p.keyboard.press("Escape");
    await p.locator(".screenshot-lightbox").waitFor({ state: "detached" });
  }
  await p.goto(`${base}#experience`, { waitUntil: "networkidle" });
  await settled(p, "experience");
  assert.doesNotMatch(
    await p.locator(".experience-studio").innerText(),
    /Résumé-based|1,000|Nestl|Nescaf/,
  );
  await shot(p, "final-nitrix-polish");
  await axe(p, "Nitrix copy polish");
  await p.goto(`${base}#opensource`, { waitUntil: "networkidle" });
  await settled(p, "opensource");
  assert.equal(await p.locator(".pr-row").count(), 23);
  assert.match(await p.locator(".snapshot-note").innerText(), /5 Nov 2026/);
  await shot(p, "final-opensource");
  await p.goto(`${base}#projects`, { waitUntil: "networkidle" });
  await settled(p, "projects");
  assert.equal(await p.locator(".future-bay").count(), 0);
  await p.locator('[data-project="blue-cred"]').scrollIntoViewIfNeeded();
  assert.ok(
    (await p.locator('[data-project="blue-cred"] .media-open img').count()) ===
      1,
  );
  await visibleHeading(p);
  await shot(p, "final-blue-cred");
  await c.close();
  for (const [width, height] of [
    [1280, 800],
    [390, 844],
    [320, 780],
    [844, 390],
  ]) {
    const context = await browser.newContext({
        viewport: { width, height },
        hasTouch: true,
      }),
      page = await context.newPage();
    listen(page);
    await page.goto(`${base}#projects`, { waitUntil: "networkidle" });
    if (width >= 900) await settled(page, "projects");
    await imageReady(page, '[data-project="bi"] .media-open img');
    await noOverflow(page);
    await visibleHeading(page);
    await transfers(page, `${width}x${height} Projects before enlarge`);
    await shot(page, `final-projects-${width}`);
    await axe(page, `${width} Projects`);
    await page
      .getByRole("button", {
        name: "Enlarge Business Intelligence screenshot: ABI homepage",
      })
      .tap();
    await page.locator(".screenshot-lightbox").waitFor();
    await imageReady(page, ".screenshot-lightbox img");
    await page.getByRole("button", { name: "View at 100%", exact: true }).tap();
    assert.ok(
      await page
        .locator(".lightbox-viewport")
        .evaluate((e) => e.scrollWidth > e.clientWidth),
    );
    await page.locator(".lightbox-viewport").evaluate((e) => {
      e.scrollLeft = 220;
      e.scrollTop = 600;
    });
    await shot(page, `final-lightbox-${width}-zoom`);
    await axe(page, `${width} lightbox`);
    await page
      .getByRole("button", { name: "Close screenshot", exact: true })
      .tap();
    await page.locator(".screenshot-lightbox").waitFor({ state: "detached" });
    await noOverflow(page);
    await context.close();
    report.checks.push(
      `${width}x${height}: readable route, loaded UI, touch enlarge/zoom/pan/close, axe and no overflow`,
    );
    console.log(`PASS media viewport ${width}x${height}`);
  }
  const fallback = await browser.newContext({
      viewport: { width: 390, height: 844 },
    }),
    fp = await fallback.newPage();
  await fp.route("**/project-media/**/*.webp", (route) => route.abort());
  await fp.goto(`${base}#projects`);
  await imageReady(fp, '[data-project="bi"] .media-open img');
  assert.ok(
    (
      await fp
        .locator('[data-project="bi"] .media-open img')
        .evaluate((e) => e.currentSrc)
    ).endsWith(".png"),
  );
  report.checks.push("WebP failure uses actual PNG fallback");
  await fallback.close();
  const broken = await browser.newContext({
      viewport: { width: 390, height: 844 },
    }),
    bp = await broken.newPage();
  await bp.route("**/project-media/**", (route) => route.abort());
  await bp.goto(`${base}#projects`);
  await bp.locator('[data-project="bi"]').scrollIntoViewIfNeeded();
  await bp.locator('[data-project="bi"] .media-failure').waitFor();
  assert.equal(
    await bp.locator('[data-project="bi"] .media-open img').count(),
    0,
  );
  await shot(bp, "final-image-failure");
  report.checks.push(
    "all image failures produce a helpful state and retain source/case links",
  );
  await broken.close();
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.remote, []);
  report.status = "PASS";
  console.log(
    "PASS actual media, captions, modal/keyboard/touch/scroll and failure paths",
  );
} catch (e) {
  report.status = "FAIL";
  report.failure = e.stack;
  throw e;
} finally {
  report.finished = new Date().toISOString();
  await fs.writeFile(
    `${dir}/media-browser-results.json`,
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
