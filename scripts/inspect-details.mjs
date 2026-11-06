import fs from "node:fs/promises";
const selected = {
  "ai-revenue-recovery": [
    "src/domain/policy/EligibilityPolicy.ts",
    "src/server/razorpay/webhookVerifier.ts",
    "src/server/razorpay/webhookIngestionService.ts",
  ],
  "Ai-resume-analyser": ["main.py", "Analyse_pdf.py"],
  CyberTwinAi: ["backend/main.py"],
  Anumitra: [],
};
for (const [repo, paths] of Object.entries(selected)) {
  const evidence = JSON.parse(
    await fs.readFile(`docs/evidence/${repo}-source-raw.json`, "utf8"),
  );
  for (const path of paths) {
    const url = `https://raw.githubusercontent.com/Trunal2005/${repo}/${evidence.sha}/${path}`;
    const r = await fetch(url);
    if (r.ok)
      evidence.files.push({
        path,
        url,
        content: (await r.text()).slice(0, 30000),
      });
    console.log(repo, path, r.status);
  }
  await fs.writeFile(
    `docs/evidence/${repo}-source-raw.json`,
    JSON.stringify(evidence, null, 2),
  );
}
const prs = [];
for (const path of [
  "python-poetry/poetry/pulls/11141",
  "chhavikant03/Civic-Connect/pulls/49",
  "VarshithReddy2006/DevTrack/pulls/26",
]) {
  const r = await fetch(`https://api.github.com/repos/${path}`, {
    headers: { "User-Agent": "TrunalOS-local-review" },
  });
  if (r.ok) {
    const d = await r.json();
    prs.push({
      url: d.html_url,
      author: d.user.login,
      title: d.title,
      mergedAt: d.merged_at,
      body: d.body,
    });
  }
}
await fs.writeFile(
  "docs/evidence/featured-pr-review.json",
  JSON.stringify(prs, null, 2),
);
