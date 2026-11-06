import fs from "node:fs/promises";
import crypto from "node:crypto";
const bytes = await fs.readFile("src/data/prs.generated.json");
const snapshot = JSON.parse(bytes);
const live = [];
for (const state of ["merged", "open"]) {
  const q = `author:Trunal2005 type:pr is:${state}`;
  const r = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=100`,
    {
      headers: {
        "User-Agent": "TrunalOS-local-state-recheck",
        Accept: "application/vnd.github+json",
      },
    },
  );
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const data = await r.json();
  if (data.incomplete_results || data.total_count > 100)
    throw new Error("Incomplete comparison; no snapshot mutations");
  for (const p of data.items) {
    if (p.user.login !== "Trunal2005") throw new Error("Author mismatch");
    live.push({
      url: p.html_url,
      state,
      mergedAt: p.pull_request.merged_at ?? null,
    });
  }
  await new Promise((r) => setTimeout(r, 6500));
}
const changed = snapshot.items.filter(
  (p) =>
    !live.some(
      (n) =>
        n.url === p.url && n.state === p.state && n.mergedAt === p.mergedAt,
    ),
);
const added = live.filter((n) => !snapshot.items.some((p) => p.url === n.url));
const result = {
  checkedAt: new Date().toISOString(),
  snapshotSha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  recordsChecked: snapshot.items.length,
  changed,
  additionalPublicPrs: added,
};
await fs.writeFile(
  "docs/3d-rebuild-evidence/pr-state-recheck.json",
  JSON.stringify(result, null, 2),
);
console.log(result);
