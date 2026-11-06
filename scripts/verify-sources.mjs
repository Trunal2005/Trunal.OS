import fs from "node:fs/promises";
const repos = [
  "Autonomous-Business-Intellignece-Platform",
  "ai-revenue-recovery",
  "CyberTwinAi",
  "Anumitra",
  "Ai-resume-analyser",
];
const metadata = JSON.parse(
  await fs.readFile("docs/evidence/repos-raw.json", "utf8"),
);
const report = [];
for (const repo of repos) {
  const meta = metadata.find((r) => r.name === repo);
  const sha = meta.default_branch;
  const res = await fetch(
    `https://api.github.com/repos/Trunal2005/${repo}/git/trees/${sha}?recursive=1`,
    { headers: { "User-Agent": "TrunalOS-local-audit" } },
  );
  if (!res.ok) {
    report.push({ repo, status: res.status });
    continue;
  }
  const tree = await res.json();
  const paths = tree.tree.filter((f) => f.type === "blob").map((f) => f.path);
  const candidates = paths.filter(
    (p) =>
      /((policy|guardrail|webhook|dataset|flow|permission|app)\.(py|ts)|package\.json|requirements\.txt)$/.test(
        p,
      ) && !p.includes("node_modules"),
  );
  const files = [];
  for (const path of candidates.slice(0, 4)) {
    const r = await fetch(
      `https://raw.githubusercontent.com/Trunal2005/${repo}/${sha}/${path}`,
    );
    if (r.ok) {
      const content = await r.text();
      files.push({ path, url: r.url, content: content.slice(0, 18000) });
    }
  }
  await fs.writeFile(
    `docs/evidence/${repo}-source-raw.json`,
    JSON.stringify(
      { repo, sha: tree.sha, truncated: tree.truncated, paths, files },
      null,
      2,
    ),
  );
  report.push({
    repo,
    sha: tree.sha,
    truncated: tree.truncated,
    inspected: files.map((f) => f.path),
    status: 200,
  });
}
await fs.writeFile(
  "docs/evidence/source-verification.json",
  JSON.stringify(report, null, 2),
);
console.log(report);
