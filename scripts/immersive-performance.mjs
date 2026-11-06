import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const results = [];
try {
  for (const mode of ["desktop-3d", "mobile-3d", "data-saver-2d"]) {
    const mobile = mode === "mobile-3d";
    const context = await browser.newContext({
      viewport: mobile
        ? { width: 390, height: 844 }
        : { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.bringToFront();
    if (mode === "data-saver-2d")
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "connection", {
          configurable: true,
          value: { saveData: true },
        });
      });
    const cdp = await context.newCDPSession(page);
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
    await page.addInitScript(() => {
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
    await page.goto(process.env.TEST_URL || "http://127.0.0.1:4173/", {
      waitUntil: "networkidle",
    });
    if (mode !== "data-saver-2d")
      await page.waitForFunction(
        () => document.querySelector("canvas")?.dataset.flight === "settled",
        {},
        { timeout: 45000 },
      );
    else await page.locator(".fallback-campus").waitFor();
    const worldReadyMs = Date.now() - start;
    await page.screenshot({
      path: `docs/3d-rebuild-evidence/performance-${mode}.png`,
    });
    await page.waitForTimeout(250);
    const metrics = await page.evaluate(() => ({
      ...window.__metrics,
      transferBytes: performance
        .getEntriesByType("resource")
        .reduce((sum, r) => sum + r.transferSize, 0),
      resources: performance
        .getEntriesByType("resource")
        .map((r) => ({ name: r.name, bytes: r.transferSize })),
      mode: document.querySelector(".os-shell")?.className,
    }));
    results.push({
      scenario: mode,
      mobileThrottle: mobile
        ? "4x CPU, 150ms latency, 200000 B/s download"
        : null,
      worldReadyMs,
      ...metrics,
    });
    await context.close();
  }
} finally {
  await browser.close();
  await fs.writeFile(
    "docs/3d-rebuild-evidence/performance-results.json",
    JSON.stringify(results, null, 2),
  );
}
console.log(results);
