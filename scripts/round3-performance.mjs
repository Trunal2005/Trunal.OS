import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const results = [];
try {
  for (const scenario of [
    "desktop-3d",
    "mobile-index",
    "data-saver-index",
    "low-memory-index",
  ]) {
    const mobile = scenario === "mobile-index";
    const c = await browser.newContext({
        viewport: mobile
          ? { width: 390, height: 844 }
          : { width: 1440, height: 900 },
      }),
      p = await c.newPage();
    if (scenario === "data-saver-index")
      await c.addInitScript(() =>
        Object.defineProperty(navigator, "connection", {
          value: { saveData: true },
          configurable: true,
        }),
      );
    if (scenario === "low-memory-index")
      await c.addInitScript(() =>
        Object.defineProperty(navigator, "deviceMemory", {
          value: 2,
          configurable: true,
        }),
      );
    const cdp = await c.newCDPSession(p);
    if (mobile) {
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: 200000,
        uploadThroughput: 90000,
      });
    }
    await p.addInitScript(() => {
      window.__metrics = { lcp: null, cls: 0 };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__metrics.lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput) window.__metrics.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const start = Date.now();
    await p.goto(process.env.TEST_URL || "http://127.0.0.1:4173/", {
      waitUntil: "domcontentloaded",
    });
    await p.locator("#identity-title").waitFor();
    const htmlReadyMs = Date.now() - start;
    if (scenario === "desktop-3d")
      await p.waitForFunction(
        () => document.querySelector("canvas")?.dataset.flight === "settled",
      );
    else await p.locator(".portfolio-index").waitFor();
    const viewReadyMs = Date.now() - start;
    await p.waitForTimeout(500);
    results.push({
      scenario,
      htmlReadyMs,
      viewReadyMs,
      throttle: mobile ? "4x CPU, 150ms latency, 200000 B/s download" : null,
      ...(await p.evaluate(() => ({
        ...window.__metrics,
        resources: performance
          .getEntriesByType("resource")
          .map((r) => ({ url: r.name, transferBytes: r.transferSize })),
        sceneLoaded: !!document.querySelector("canvas"),
      }))),
    });
    await c.close();
  }
} finally {
  await browser.close();
  await fs.writeFile(
    `${process.env.EVIDENCE_DIR || "docs/project-media-evidence"}/performance-results.json`,
    JSON.stringify(
      {
        measured: new Date().toISOString(),
        environment:
          "Windows Chrome headless / software WebGL / local static production server; lab samples, not field/Core Web Vitals certification",
        results,
      },
      null,
      2,
    ),
  );
}
console.log(
  results.map(
    ({ scenario, htmlReadyMs, viewReadyMs, lcp, cls, sceneLoaded }) => ({
      scenario,
      htmlReadyMs,
      viewReadyMs,
      lcp,
      cls,
      sceneLoaded,
    }),
  ),
);
