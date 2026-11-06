import fs from "node:fs/promises";
const cases = [
  "Autonomous-Business-Intellignece-Platform",
  "ai-revenue-recovery",
  "Ai-resume-analyser",
  "Anumitra",
  "CyberTwinAi",
];
const results = [];
for (const name of cases) {
  const r = await fetch(`https://api.github.com/repos/Trunal2005/${name}`, {
    headers: { "User-Agent": "TRUNAL-OS-local-audit" },
  });
  if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`);
  const p = await r.json();
  results.push({
    name,
    status: r.status,
    canonical: p.html_url,
    private: p.private,
    archived: p.archived,
    checked: new Date().toISOString(),
  });
}
await fs.writeFile(
  "docs/round3-evidence/project-state-recheck.json",
  JSON.stringify(results, null, 2),
);
console.log(results);
