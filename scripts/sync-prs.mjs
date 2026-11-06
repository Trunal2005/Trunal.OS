import fs from "node:fs/promises";
import { collectPrs } from "./pr-utils.mjs";
const output = new URL("../src/data/prs.generated.json", import.meta.url);
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "TrunalOS-public-snapshot",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (res.ok) return res.json();
    if ([403, 429].includes(res.status))
      throw new Error(
        `GitHub rate limit (${res.status}); retry after reset. No snapshot changes.`,
      );
    if (res.status < 500) throw new Error(`GitHub ${res.status}`);
    await delay(1000 * 2 ** attempt);
  }
  throw new Error("GitHub unavailable");
}
try {
  const items = await collectPrs(async (group, page) => {
    const q = `author:Trunal2005 type:pr is:${group}`;
    return get(
      `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=100&page=${page}&sort=updated&order=desc`,
    );
  }, delay);
  const snapshot = {
    lastVerifiedAt: new Date().toISOString(),
    source: "GitHub REST Search: author:Trunal2005 type:pr is:merged / is:open",
    items,
  };
  await fs.writeFile(
    new URL("../src/data/prs.generated.tmp", import.meta.url),
    JSON.stringify(snapshot, null, 2) + "\n",
  );
  await fs.rename(
    new URL("../src/data/prs.generated.tmp", import.meta.url),
    output,
  );
  console.log(`Verified ${snapshot.items.length} PRs. Snapshot saved.`);
} catch (error) {
  console.error(
    `Sync failed; last-known-good snapshot preserved. ${error.message}`,
  );
  process.exitCode = 1;
}
