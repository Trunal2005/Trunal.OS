import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { settled, actualPick, distance } from "./scene-helpers.mjs";
const evidence = "docs/3d-rebuild-evidence";
const snapshot = JSON.parse(
  await fs.readFile("src/data/prs.generated.json", "utf8"),
);
const community = snapshot.items.filter((p) => p.external);
const openCount = community.filter((p) => p.state === "open").length;
const mergedCount = community.filter((p) => p.state === "merged").length;
await fs.mkdir(`${evidence}/sequence`, { recursive: true });
const base = new URL(process.env.TEST_URL || "http://127.0.0.1:4173/");
base.hash = "";
base.searchParams.set("qa", "1");
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const result = {
  viewports: [],
  picks: [],
  frames: [],
  fallback: [],
  checks: [],
};
const destinations = [
  ["work", "Selected work"],
  ["ai", "AI & data"],
  ["networks", "Networks & security"],
  ["opensource", "Open source"],
  ["journey", "Journey"],
  ["contact", "Contact"],
];
async function capture(page, name) {
  await page.screenshot({ path: `${evidence}/${name}.png` });
  result.frames.push({
    name,
    at: new Date().toISOString(),
    scene: await page.evaluate(() =>
      window.__TRUNAL_SCENE__
        ? {
            camera: window.__TRUNAL_SCENE__.camera,
            target: window.__TRUNAL_SCENE__.target,
            flight: window.__TRUNAL_SCENE__.flight,
          }
        : null,
    ),
  });
}
async function axe(page, where) {
  const r = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  assert.equal(
    r.violations.length,
    0,
    `${where}: ${JSON.stringify(r.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })))}`,
  );
  return r.violations.length;
}
try {
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [768, 1024],
    [390, 844],
    [320, 780],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [],
      remote = [],
      failed = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("request", (r) => {
      if (!r.url().startsWith(base.origin)) remote.push(r.url());
    });
    page.on("requestfailed", (r) => failed.push(r.url()));
    await page.goto(base.href, { waitUntil: "networkidle" });
    const overview = await settled(page);
    assert.equal(
      await page
        .getByRole("button", { name: "3D", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    assert.equal(
      await page.locator("canvas").getAttribute("data-renderer"),
      "webgl",
    );
    const bounds = await page.locator("canvas").boundingBox();
    assert.ok(bounds.width * bounds.height >= width * height * 0.75);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    assert.equal(await page.evaluate(() => scrollY), 0);
    assert.equal(Object.keys(overview.geometries).length, 6);
    assert.equal(
      new Set(Object.values(overview.geometries).map((g) => g.shape)).size,
      6,
    );
    assert.equal(
      new Set(
        Object.values(overview.geometries).map((g) =>
          JSON.stringify(g.position),
        ),
      ).size,
      6,
    );
    assert.ok(Object.values(overview.geometries).every((g) => g.meshes >= 10));
    if (width === 1440) {
      await capture(page, "01-desktop-3d-overview");
      await capture(page, "sequence/000-overview");
      for (const [id, label] of destinations) {
        await page.getByRole("button", { name: "Reset world view" }).click();
        const reset = await settled(page);
        assert.ok(distance(reset.camera, overview.camera) < 0.05);
        assert.ok(distance(reset.target, overview.target) < 0.05);
        const point = await actualPick(
          page,
          id,
          id === "work"
            ? async () => capture(page, "sequence/001-work-hover")
            : undefined,
        );
        if (id === "work") {
          await capture(page, "sequence/002-work-flight");
          await page.waitForTimeout(250);
          await capture(page, "sequence/003-work-flight");
        }
        const focus = await settled(page, id);
        assert.ok(distance(focus.camera, overview.camera) > 4);
        assert.ok(distance(focus.target, overview.target) > 4);
        assert.ok(distance(focus.orientation, overview.orientation) > 0.01);
        assert.equal(focus.activePath, id);
        assert.equal(focus.picks.at(-1).type, "Mesh");
        assert.equal(
          await page
            .getByRole("heading", { name: `${label}.`, exact: true })
            .count(),
          1,
        );
        result.picks.push({
          id,
          point,
          camera: focus.camera,
          target: focus.target,
          orientation: focus.orientation,
          event: focus.picks.at(-1),
          geometry: focus.geometries[id],
        });
        if (id === "work") {
          await capture(page, "02-desktop-work-focus");
          const before = focus.target;
          await actualPick(page, "project-bi");
          await page.locator("dialog").waitFor({ state: "visible" });
          await page.waitForFunction((before) => {
            const p = window.__TRUNAL_SCENE__;
            return (
              p.flight === "settled" &&
              Math.hypot(...p.target.map((v, i) => v - before[i])) > 0.5
            );
          }, before);
          assert.equal(
            await page
              .locator("dialog")
              .getByRole("heading", {
                name: "Business Intelligence",
                exact: true,
              })
              .count(),
            1,
          );
          await capture(page, "sequence/004-project-terminal-detail");
          await page.keyboard.press("Escape");
          await page.locator("dialog").waitFor({ state: "hidden" });
          await settled(page, "work");
          await page
            .getByRole("button", { name: "Security", exact: true })
            .click();
          assert.equal(await page.locator(".terminal-card").count(), 1);
          await page
            .getByRole("button", { name: "All systems", exact: true })
            .click();
          assert.equal(await page.locator(".terminal-card").count(), 5);
          await page
            .getByRole("button", {
              name: "Read AI Revenue Recovery case study",
            })
            .click();
          await page.locator("dialog").waitFor({ state: "visible" });
          await page.keyboard.press("Tab");
          assert.equal(
            await page.evaluate(
              () => !!document.activeElement?.closest("dialog"),
            ),
            true,
          );
          await axe(page, "case-study dialog");
          await page.keyboard.press("Escape");
          await page.locator("dialog").waitFor({ state: "hidden" });
          assert.match(
            await page.evaluate(
              () => document.activeElement?.getAttribute("aria-label") || "",
            ),
            /Read AI Revenue Recovery/,
          );
          const blue = page.locator(".future-bay");
          await blue.scrollIntoViewIfNeeded();
          assert.equal(await blue.locator("a,button,img,video").count(), 0);
          assert.match(await blue.innerText(), /Carbon Credit Transfer System/);
          await capture(page, "07-blue-cred-placeholder");
        }
        if (id === "opensource") {
          assert.equal(await page.locator(".pr-group").count(), 2);
          assert.equal(await page.locator(".pr-row").count(), community.length);
          assert.ok(
            (await page.locator(".pr-totals").innerText()).includes(
              String(mergedCount),
            ),
          );
          await capture(page, "03-desktop-open-source-focus");
          await page
            .getByRole("combobox", { name: "Contribution state" })
            .selectOption("open");
          assert.equal(await page.locator(".pr-row").count(), openCount);
          await capture(page, "sequence/006-open-prs");
          await page
            .getByRole("searchbox", { name: "Search contributions" })
            .fill("PapaParse");
          assert.equal(await page.locator(".pr-row").count(), 4);
          await page
            .getByRole("searchbox", { name: "Search contributions" })
            .fill("not a real match");
          assert.equal(await page.locator(".pr-row").count(), 0);
          await page
            .getByRole("searchbox", { name: "Search contributions" })
            .fill("");
          await page
            .getByRole("combobox", { name: "Contribution state" })
            .selectOption("merged");
          assert.equal(await page.locator(".pr-row").count(), mergedCount);
          await capture(page, "sequence/007-merged-prs");
          await page
            .getByRole("combobox", { name: "Contribution state" })
            .selectOption("all");
          await axe(page, "PR station");
        }
        if (id === "journey") {
          await capture(page, "04-desktop-journey-focus");
          const before = focus.target;
          await page
            .getByRole("button", { name: /Learning the foundations/ })
            .click();
          await page.waitForFunction((before) => {
            const p = window.__TRUNAL_SCENE__;
            return (
              p.flight === "settled" &&
              Math.hypot(...p.target.map((v, i) => v - before[i])) > 1
            );
          }, before);
          result.checks.push("physical journey milestone focus");
        }
        if (id === "contact") {
          await page
            .getByRole("button", { name: "Copy email address", exact: true })
            .click();
          assert.match(
            await page.getByRole("status").last().innerText(),
            /copied|Copy unavailable/,
          );
        }
      }
      await page.getByRole("button", { name: "Reset world view" }).click();
      await settled(page);
      await page
        .getByRole("button", { name: "Explore Selected work", exact: true })
        .click();
      await page.waitForTimeout(120);
      await page
        .getByRole("button", { name: "Explore AI & data", exact: true })
        .click();
      await settled(page, "ai");
      assert.match(
        await page.locator("#station-title").innerText(),
        /AI & data/,
      );
      result.checks.push("mid-flight retarget");
      for (const [id, label] of destinations) {
        const button = page.getByRole("button", {
          name: `Explore ${label}`,
          exact: true,
        });
        await button.focus();
        await page.keyboard.press("Enter");
        await settled(page, id);
        await page.keyboard.press("Escape");
        await settled(page);
        assert.equal(
          await button.evaluate((el) => el === document.activeElement),
          true,
        );
      }
      await page.mouse.move(600, 230);
      await page.mouse.down();
      await page.mouse.move(700, 260, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(250);
      const dragged = await page.evaluate(() => window.__TRUNAL_SCENE__);
      assert.ok(distance(dragged.camera, overview.camera) > 0.1);
      await page.mouse.wheel(0, -300);
      await page.waitForTimeout(350);
      const zoomed = await page.evaluate(() => window.__TRUNAL_SCENE__);
      assert.ok(distance(zoomed.camera, dragged.camera) > 0.1);
      await page.getByRole("button", { name: "Reset world view" }).click();
      await settled(page);
      result.checks.push(
        "orbit, wheel zoom, six keyboard destinations, Escape, focus restoration",
      );
    } else {
      await capture(
        page,
        width === 390 ? "05-mobile-3d-or-lite" : `viewport-${width}`,
      );
      const labelBounds = await page
        .locator(".station-label")
        .evaluateAll((es) =>
          es.map((e) => {
            const r = e.getBoundingClientRect();
            return { left: r.left, right: r.right };
          }),
        );
      assert.ok(
        labelBounds.every((r) => r.left >= -2 && r.right <= width + 2),
        "Station label clipped",
      );
      await page
        .getByRole("button", { name: "Explore Selected work", exact: true })
        .click();
      await settled(page, "work");
      await page.getByRole("button", { name: "Security", exact: true }).click();
      assert.equal(await page.locator(".terminal-card").count(), 1);
      await page
        .getByRole("button", { name: "All systems", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Read CyberTwin AI case study" })
        .click();
      await page.locator("dialog").waitFor({ state: "visible" });
      await page.keyboard.press("Escape");
      await page.locator("dialog").waitFor({ state: "hidden" });
      await page.getByRole("button", { name: "Reset world view" }).click();
      await settled(page);
    }
    const violations = await axe(page, `${width}px overview`);
    await page.getByRole("button", { name: "2D", exact: true }).click();
    assert.equal(await page.locator(".fallback-campus").count(), 1);
    await page
      .getByRole("button", { name: "Explore Open source", exact: true })
      .click();
    assert.equal(await page.locator(".pr-row").count(), community.length);
    await axe(page, `${width}px 2D contribution panel`);
    assert.equal(errors.length, 0, errors.join("\n"));
    assert.equal(remote.length, 0, remote.join("\n"));
    assert.equal(failed.length, 0, failed.join("\n"));
    result.viewports.push({
      width,
      height,
      canvasArea: bounds.width * bounds.height,
      violations,
      errors,
      remote,
      failed,
    });
    await context.close();
  }
  const reduced = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const rp = await reduced.newPage();
  await rp.goto(base.href);
  await settled(rp);
  assert.equal(
    await rp
      .getByRole("button", { name: "3D", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await rp.goto(base.href + "#work/revenue-recovery");
  await rp.locator("dialog").waitFor({ state: "visible" });
  await rp.keyboard.press("Escape");
  await settled(rp, "work");
  await rp.getByRole("button", { name: "Reset world view" }).click();
  await settled(rp);
  await rp.getByRole("button", { name: "World preferences" }).click();
  assert.equal(
    await rp
      .getByRole("checkbox", { name: "Reduced motion", exact: true })
      .isChecked(),
    true,
  );
  await rp
    .getByRole("checkbox", { name: "Reduced motion", exact: true })
    .uncheck();
  await rp
    .getByRole("checkbox", { name: "Reduced motion", exact: true })
    .check();
  await rp.keyboard.press("Escape");
  result.checks.push("OS and manual reduced motion; direct case route");
  await reduced.close();
  const noGL = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  await noGL.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === "webgl" || type === "webgl2") return null;
      return original.call(this, type, ...args);
    };
  });
  const fp = await noGL.newPage();
  await fp.goto(base.href);
  await fp.locator(".fallback-campus").waitFor();
  await capture(fp, "06-no-webgl-fallback");
  await fp
    .getByRole("button", { name: "Explore Selected work", exact: true })
    .click();
  assert.equal(await fp.locator(".terminal-card").count(), 5);
  await axe(fp, "no-WebGL fallback work panel");
  result.fallback.push(
    "forced no-WebGL -> accessible map and working work panel",
  );
  await noGL.close();
  const loss = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  await loss.goto(base.href);
  await settled(loss);
  await loss.locator("canvas").dispatchEvent("webglcontextlost");
  await loss.locator(".fallback-campus").waitFor();
  result.fallback.push("context loss -> accessible map");
  await loss.close();
  result.status = "PASS";
  console.log(
    `PASS: ${result.viewports.length} viewports, ${result.picks.length} actual mesh station picks, project terminal, numerical camera/target/orientation, paths, reset, orbit/zoom, retarget, keyboard, content, PRs, Blue Cred, reduced motion, no-WebGL/context loss, axe, console and runtime network.`,
  );
} catch (error) {
  result.status = "FAIL";
  result.failure = error.stack;
  throw error;
} finally {
  await fs.writeFile(
    `${evidence}/browser-results.json`,
    JSON.stringify(result, null, 2),
  );
  await browser.close();
}
