import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import assert from "node:assert/strict";
import { settled, actualPick } from "./scene-helpers.mjs";
const dir = "docs/controlled-upgrade-evidence";
await fs.mkdir(dir, { recursive: true });
const base = "http://127.0.0.1:4173/?qa=1";
const fixtureOnly = process.argv.includes("--fixture-only");
const report = {
  at: new Date().toISOString(),
  checks: [],
  screenshots: [],
  errors: [],
  remote: [],
  failedResponses: [],
  browserInternal: [],
};
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const fixtureRoot = path.resolve(".local/resume-fixture-dist");
const server = http.createServer(async (req, res) => {
  try {
    const file = path.resolve(
      fixtureRoot,
      "." + new URL(req.url, "http://localhost").pathname,
    );
    assert.ok(file.startsWith(fixtureRoot + path.sep));
    const content = await fs.readFile(
      file.endsWith(path.sep) ? file + "index.html" : file,
    );
    res.setHeader(
      "Content-Type",
      file.endsWith(".js")
        ? "text/javascript"
        : file.endsWith(".css")
          ? "text/css"
          : "text/html",
    );
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(4180, "127.0.0.1", resolve));
function listen(p) {
  p.on("pageerror", (e) => report.errors.push(e.message));
  p.on("request", (r) => {
    if (/^(chrome:|chrome-extension:|blob:|data:)/.test(r.url())) {
      report.browserInternal.push(r.url());
      return;
    }
    if (
      !["http://127.0.0.1:4173", "http://127.0.0.1:4180"].includes(
        new URL(r.url()).origin,
      )
    )
      report.remote.push(r.url());
  });
  p.on("response", (r) => {
    if (r.status() >= 400) report.failedResponses.push([r.status(), r.url()]);
  });
}
async function ready(p, selector = ".case-dialog .media-open img") {
  await p
    .locator(selector)
    .first()
    .evaluate(async (img) => {
      if (!img.complete)
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      await img.decode();
      if (!img.naturalWidth) throw Error("Image missing");
    });
}
async function shot(p, name) {
  await p.locator("img").evaluateAll(async (images) => {
    await Promise.all(
      images
        .filter((i) => i.complete && i.naturalWidth)
        .map((i) => i.decode().catch(() => {})),
    );
  });
  await p.waitForTimeout(250);
  await p.screenshot({ path: `${dir}/${name}.png` });
  report.screenshots.push(name);
}
async function axe(p) {
  const r = await new AxeBuilder({ page: p })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  assert.deepEqual(
    r.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
    [],
  );
}
async function overflow(p) {
  assert.equal(
    await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    false,
  );
}
const entries = [
  ["anumitra", "anumitra", "home", 3],
  ["blue-cred", "blue-cred", "homepage", 4],
  ["bi", "business-intelligence", "home", 3],
  ["recovery", "revenue-recovery", "home", 3],
  ["cybertwin", "cybertwin-ai", "security-overview", 2],
  ["resume", "resume-analyser", "upload-workspace", 1],
];
// Generate a tiny, valid one-page PDF in memory, delivered ONLY by the test route.
function pdfFixture() {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  const stream =
    "BT /F1 22 Tf 60 700 Td (TEST FIXTURE - NOT OWNER RESUME) Tj 0 -45 Td /F1 14 Tf (Local native PDF viewer acceptance test.) Tj ET";
  objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  let data = "%PDF-1.4\n",
    offset = [0];
  for (let i = 0; i < objects.length; i++) {
    offset.push(Buffer.byteLength(data));
    data += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const start = Buffer.byteLength(data);
  data += `xref\n0 6\n0000000000 65535 f \n${offset
    .slice(1)
    .map((n) => `${String(n).padStart(10, "0")} 00000 n \n`)
    .join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return Buffer.from(data);
}
try {
  if (!fixtureOnly) {
  const c = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    }),
    p = await c.newPage();
  listen(p);
  await p.goto(base + "#projects");
  await settled(p, "projects");
  assert.equal(await p.locator(".project-story-preview").count(), 4);
  assert.deepEqual(
    await p
      .locator(".project-story-preview")
      .evaluateAll((es) => es.map((e) => e.dataset.project)),
    ["anumitra", "blue-cred", "bi", "recovery"],
  );
  await ready(p, '[data-project="anumitra"] .media-open img');
  await shot(p, "after-projects");
  await axe(p);
  await p.locator(".project-discovery summary").click();
  await p.getByRole("button", { name: "All work", exact: true }).click();
  assert.equal(await p.locator(".project-story-preview").count(), 6);
  await shot(p, "after-all-projects");
  await p.getByRole("searchbox", { name: "Search projects" }).fill("Blue Cred");
  const card = p.locator('[data-project="blue-cred"]');
  await card.locator(".media-open").scrollIntoViewIfNeeded();
  await ready(p, '[data-project="blue-cred"] .media-open img');
  await shot(p, "after-blue-card");
  const opener = card.locator(".media-open");
  await opener.focus();
  const before = await p.evaluate(() => ({
    camera: window.__TRUNAL_SCENE__.camera,
    target: window.__TRUNAL_SCENE__.target,
    scroll: document.querySelector(".district-panel-body").scrollTop,
  }));
  await p.keyboard.press("Enter");
  await ready(p, ".screenshot-lightbox img");
  await shot(p, "after-fullscreen-gallery");
  await axe(p);
  await p.mouse.move(550, 420);
  await p.mouse.wheel(0, 500);
  await p.mouse.down();
  await p.mouse.move(680, 460);
  await p.mouse.up();
  await p.waitForTimeout(200);
  const after = await p.evaluate(() => ({
    camera: window.__TRUNAL_SCENE__.camera,
    target: window.__TRUNAL_SCENE__.target,
    scroll: document.querySelector(".district-panel-body").scrollTop,
  }));
  assert.deepEqual(after, before);
  for (let i = 0; i < 15; i++) {
    await p.keyboard.press("Tab");
    assert.ok(
      await p.evaluate(
        () => !!document.activeElement.closest(".screenshot-lightbox"),
      ),
    );
  }
  await p.keyboard.press("Escape");
  await p.locator(".screenshot-lightbox").waitFor({ state: "detached" });
  assert.ok(await opener.evaluate((e) => document.activeElement === e));
  assert.equal(
    await p.getByRole("searchbox", { name: "Search projects" }).inputValue(),
    "Blue Cred",
  );
  report.checks.push(
    "Featured/all order; shared hero; quick facts; gallery preserves filter, focus, scroll and camera under wheel/drag",
  );
  for (const [id, slug, hero, count] of entries) {
    await p.goto(base + "#projects/" + slug);
    await p.locator(".case-dialog").waitFor({ state: "visible" });
    await ready(p);
    await settled(p, "projects");
    assert.match(
      await p
        .locator(".case-dialog .media-open img")
        .evaluate((e) => e.currentSrc),
      new RegExp(`/project-media/${id}/${hero}\\.webp$`),
    );
    assert.equal(
      await p.locator(".case-dialog .media-thumbnails button").count(),
      count > 1 ? count : 0,
    );
    assert.equal(await p.locator(".case-dialog .project-facts").count(), 1);
    await shot(p, "after-case-" + id);
    await axe(p);
    await p.keyboard.press("Escape");
  }
  report.checks.push(
    "Six stable deep links; each actual first hero and gallery count; quick facts; source links; axe",
  );
  await p.goto(base);
  await settled(p);
  await actualPick(p, "project-blue-cred");
  await p.locator(".case-dialog").waitFor({ state: "visible" });
  assert.equal(await p.locator("#case-title").innerText(), "Blue Cred");
  report.checks.push(
    "Existing Blue Cred pad is a real raycast target; no new campus geometry",
  );
  for (const id of ["experience", "achievements", "contact"]) {
    await p.goto(base + "#" + id);
    await settled(p, id);
    if (id === "contact") {
      assert.equal(
        await p
          .getByRole("link", { name: "Email me", exact: true })
          .getAttribute("href"),
        "mailto:patiltrunal06@gmail.com",
      );
      assert.equal(
        await p
          .getByRole("link", { name: "LinkedIn ↗", exact: true })
          .getAttribute("href"),
        "https://www.linkedin.com/in/trunal-patil-866b97325/",
      );
      assert.ok(
        await p
          .getByRole("button", { name: "Résumé coming soon" })
          .isDisabled(),
      );
      await p.getByRole("button", { name: "Copy email", exact: true }).click();
      await p
        .locator(".contact-status")
        .filter({ hasText: /copied|unavailable/ })
        .waitFor();
    }
    await shot(p, "after-" + id);
    await axe(p);
  }
  assert.equal(
    report.failedResponses.filter((r) => r[1].includes(".pdf")).length,
    0,
  );
  report.checks.push(
    "Exact approved contact links; copy feedback; honest missing résumé without any PDF request; visible unverified owner finalist claim",
  );
  await c.close();
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [768, 1024],
    [390, 844],
    [320, 780],
    [844, 390],
  ]) {
    const context = await browser.newContext({
        viewport: { width, height },
        hasTouch: width < 900,
      }),
      page = await context.newPage();
    listen(page);
    await page.goto(base + "#projects");
    if (width >= 900) await settled(page, "projects");
    await ready(page, '[data-project="anumitra"] .media-open img');
    await overflow(page);
    await shot(page, `after-projects-${width}`);
    for (const [id, slug, hero] of entries) {
      await page.goto(base + "#projects/" + slug);
      await page.locator(".case-dialog").waitFor({ state: "visible" });
      await ready(page);
      assert.ok(
        (
          await page
            .locator(".case-dialog .media-open img")
            .evaluate((e) => e.currentSrc)
        ).includes(`/project-media/${id}/${hero}.webp`),
      );
      await overflow(page);
    }
    await page.locator(".case-dialog .media-open").click();
    await ready(page, ".screenshot-lightbox img");
    assert.equal(
      await page.getByRole("button", { name: "Next screenshot" }).count(),
      0,
    );
    await shot(page, `after-single-lightbox-${width}`);
    await axe(page);
    await page.keyboard.press("Escape");
    await page.goto(base + "#projects/anumitra");
    await page.locator(".case-dialog").waitFor({ state: "visible" });
    await ready(page);
    await page.locator(".case-dialog .media-open").click();
    await ready(page, ".screenshot-lightbox img");
    await shot(page, `after-phone-gallery-${width}`);
    await page
      .getByRole("button", { name: "Next screenshot", exact: true })
      .click();
    await ready(page, ".screenshot-lightbox img");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await page.goto(base + "#contact");
    await page.getByRole("button", { name: "Résumé coming soon" }).waitFor();
    await overflow(page);
    await axe(page);
    await shot(page, `after-contact-${width}`);
    await context.close();
    report.checks.push(
      `${width}x${height}: six real heroes, missing résumé, contact, multi/single gallery and no overflow`,
    );
  }
  // Real text enlargement: double computed font sizes, preserving viewport (not pinch zoom).
  const zoomContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const z = await zoomContext.newPage();
  listen(z);
  for (const route of [
    "projects",
    "projects/anumitra",
    "achievements",
    "contact",
  ]) {
    await z.goto(base + "#" + route);
    await z.reload(); // Reset prior inline enlargement before each 200% sample.
    await z.waitForTimeout(400);
    await z.evaluate(() => {
      for (const el of document.querySelectorAll(
        "h1,h2,h3,h4,p,button,a,dt,dd,small,summary,label,figcaption,li,span",
      )) {
        const size = window.getComputedStyle(el).fontSize;
        el.dataset.zoomSize = size;
      }
      for (const el of document.querySelectorAll("[data-zoom-size]"))
        el.style.fontSize = `${parseFloat(el.dataset.zoomSize) * 2}px`;
    });
    await overflow(z);
    await shot(z, "after-text200-" + route.replace("/", "-"));
    await axe(z);
  }
  await zoomContext.close();
  report.checks.push(
    "200% computed text-size enlargement at unchanged 1280 viewport: Projects, case, Achievements, Contact; axe and no horizontal overflow",
  );
  }
  for (const [width, height, forced] of [
    [1440, 900, false],
    [1440, 900, true],
    [390, 844, false],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } }),
      page = await context.newPage();
    listen(page);
    await page.route("**/resume/Trunal_Patil_Resume_Public.pdf", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/pdf",
        body: pdfFixture(),
      }),
    );
    await page.goto("http://127.0.0.1:4180/index.html?qa=1#contact");
    if (width >= 900) await settled(page,"contact");
    if (forced) await page.getByLabel("Force no inline PDF").check();
    const opener = page.getByRole("button", {
      name: "View Résumé",
      exact: true,
    });
    const cameraBefore = await page.evaluate(() => window.__TRUNAL_SCENE__ ? {camera:window.__TRUNAL_SCENE__.camera,target:window.__TRUNAL_SCENE__.target} : null);
    await opener.click();
    await page.locator(".resume-viewer").waitFor();
    await page.waitForTimeout(1500);
    assert.equal(
      await page
        .getByRole("link", { name: "Open in new tab ↗" })
        .getAttribute("target"),
      "_blank",
    );
    assert.equal(
      await page
        .getByRole("link", { name: "Download PDF" })
        .getAttribute("download"),
      "Trunal_Patil_Resume_Public.pdf",
    );
    if (forced || width < 900) {
      assert.equal(await page.locator("object").count(), 0);
      await page.locator(".resume-fallback").waitFor();
    } else {
      assert.equal(
        await page.locator('object[type="application/pdf"]').count(),
        1,
      );
    }
    await shot(
      page,
      `fixture-resume-${width}-${forced ? "fallback" : "default"}`,
    );
    await overflow(page);
    await axe(page);
    await page.mouse.move(200,150); await page.mouse.wheel(0,300);
    const cameraAfter = await page.evaluate(() => window.__TRUNAL_SCENE__ ? {camera:window.__TRUNAL_SCENE__.camera,target:window.__TRUNAL_SCENE__.target} : null);
    assert.deepEqual(cameraAfter,cameraBefore);
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      assert.ok(
        await page.evaluate(
          () => !!document.activeElement.closest(".resume-viewer"),
        ),
      );
    }
    await page
      .getByRole("button", { name: "Close résumé", exact: true })
      .focus();
    await page.keyboard.press("Escape");
    await page.locator(".resume-viewer").waitFor({ state: "detached" });
    assert.ok(await opener.evaluate((e) => document.activeElement === e));
    await context.close();
  }
  report.checks.push(
    "Actual résumé component tested in disposable harness with in-memory PDF fixture: desktop object, no-inline and mobile fallback, controls, focus trap/Escape/return and real background camera preserved; fixture never ships",
  );
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.remote, []);
  assert.deepEqual(report.failedResponses, []);
  report.status = "PASS";
  console.log("PASS controlled upgrade acceptance", report.checks);
} catch (e) {
  report.status = "FAIL";
  report.failure = e.stack;
  throw e;
} finally {
  report.finished = new Date().toISOString();
  await fs.writeFile(
    `${dir}/${fixtureOnly ? "resume-browser-results" : "controlled-browser-results"}.json`,
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
