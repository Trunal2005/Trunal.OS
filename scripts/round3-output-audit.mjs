import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
async function files(dir) {
  return (
    await Promise.all(
      (await fs.readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory()
          ? files(path.join(dir, e.name))
          : [path.join(dir, e.name)],
      ),
    )
  ).flat();
}
const output = await files("dist"),
  findings = [];
for (const file of output) {
  assert.ok(
    !/\.(pdf|env|pem|key)$/i.test(file),
    `private/source file in output: ${file}`,
  );
  if (/\.(js|css|html|json|txt|xml)$/i.test(file)) {
    const text = await fs.readFile(file, "utf8");
    for (const [label, regex] of [
      ["phone contact", /["']tel:\+?[\d (]|\+91[ -]?\d{10}/],
      [
        "credential",
        /sk-proj-[A-Za-z0-9_-]{20}|ghp_[A-Za-z0-9]{30}|AIza[A-Za-z0-9_-]{30}/,
      ],
      [
        "remote resource element",
        /<(?:script|link)[^>]+(?:src|href)=["']https?:/i,
      ],
    ])
      if (regex.test(text)) findings.push({ file, label });
  }
}
assert.deepEqual(findings, []);
const hashes = {};
for (const file of ["src/content/projects.ts", "src/data/prs.generated.json"])
  hashes[file] = crypto
    .createHash("sha256")
    .update(await fs.readFile(file))
    .digest("hex");
// Project registry now intentionally adds verified media and corrects the
// source-disproven keyless-analysis claim. Content/unit tests protect identities
// with explicitly authorized Blue Cred promotion; the PR snapshot remains byte-preserved.
assert.equal(
  hashes["src/data/prs.generated.json"],
  "a2c570e5cf1a354f165c43475b899081fa9d9c961d7464c1d8249ca89ee3dbf4",
);
const report = {
  at: new Date().toISOString(),
  status: "PASS",
  scope:
    "Pattern scan of static output; not a complete security audit. No PDF/phone-contact/recognizable credential patterns or remote HTML script/font resource elements. Runtime network checked separately in browser suite.",
  files: output,
  findings,
  preservedHashes: hashes,
  registryChange:
    "Verified prototype media and accurate résumé-analysis scope; see PROJECT_MEDIA_INVENTORY.md. Original Round 3 project hash: 3f9dfbae3cf42333a7baca35cde888c29d591a1aea01f156f30d4674a59fc2b6",
};
await fs.writeFile(
  `${process.env.EVIDENCE_DIR || "docs/project-media-evidence"}/output-audit.json`,
  JSON.stringify(report, null, 2),
);
console.log(report);
