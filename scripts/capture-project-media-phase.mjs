import { chromium } from "playwright";
import fs from "node:fs/promises";
import { settled } from "./scene-helpers.mjs";
await fs.mkdir("docs/project-media-evidence", { recursive: true });
const b = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  for (const width of [1440, 390]) {
    const p = await b.newPage({
      viewport: { width, height: width === 1440 ? 900 : 844 },
    });
    p.on("pageerror", (e) => console.log(e.message));
    await p.goto("http://127.0.0.1:4173/?qa=1#projects", {
      waitUntil: "networkidle",
    });
    if (width === 1440) await settled(p, "projects");
    await p.locator(".media-open img").first().waitFor();
    await p.waitForFunction(
      () => document.querySelector(".media-open img")?.complete,
    );
    await p.mouse.move(10, 80);
    await p.screenshot({
      path: `docs/project-media-evidence/phase-projects-${width}.png`,
    });
    await p
      .getByRole("button", {
        name: "Enlarge Business Intelligence screenshot: Analytics dashboard",
      })
      .click();
    await p.locator(".screenshot-lightbox").waitFor();
    await p.screenshot({
      path: `docs/project-media-evidence/phase-lightbox-${width}.png`,
    });
    await p.close();
  }
} finally {
  await b.close();
}
