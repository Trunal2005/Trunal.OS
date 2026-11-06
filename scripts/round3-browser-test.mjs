import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { settled, actualPick, distance } from "./scene-helpers.mjs";
const dir =
  process.env.EVIDENCE_DIR || "docs/project-media-evidence/regression";
await fs.mkdir(dir, { recursive: true });
const base = process.env.TEST_URL || "http://127.0.0.1:4173/?qa=1";
const snapshot = JSON.parse(
  await fs.readFile("src/data/prs.generated.json", "utf8"),
);
const ids = [
  "projects",
  "skills",
  "experience",
  "opensource",
  "about",
  "achievements",
  "contact",
];
const labels = [
  "Projects",
  "Skills Lab",
  "Work Experience",
  "Open Source",
  "About & Education",
  "Achievements & Certifications",
  "Contact",
];
const report = {
  started: new Date().toISOString(),
  production: true,
  picks: [],
  frames: [],
  viewports: [],
  checks: [],
  fallback: [],
};
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
async function capture(page, name, fullPage = false) {
  await page.mouse.move(1430, 80);
  await page.screenshot({ path: `${dir}/final-${name}.png`, fullPage });
  report.frames.push({ name, at: new Date().toISOString(), route: page.url() });
}
async function axe(page, label) {
  const r = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  assert.deepEqual(
    r.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
      summary: v.nodes.map((n) => n.failureSummary),
    })),
    [],
    label,
  );
}
async function nav(page, id) {
  await page
    .getByRole("button", {
      name: `Explore ${labels[ids.indexOf(id)]}`,
      exact: true,
    })
    .click();
  await page.waitForFunction(
    (id) =>
      document
        .querySelector(".district-panel")
        ?.getAttribute("data-district") === id,
    id,
  );
}
async function reset(page) {
  await page.getByRole("button", { name: "Reset world view" }).click();
  return settled(page);
}
async function noOverflow(page) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "horizontal overflow",
  );
}
try {
  const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    }),
    page = await context.newPage();
  const errors = [],
    remote = [],
    failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("request", (r) => {
    if (!r.url().startsWith(new URL(base).origin)) remote.push(r.url());
  });
  page.on("requestfailed", (r) => failed.push(r.url()));
  await page.goto(base, { waitUntil: "networkidle" });
  const home = await settled(page);
  await page.waitForTimeout(600);
  assert.equal(Object.keys(home.geometries).length, 7);
  assert.equal(
    new Set(Object.values(home.geometries).map((g) => g.shape)).size,
    7,
  );
  assert.ok(Object.values(home.geometries).every((g) => g.meshes >= 10));
  assert.equal(
    await page.getByRole("heading", { name: "Trunal Patil." }).count(),
    1,
  );
  assert.equal(await page.locator(".section-navigation button").count(), 7);
  await capture(page, "desktop-overview");
  await axe(page, "desktop overview");
  for (const id of ids) {
    await reset(page);
    const point = await actualPick(page, id);
    const shot = await settled(page, id);
    assert.ok(distance(shot.camera, home.camera) > 4);
    assert.ok(distance(shot.target, home.target) > 4);
    assert.ok(distance(shot.orientation, home.orientation) > 0.01);
    assert.equal(shot.picks.at(-1).type, "Mesh");
    assert.equal(
      await page.locator(".district-panel").getAttribute("data-district"),
      id,
    );
    report.picks.push({
      id,
      point,
      before: {
        camera: home.camera,
        target: home.target,
        quaternion: home.orientation,
      },
      after: {
        camera: shot.camera,
        target: shot.target,
        quaternion: shot.orientation,
      },
      event: shot.picks.at(-1),
    });
    await capture(page, `desktop-${id}`);
    await noOverflow(page);
    await axe(page, id);
    console.log(`PASS district ${id}`);
    if (id === "projects") {
      await actualPick(page, "project-bi");
      await page.locator("dialog").waitFor({ state: "visible" });
      await settled(page, "projects");
      await capture(page, "project-case");
      assert.equal(
        (await page
          .locator('dialog a[href^="https://github.com/Trunal2005/"]')
          .count()) > 0,
        true,
      );
      await page.keyboard.press("Tab");
      assert.ok(
        await page.evaluate(() => !!document.activeElement.closest("dialog")),
      );
      await axe(page, "case dialog");
      await page.keyboard.press("Escape");
      await page.locator("dialog").waitFor({ state: "hidden" });
      await settled(page, "projects");
      await page.locator(".project-discovery > summary").click();
      await page.getByRole("button", { name: "Security", exact: true }).click();
      assert.equal(await page.locator(".project-story-preview").count(), 1);
      await page.getByRole("button", { name: "All work", exact: true }).click();
      assert.equal(await page.locator(".project-story-preview").count(), 6);
      await page
        .getByRole("searchbox", { name: "Search projects" })
        .fill("no matching system");
      assert.equal(await page.locator(".project-story-preview").count(), 0);
      await page.getByRole("searchbox", { name: "Search projects" }).fill("");
      const opener = page.getByRole("button", {
        name: "Read AI Revenue Recovery case study",
      });
      await opener.click();
      await page.locator("dialog").waitFor({ state: "visible" });
      await page.keyboard.press("Escape");
      await page.locator("dialog").waitFor({ state: "hidden" });
      assert.ok(await opener.evaluate((el) => el === document.activeElement));
      const blue = page.locator('[data-project="blue-cred"]');
      await blue.scrollIntoViewIfNeeded();
      assert.equal(await blue.count(), 1);
      assert.ok((await blue.locator("img").count()) > 0);
      assert.ok(
        (await blue
          .locator('a[href="https://github.com/Trunal2005/Blue-Cred"]')
          .count()) > 0,
      );
      await capture(page, "blue-cred");
    }
    if (id === "skills") {
      for (const category of [
        "frontend",
        "backend",
        "ai",
        "data",
        "tools",
        "networks",
      ]) {
        await nav(page, "skills");
        await settled(page, "skills");
        await actualPick(page, `skill-${category}`);
        await settled(page, "skills");
        assert.ok(page.url().endsWith(`skills/${category}`));
        assert.ok((await page.locator(".skill-records article").count()) > 0);
        if (["frontend", "backend", "ai", "data"].includes(category)) {
          await page.locator(".skill-workbench").scrollIntoViewIfNeeded();
          await capture(page, `skill-${category}`);
        }
        report.checks.push(`physical skill ${category}`);
      }
      await page
        .getByRole("button", { name: "Show all skills / HTML index" })
        .click();
      await page.waitForFunction(
        () => document.querySelectorAll(".skill-index section").length === 6,
      );
      assert.ok((await page.locator(".skill-evidence-links a").count()) > 0);
      await capture(page, "skills-html-index");
    }
    if (id === "experience") {
      assert.match(
        await page.locator(".nitrix-role-card").innerText(),
        /Co-Founder & Chief Marketing Officer/,
      );
      assert.match(
        await page.locator(".role-dates").innerText(),
        /March 2025 — Present/,
      );
      assert.equal(
        await page.locator(".responsibility-list article").count(),
        5,
      );
      assert.doesNotMatch(
        await page.locator(".experience-studio").innerText(),
        /1,000|1000|Nestl|Nescaf|5\+/,
      );
      for (const stage of [
        "outreach",
        "alignment",
        "coordination",
        "analysis",
      ]) {
        await nav(page, "experience");
        await settled(page, "experience");
        await actualPick(page, `stage-${stage}`);
        await settled(page, "experience");
        assert.ok(page.url().endsWith(`experience/${stage}`));
        report.checks.push(`physical studio ${stage}`);
      }
      await page.locator(".campaign-workflow").scrollIntoViewIfNeeded();
      await capture(page, "nitrix-workflow");
      await page.locator(".responsibility-list").scrollIntoViewIfNeeded();
      await capture(page, "nitrix-responsibilities");
    }
    if (id === "opensource") {
      const merged = snapshot.items.filter(
          (p) => p.external && p.state === "merged",
        ).length,
        open = snapshot.items.filter(
          (p) => p.external && p.state === "open",
        ).length;
      assert.equal(await page.locator(".pr-row").count(), merged + open);
      assert.match(
        await page.locator(".snapshot-note").innerText(),
        /5 Nov 2026/,
      );
      for (const pr of [
        "python-poetry/poetry#11141",
        "chhavikant03/Civic-Connect#49",
        "VarshithReddy2006/DevTrack#26",
      ]) {
        await nav(page, "opensource");
        await settled(page, "opensource");
        await actualPick(page, `pr-${pr}`);
        await settled(page, "opensource");
        assert.equal(
          decodeURIComponent(page.url().split("#")[1]),
          `opensource/${pr}`,
        );
        assert.match(
          await page.locator(".pr-spotlight").getAttribute("href"),
          new RegExp(pr.split("#")[1]),
        );
        report.checks.push(`physical PR ${pr}`);
      }
      for (const [state, count] of [
        ["open", open],
        ["merged", merged],
        ["closed-unmerged", 0],
      ]) {
        await page
          .getByRole("combobox", { name: "Contribution state" })
          .selectOption(state);
        assert.equal(await page.locator(".pr-row").count(), count);
        await page.locator(".snapshot-note").scrollIntoViewIfNeeded();
        await capture(page, `prs-${state}`);
      }
      await page
        .getByRole("combobox", { name: "Contribution state" })
        .selectOption("open");
      await page
        .getByRole("searchbox", { name: "Search contributions" })
        .fill("PapaParse");
      assert.equal(await page.locator(".pr-row").count(), 4);
      await page
        .getByRole("searchbox", { name: "Search contributions" })
        .fill("no such PR");
      assert.equal(await page.locator(".pr-row").count(), 0);
    }
    if (id === "about")
      assert.match(
        await page.locator(".education-card").innerText(),
        /Vidyalankar Institute of Technology/,
      );
    if (id === "achievements") {
      assert.match(
        await page.locator(".district-panel").innerText(),
        /Evidence before badges/,
      );
      assert.match(
        await page.locator(".finalist-achievement").innerText(),
        /2x National-Level Hackathon Finalist/,
      );
      assert.doesNotMatch(
        await page.locator(".finalist-achievement").innerText(),
        /MERGED UPSTREAM|independently verified/i,
      );
    }
    if (id === "contact") {
      assert.equal(
        await page.locator('a[href="mailto:patiltrunal06@gmail.com"]').count(),
        1,
      );
      await page.getByRole("button", { name: "Copy email" }).click();
      await page.waitForFunction(() =>
        /copied|Copy unavailable/.test(
          document.querySelector(".contact-status").textContent,
        ),
      );
      assert.match(
        await page.locator(".contact-status").innerText(),
        /copied|Copy unavailable/,
      );
    }
  }
  // Keyboard equivalence, Escape/focus restoration and interrupted camera flights.
  for (const id of ids) {
    await reset(page);
    const b = page.getByRole("button", {
      name: `Explore ${labels[ids.indexOf(id)]}`,
      exact: true,
    });
    await b.focus();
    await page.keyboard.press("Enter");
    await settled(page, id);
    await page.keyboard.press("Escape");
    await settled(page);
    assert.ok(await b.evaluate((el) => el === document.activeElement));
  }
  await nav(page, "projects");
  await page.waitForTimeout(120);
  await nav(page, "skills");
  await settled(page, "skills");
  report.checks.push(
    "mid-flight retarget, seven keyboard sections, Escape and focus restoration",
  );
  await reset(page);
  await page.mouse.move(1150, 300);
  await page.mouse.down();
  await page.mouse.move(1220, 350, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(250);
  const orbit = await page.evaluate(() => window.__TRUNAL_SCENE__);
  assert.ok(distance(orbit.camera, home.camera) > 0.1);
  await page.mouse.wheel(0, -300);
  await page.waitForTimeout(350);
  const zoom = await page.evaluate(() => window.__TRUNAL_SCENE__);
  assert.ok(distance(zoom.camera, orbit.camera) > 0.1);
  await reset(page);
  report.checks.push("actual orbit and wheel zoom");
  assert.deepEqual(errors, []);
  assert.deepEqual(remote, []);
  assert.deepEqual(failed, []);
  report.desktop = { errors, remote, failed };
  await context.close();
  // Every requested viewport, direct section routes, readable HTML and real touch input.
  for (const [width, height] of [
    [1280, 800],
    [768, 1024],
    [390, 844],
    [320, 780],
    [844, 390],
  ]) {
    const c = await browser.newContext({
        viewport: { width, height },
        hasTouch: true,
      }),
      p = await c.newPage();
    const remote = [];
    p.on("request", (r) => {
      if (!r.url().startsWith(new URL(base).origin)) remote.push(r.url());
    });
    await p.goto(base, { waitUntil: "networkidle" });
    if (width >= 900) await settled(p);
    else {
      assert.equal(await p.locator("canvas").count(), 0);
      assert.equal(await p.locator(".section-index-grid button").count(), 7);
    }
    await capture(p, `viewport-${width}-home`, width < 900);
    await axe(p, `${width} home`);
    await noOverflow(p);
    for (const id of ids) {
      await p.goto(`${base}#${id}`, { waitUntil: "networkidle" });
      if (width >= 900) await settled(p, id);
      assert.equal(
        await p.locator(".district-panel").getAttribute("data-district"),
        id,
      );
      await noOverflow(p);
      await axe(p, `${width} ${id}`);
      if (width === 390 || width === 320 || width === 844)
        await capture(p, `viewport-${width}-${id}`, width < 900);
    }
    await p.goto(`${base}#skills`);
    const ai = p.getByRole("button", { name: "AI & ML", exact: true });
    await ai.tap();
    await p.waitForURL("**#skills/ai");
    assert.ok(p.url().endsWith("skills/ai"));
    await p.getByRole("heading", { name: "AI & ML", exact: true }).waitFor();
    assert.match(
      await p.locator(".skill-index").innerText(),
      /LLM applications/,
    );
    await p.goto(`${base}#experience`);
    await p.getByRole("button", { name: "Analysis", exact: true }).tap();
    await p.waitForURL("**#experience/analysis");
    assert.ok(p.url().endsWith("experience/analysis"));
    await p.waitForFunction(
      () =>
        document.querySelector(".stage-description strong")?.textContent ===
        "Analysis",
    );
    await p.goto(`${base}#projects/revenue-recovery`);
    await p.locator("dialog").waitFor({ state: "visible" });
    await p.keyboard.press("Escape");
    await p.getByRole("button", { name: "2D", exact: true }).click();
    await nav(p, "opensource");
    assert.equal(await p.locator(".pr-row").count(), 23);
    await noOverflow(p);
    assert.deepEqual(remote, []);
    report.viewports.push({
      width,
      height,
      directRoutes: 7,
      axeViolations: 0,
      touch: "skills + experience",
      remote,
    });
    await c.close();
    console.log(`PASS viewport ${width}x${height}`);
  }
  const reduced = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    }),
    rp = await reduced.newPage();
  await rp.goto(base);
  assert.equal(await rp.locator("canvas").count(), 0);
  await nav(rp, "skills");
  await capture(rp, "reduced-motion-2d");
  await rp.getByRole("button", { name: "3D", exact: true }).click();
  await settled(rp, "skills");
  await rp
    .getByRole("button", { name: "Display preferences", exact: true })
    .click();
  assert.ok(
    await rp
      .getByRole("checkbox", { name: "Reduced motion", exact: true })
      .isChecked(),
  );
  await rp.keyboard.press("Escape");
  report.fallback.push("reduced motion defaults 2D; opt-in 3D instant camera");
  await reduced.close();
  const noGL = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await noGL.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return /webgl/.test(type) ? null : original.call(this, type, ...args);
    };
  });
  const fp = await noGL.newPage();
  await fp.goto(base);
  await fp.locator(".portfolio-index").waitFor();
  await capture(fp, "no-webgl");
  for (const id of ids) {
    await nav(fp, id);
    assert.equal(
      await fp.locator(".district-panel").getAttribute("data-district"),
      id,
    );
  }
  await axe(fp, "no WebGL contact");
  report.fallback.push("forced WebGL failure: all seven HTML sections");
  await noGL.close();
  const loss = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  await loss.goto(base);
  await settled(loss);
  await loss.locator("canvas").dispatchEvent("webglcontextlost");
  await loss.locator(".portfolio-index").waitFor();
  report.fallback.push("context loss: working HTML index");
  await loss.close();
  report.status = "PASS";
  console.log("PASS complete Round 3 production browser suite");
} catch (e) {
  report.status = "FAIL";
  report.failure = e.stack;
  throw e;
} finally {
  report.finished = new Date().toISOString();
  await fs.writeFile(
    `${dir}/browser-results.json`,
    JSON.stringify(report, null, 2),
  );
  await browser.close();
}
