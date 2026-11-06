import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import crypto from "node:crypto";

const root = process.env.PORTFOLIO_URL || "http://127.0.0.1:4173/";
const label = process.env.PORTFOLIO_LABEL || "local";
const output = "docs/resume-order-evidence";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const expected = ["blue-cred", "bi", "recovery", "cybertwin", "resume", "anumitra"];
const pdfUrl = new URL("resume/Trunal_Patil_Resume_Public.pdf", root).href;
const result = { root, pdfUrl, order: expected, checked: [], screenshots: [] };
let pdfBytes;

async function checkViewport(width, height) {
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 900 });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(root + "#projects");
  await page.locator(".project-story-preview").first().waitFor();
  assert.deepEqual(
    await page.locator(".project-story-preview").evaluateAll((items) => items.map((item) => item.dataset.project)),
    expected.slice(0, 4),
  );
  await page.locator(".project-discovery summary").click();
  await page.getByRole("button", { name: "All work", exact: true }).click();
  assert.deepEqual(
    await page.locator(".project-story-preview").evaluateAll((items) => items.map((item) => item.dataset.project)),
    expected,
  );
  await page.screenshot({ path: `${output}/${label}-projects-${width}.png` });
  result.screenshots.push(`${label}-projects-${width}.png`);
  await page.getByRole("button", { name: "Full Stack", exact: true }).click();
  assert.deepEqual(
    await page.locator(".project-story-preview").evaluateAll((items) => items.map((item) => item.dataset.project)),
    ["blue-cred", "bi", "recovery", "resume", "anumitra"],
  );
  await page.getByRole("button", { name: "AI", exact: true }).click();
  assert.deepEqual(
    await page.locator(".project-story-preview").evaluateAll((items) => items.map((item) => item.dataset.project)),
    ["bi", "recovery", "resume"],
  );
  await page.getByRole("button", { name: "Security", exact: true }).click();
  assert.deepEqual(
    await page.locator(".project-story-preview").evaluateAll((items) => items.map((item) => item.dataset.project)),
    ["cybertwin"],
  );
  await page.getByRole("button", { name: "All work", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search projects" }).fill("Anumitra");
  assert.deepEqual(
    await page.locator(".project-story-preview").evaluateAll((items) => items.map((item) => item.dataset.project)),
    ["anumitra"],
  );
  await page.goto(root + "#contact");
  const open = page.getByRole("button", { name: "View Résumé" });
  await open.waitFor();
  assert.equal(await open.isEnabled(), true);
  await page.screenshot({ path: `${output}/${label}-contact-${width}.png` });
  result.screenshots.push(`${label}-contact-${width}.png`);
  await open.click();
  const dialog = page.getByRole("dialog", { name: /Trunal Patil.*Résumé/ });
  await dialog.waitFor();
  const newTab = dialog.getByRole("link", { name: /Open in new tab/ });
  const download = dialog.getByRole("link", { name: "Download PDF" });
  assert.equal(new URL(await newTab.getAttribute("href"), page.url()).href, pdfUrl);
  assert.equal(await download.getAttribute("href"), await newTab.getAttribute("href"));
  assert.equal(await download.getAttribute("download"), "Trunal_Patil_Resume_Public.pdf");
  assert.equal(await newTab.getAttribute("target"), "_blank");
  const object = dialog.locator('object[type="application/pdf"]');
  assert.equal(await object.count(), width >= 900 ? 1 : 0);
  if (width >= 900) assert.equal(await object.getAttribute("data"), await newTab.getAttribute("href"));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${output}/${label}-viewer-${width}.png` });
  result.screenshots.push(`${label}-viewer-${width}.png`);
  const [popup] = await Promise.all([context.waitForEvent("page"), newTab.click()]);
  await popup.waitForLoadState("domcontentloaded");
  assert.equal(popup.url(), pdfUrl);
  await popup.waitForTimeout(1800);
  await popup.screenshot({ path: `${output}/${label}-pdf-tab-${width}.png` });
  result.screenshots.push(`${label}-pdf-tab-${width}.png`);
  await popup.close();
  result.checked.push(`${width}px: new-tab PDF opened`);
  if (width >= 900) {
    const [saved] = await Promise.all([page.waitForEvent("download"), download.click()]);
    assert.equal(saved.suggestedFilename(), "Trunal_Patil_Resume_Public.pdf");
    const downloaded = await fs.readFile(await saved.path());
    assert.equal(crypto.createHash("sha256").update(downloaded).digest("hex"), crypto.createHash("sha256").update(pdfBytes).digest("hex"));
    result.checked.push("New-tab PDF opened; Download PDF bytes match served public asset");
  }
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  assert.equal(await open.evaluate((element) => document.activeElement === element), true);
  assert.deepEqual(errors, []);
  result.checked.push(`${width}x${height}: complete order, filtered CyberTwin, Anumitra search, résumé controls, viewer, close/focus`);
  await context.close();
}

try {
  const pdf = await browser.newContext();
  const response = await pdf.request.get(pdfUrl);
  assert.equal(response.status(), 200);
  assert.match(response.headers()["content-type"], /^application\/pdf/);
  const bytes = await response.body();
  pdfBytes = bytes;
  assert.ok(bytes.length > 80_000 && bytes.subarray(0, 5).toString() === "%PDF-");
  result.checked.push(`PDF GET 200, application/pdf, ${bytes.length} bytes`);
  await pdf.close();
  await checkViewport(1440, 900);
  await checkViewport(390, 844);
  await fs.writeFile(`${output}/${label}-results.json`, JSON.stringify(result, null, 2));
  console.log("PASS", JSON.stringify(result.checked));
} finally {
  await browser.close();
}
