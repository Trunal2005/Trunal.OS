import fs from "node:fs/promises";
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "TrunalOS-local-audit",
};
const repos = [
  "Autonomous-Business-Intellignece-Platform",
  "Business-Intellignece-Platform",
  "ai-revenue-recovery",
  "Ai-resume-analyser",
  "Anumitra",
  "CyberTwinAi",
  "StallGuard",
  "Arham",
];
for (const repo of repos) {
  const res = await fetch(
    `https://api.github.com/repos/Trunal2005/${repo}/readme`,
    { headers },
  );
  if (res.ok) {
    const data = await res.json();
    await fs.writeFile(
      `docs/evidence/${repo}.md`,
      Buffer.from(data.content, "base64"),
    );
  }
  console.log(repo, res.status);
}
const r = await fetch("https://api.github.com/users/Trunal2005", { headers });
if (r.ok)
  await fs.writeFile(
    "docs/evidence/profile-raw.json",
    JSON.stringify(await r.json(), null, 2),
  );
