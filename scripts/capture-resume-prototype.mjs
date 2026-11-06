import { chromium } from "playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const blocked = [],
  requests = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.route("**/*", (route) => {
    const url = route.request().url();
    requests.push(url);
    if (!url.startsWith("http://127.0.0.1:5331/")) {
      blocked.push(url);
      return route.abort();
    }
    return route.continue();
  });
  await page.goto("http://127.0.0.1:5331/", { waitUntil: "networkidle" });
  await page
    .locator("#job_description")
    .fill(
      "Demonstration role: Python, Flask, SQL and clear technical communication. Synthetic capture only.",
    );
  assert.equal(await page.locator("#api_key").inputValue(), "");
  await page.screenshot({ path: ".local/project-media/raw/resume-upload.png" });
  await page
    .locator("#resume")
    .setInputFiles(".local/project-media/demo-candidate.pdf");
  await page.getByRole("button", { name: /Analyze Resume/ }).click();
  await page.locator(".result-section").waitFor();
  const result = await page.locator(".result-section").innerText();
  assert.match(result, /API Key is missing/);
  await page.screenshot({
    path: ".local/project-media/raw/resume-keyless-result.png",
  });
  await fs.writeFile(
    ".local/project-media/resume-capture.json",
    JSON.stringify(
      {
        at: new Date().toISOString(),
        source: "5529bf987591c7c52702854544c54d78b3ed9cbf",
        capture:
          "Unmodified disposable Flask source; no .env copied; keys cleared; dotenv disabled",
        fixture: "Synthetic Demo Candidate; no personal data",
        requests,
        blocked,
        result,
        publicAsset:
          "Upload/JD form only; no successful model output is claimed",
      },
      null,
      2,
    ),
  );
  console.log(
    "Captured actual upload/JD UI; verified missing-key gate with synthetic PDF. No remote browser request.",
  );
} finally {
  await browser.close();
}
