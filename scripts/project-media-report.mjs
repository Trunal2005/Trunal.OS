import fs from "node:fs/promises";
import assert from "node:assert/strict";
const dir = "docs/project-media-evidence";
const media = JSON.parse(
  await fs.readFile(`${dir}/media-browser-results.json`, "utf8"),
);
const world = JSON.parse(
  await fs.readFile(`${dir}/regression/browser-results.json`, "utf8"),
);
const assets = JSON.parse(
  await fs.readFile(`${dir}/media-provenance.json`, "utf8"),
);
assert.equal(media.status, "PASS");
assert.equal(world.status, "PASS");
const size = (n) => `${(n / 1024).toFixed(1)} KiB`;
const assetRows = assets
  .map(
    (a) =>
      `| ${a.project} / ${a.name} | ${a.previewSize.join("×")} | ${size(a.files.find((f) => f.path.endsWith("/" + a.name + ".webp")).bytes)} | ${size(a.files.find((f) => f.path.endsWith("-full.webp")).bytes)} |`,
  )
  .join("\n");
const transferRows = media.transfers
  .map((t) => `| ${t.scenario} | ${size(t.totalBytes)} | ${t.images.length} |`)
  .join("\n");
const text = `# Genuine prototype screenshots + selective final polish

Local implementation delivery — ${media.finished}. The owner has accepted the Round 3 direction as good; that seven-district design was preserved. **New media/polish awaits owner inspection. No winner-readiness, publication or artistic acceptance is self-certified.**

## 1. What was found

| Project | Source | Found/captured | Verified | Missing |
|---|---|---|---|---|
| Business Intelligence | Matching Autonomous repository/local HEAD a564c858; existing local Playwright output | Dashboard + dataset manager | Test source, synthetic fixtures, exact source hash/ref, manual privacy review | No committed images; local captures are not falsely called repo screenshots |
| AI Revenue Recovery | Public owner repo 7455b2b2 | Command center + analytics | Committed blob hashes; README simulation provenance; manual inspection | Private/sample-email detail image excluded; no real-payment outcome claimed |
| CyberTwin AI | Public owner repo 017af9f2 | Research overview + network replay | Committed blobs; explicit simulation/replay and modeled topology | Real firewall effectiveness not established |
| Anumitra | Public owner repo 37984fad | Regional action desk + EVC planner | Committed blobs; fictional institutions and demo-policy labels | No official deployment/endorsement claim |
| AI Resume Analyser | Unmodified disposable copy at source 5529bf98 | Genuine upload/JD interface | Browser capture, synthetic PDF and source-confirmed missing-key response | Successful analysis output; advertised keyless analysis is not implemented in this revision |
| Blue Cred | Owner reservation | No media | Empty/null contract and non-clickable UI | Intentionally empty future project |

The alternate Business-Intellignece-Platform endpoint returned 404 for metadata and tree. It was not silently equated with the distinct Autonomous implementation. No paid/live demo was needed. Source refs, licensing uncertainty, rejected candidates, privacy checks and exact crop rectangles: [PROJECT_MEDIA_INVENTORY](PROJECT_MEDIA_INVENTORY.md), [media-provenance.json](project-media-evidence/media-provenance.json). GitHub declares no license for these repositories; the Resume README's MIT assertion lacks a LICENSE file. Local owner-authorized use does not imply a general redistribution license.

## 2. What was implemented

- Nine real UI images across the five existing cases, locally encoded as WebP with PNG fallbacks, thumbnails and full originals. Only rectangular crop/resize/compression; no UI/results were painted in. Six committed images match their Git blob bytes, two are existing BI browser captures, and one is a new actual Flask form capture.
- Typed media records in src/content/project-media.ts and Project.media; strict local-path/shape guards and Blue Cred exclusion. Source metadata stays in local code/docs; no visitor GitHub/API/CDN fetch.
- ProjectGallery: semantic figures/captions, accurate type/context labels, active thumbnails, keyboard/touch enlarge, native modal with focus containment, Escape/restoration, arrow navigation, 100% zoom/panning and readable file-failure states. Full files load on enlargement; no destructive CSS crop of the displayed image.
- Three selected projects lead, with all five retained behind search/filter controls. Current source content/links and source-qualified engineering decisions remain available. Concepts moved into secondary Architecture detail.
- Projects heading separated from nested scrolling; mobile sticky heading offset, route scroll reset and case reopen scroll reset. Back/forward and nested screenshot/case Escape were verified. Nitrix's public internal-provenance badge removed; real role/date/story preserved without unsupported clients/counts.
- Header portrait appearance preserved with a 3,112-byte WebP derivative instead of the 961,634-byte runtime PNG. Package manifests unchanged. Seven districts, geometry, camera navigation, skills/experience data, contact privacy and the PR snapshot remain intact. Source-only formatting changes do not represent a world redesign.

Files: src/content/{project-media.ts,projects.ts}, src/components/{ProjectGallery.tsx,ProjectDetails.tsx,ProjectsPanel.tsx,ExperienceStudio.tsx}, src/PortfolioApp.tsx, src/main.tsx, src/project-media.css, public/project-media/**; supporting tests/scripts/docs. No original application repository was edited.

## 3. Production screenshots for inspection

These are **local Windows files**, not hosted public URLs; remote sharing requires uploading the files. [Gallery](project-media-evidence/gallery.html).

- [Default 3D overview](project-media-evidence/final-overview.png)
- [Projects with actual BI UI](project-media-evidence/final-projects-index.png)
- [Business Intelligence lightbox](project-media-evidence/final-bi-lightbox.png)
- [Recovery case](project-media-evidence/final-case-recovery.png), [actual Recovery UI enlarged](project-media-evidence/final-lightbox-recovery.png)
- [CyberTwin](project-media-evidence/final-lightbox-cybertwin.png), [Anumitra](project-media-evidence/final-lightbox-anumitra.png), [Resume form only](project-media-evidence/final-lightbox-resume.png)
- [Nitrix copy polish](project-media-evidence/final-nitrix-polish.png), [Open Source](project-media-evidence/final-opensource.png)
- [Phone Projects](project-media-evidence/final-projects-390.png), [phone 100% view](project-media-evidence/final-lightbox-390-zoom.png), [320px fallback](project-media-evidence/final-projects-320.png), [landscape zoom](project-media-evidence/final-lightbox-844-zoom.png)
- [Blue Cred](project-media-evidence/final-blue-cred.png), [failed-image fallback](project-media-evidence/final-image-failure.png)

Final production screenshots were opened and inspected after the final application/CSS changes. Review corrected a keyboard-scroll focus issue, modal Tab containment and inherited footer layout, while preserving the approved campus. Primary screenshot framing was changed to a genuine BI metrics detail, with the full original still inspectable. No AI/generated product picture was used. See [manual visual review](project-media-evidence/visual-review.json).

## 4. Missing owner media

Only a **successful Resume Analyser analysis-output image** remains missing. Its actual form is present, so the project is not hidden. If an authentic existing result capture or a genuinely working no-cost/keyless revision exists, capture the result pane using a synthetic Demo Candidate PDF and generic JD. Include the demo indicator/context; exclude real names, contacts, résumé details, keys/password fields and developer tools. Do not buy credits, create a key or fabricate an output. Without such evidence, retain the honest form-only case. Exact instructions are in PROJECT_MEDIA_INVENTORY.md.

## 5. Tests, measurements and limits

Final commands passed: npm run typecheck, npm run lint, npm test (**33 tests / 7 files**), npm run build, npm run test:browser (existing district regression **plus** new media suite), and the maintained final-smoke entrypoint. Command outputs are in this evidence folder. All earlier tests remain; five media unit tests were added. Existing browser filtering coverage was adapted to the new disclosure control, not removed.

District regression ${world.started} → ${world.finished}: seven real station raycasts, six skill pod picks, four studio stages, three actual PR mappings, numerical camera/target/quaternion movement, orbit/zoom/reset, keyboard/Escape/focus, dialogs, filtering/search, Blue Cred, six requested viewports, reduced motion, forced no-WebGL and context loss. Normal runtime has no failed/third-party requests or console/page errors.

Media suite ${media.started} → ${media.finished}: real media decoding, no primary concept, lazy full-file loading, thumbnail active state, keyboard enlarge/arrows, 100% image view, strict Tab containment, focus restoration, nested case/screenshot Escape, case scroll reset, browser back/forward, heading/toolbar separation, all five real cases, safe labels, PNG fallback and total-image-failure state. 1440×900, 1280×800, 390×844, 320×780 and 844×390 exercised; old regression also covers 768×1024. Tested media pages/lightboxes have zero axe A/AA violations and no horizontal overflow. Browser touch is emulation, not a physical phone test. Expected forced-image/WebGL failures are distinguished from normal runtime.

### Actual image budgets

| Asset | Preview dimensions | WebP preview | Full original WebP |
|---|---|---|---|
${assetRows}

All nine WebP previews total ${size(assets.reduce((n, a) => n + a.files.find((f) => f.path.endsWith("/" + a.name + ".webp")).bytes, 0))}; the largest is below 92 KB. All encoded variants together occupy about ${(assets.reduce((n, a) => n + a.files.reduce((s, f) => s + f.bytes, 0), 0) / 1000000).toFixed(2)} MB on disk, **not** first-load transfer. Full originals/PNG alternatives are not eagerly transferred. Measured Chrome resource image transfers before enlargement:

| Scenario | Transferred image bytes | Image requests |
|---|---|---|
${transferRows}

The small portrait is inlined by Vite, so its bytes contribute to JavaScript rather than separate image-resource entries. These are local lab samples; cache/device/network behavior varies. See media-browser-results.json and performance-results.json for raw resource/timing data. The lazy 3D chunk still produces Vite's size warning (~944 KB raw / 257 KB gzip). No hardware GPU FPS, Lighthouse score, field INP, screen-reader certification or physical-device approval is claimed. Other project backends/full test suites and live AI/payment integrations were not independently executed; the Resume form/missing-key path is the limited exception.

The PR JSON remains byte-identical (SHA-256 a2c570e5cf1a354f165c43475b899081fa9d9c961d7464c1d8249ca89ee3dbf4): 17 merged and 6 open as a dated snapshot; no casual refresh. Project registry hash intentionally changed for media and the corrected analysis scope. Static output has no private PDF/phone-contact/recognizable key patterns; this pattern scan is not a full security audit.

## 6. ₹0 audit

Zero new dependencies, accounts or paid services. Existing Chrome/Playwright, Python/Pillow, Flask/pypdf and the already installed source SDK were used locally. No model API request, API key, payment instrument, credit purchase, subscription, cloud billing or deployment was activated. Existing GitHub CLI access was read-only; no credentials were copied/stored. No .env/private PDF was copied. Original project repos remained read-only; demo execution occurred only in an ignored disposable copy. All final site content/media is static and same-origin. See ZERO_COST_AUDIT.md and ATTRIBUTIONS.md.

## 7. No publication

No push, deployment, submission, automatic commit, account or source change in any other repository. The portfolio still has no initialized Git history. The existing development preview remains http://127.0.0.1:5173/ ; restart from C:/projects/TrunalOS-portfolio with **npm run dev -- --port 5173** if needed. QA/demo servers owned by this pass are stopped after verification. Public release requires explicit owner approval.

## 8. Prioritized remaining contest actions

1. Owner review the actual UI evidence/captions and clear screenshot publication/licensing/contribution wording. Keep the Resume analysis gap explicit unless a genuine safe capture exists.
2. Test on a real phone, laptop GPU and keyboard/screen reader; inspect image zoom/panning, drawer headings, loading and 3D fallback beyond lab emulation.
3. Confirm public contact/LinkedIn, individual/team contribution boundaries and any sanitized résumé/credential/academic claims; leave unsupported content withheld.
4. After explicit approval, create a clean public portfolio repository with genuine future commits, source attribution, no secrets and a reproducible static build. Do not invent or rewrite history; verify free hosting eligibility before any authorized publication.
5. Owner verify current official ONEWHO/Unstop rules, prepare the required public/source/application URLs and submit before the brief's stated **15 November 2026, 11:59 PM IST** deadline. No submission or registration is implied. Preserve the contest freeze after authorized submission.
`;
await fs.writeFile("docs/PROJECT_MEDIA_REPORT.md", text);
const names = (await fs.readdir(dir))
  .filter((n) => n.startsWith("final-") && n.endsWith(".png"))
  .sort();
await fs.writeFile(
  `${dir}/gallery.html`,
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRUNAL.OS genuine media proof</title><style>body{background:#17231b;color:#edf2e5;font:16px Arial;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}figure{margin:0;padding:12px;border:1px solid #657c5c}img{width:100%;max-height:450px;object-fit:contain;object-position:top}figcaption{margin-top:12px}a{color:#d2e7bd}</style><h1>Actual final production captures</h1><p>Local Windows screenshot evidence. New media/polish awaits owner review; no competition result is claimed.</p><main>${names.map((n) => `<figure><a href="${n}"><img src="${n}" alt="${n}"></a><figcaption>${n}</figcaption></figure>`).join("")}</main></html>`,
);
console.log(`Wrote media report and ${names.length}-image evidence gallery.`);
