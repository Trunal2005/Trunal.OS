import fs from "node:fs/promises";
import assert from "node:assert/strict";
const dir = "docs/round3-evidence",
  r = JSON.parse(await fs.readFile(`${dir}/browser-results.json`, "utf8")),
  p = JSON.parse(await fs.readFile(`${dir}/performance-results.json`, "utf8"));
assert.equal(
  r.status,
  "PASS",
  "Do not generate a successful report before the final browser suite passes.",
);
const row = (v) => v.map((n) => Number(n.toFixed(2))).join(", ");
const camera = r.picks
  .map(
    (x) =>
      `| ${x.id} | ${row(x.before.camera)} | ${row(x.after.camera)} | ${row(x.after.target)} |`,
  )
  .join("\n");
const perf = p.results
  .map(
    (x) =>
      `| ${x.scenario} | ${x.htmlReadyMs} ms | ${x.viewReadyMs} ms | ${x.lcp} ms | ${x.cls} | ${x.sceneLoaded ? "yes" : "no"} |`,
  )
  .join("\n");
const text = `# TRUNAL.OS — Round 3 redesign report

**AWAITING OWNER VISUAL APPROVAL.** This is a local implementation delivery, not an artistic acceptance, contest result or publication. No push, deployment, account creation, submission or spending occurred. Current browser run: ${r.started} through ${r.finished}.

## 1. Design verdict

The rejected six-station view put small structures on an oversized grid and subordinated the person to project categories. Skills had no standalone home, Nitrix lacked a professional presentation, and education/credentials were buried. The rebuild replaces that with a finite, layered campus in three geographic neighborhoods and seven distinct destinations; larger custom assemblies, restrained sage/violet/amber/blue identity, short camera flights and readable identity/navigation. Skills has a six-pod workbench and source-linked applications. Nitrix has an independent operations studio, role/date, four-stage workflow, responsibilities and transferable skills.

The final visual review found and corrected a Projects-roof obstruction in the Skills shot, a 320px index overflow and clipped neighboring edge-label fragments. Mobile/tablet now opens a complete HTML index; desktop remains a real explorable WebGL world. The architecture is deliberately stylized procedural geometry. Whether its art direction meets the owner's expectations remains for the owner to judge.

[Side-by-side before/after](round3-evidence/comparison.html) · [Screenshot gallery](round3-evidence/gallery.html). The before image is saved Round 2 evidence, not a new recreation of an unavailable owner upload.

## 2. Content coverage

| Category | Route | Source and publication status |
| --- | --- | --- |
| Skills | #skills / #skills/all | Six domains; repository-documented tools linked to case studies, résumé-only concepts explicitly distinguished. |
| Experience — Nitrix | #experience | Owner's latest résumé transcription; April 2026 local résumé and previous portfolio corroborate role/date. CMO, March 2025–Present; no disputed creator/client metrics. |
| Projects | #projects | Five existing public repository cases preserved; metadata URLs rechecked HTTP 200. Prototype limits and source vs independently executed evidence explicit. |
| PRs | #opensource | Preserved offline snapshot: 17 merged / 6 open, dated 5 Nov 2026. All 23 records rechecked with no changes/additions. Closed-unmerged explicitly not ingested, never merged. Three source-described problem/fix/tests stories. |
| Education | #about | B.Tech Computer Engineering, VIT Mumbai, Sep 2024–May 2028 expected. Numeric grade omitted due source conflict/clearance. |
| Achievements | #achievements | Three inspectable merged upstream milestones. Hackathon count hidden pending official evidence. |
| Certifications | #achievements | Four pending typed records, no fake earned badges. Clear empty state until authorized issuer proof. |
| About | #about | Student identity, interests and separate educational/project/community chronology. |
| Contact | #contact | Verified GitHub first; copy-link works. Email, LinkedIn and public-safe PDF withheld pending clearance. |
| Blue Cred | #projects, reserved bay | Exact all-null/empty record retained; no clickable feature, stack, repo, demo or media. |

The exact UNDP résumé was unavailable; the owner's supplied transcription governed. Three older local PDFs were privately reviewed, with redacted review renders kept under ignored .local. No PDF or phone is published. Previous-portfolio scroll/reveal content confirmed Nitrix; the reference reached a loading screen, and the Codrops article was blocked by 403/challenge. No reference assets/code/composition were copied. See [gap audit](round3-content-gap-audit.md) and [provenance](content-provenance.md).

## 3. Visual proof

All final-* images are genuine local **production Vite preview / Windows Chrome** screenshots, not image-generator mockups. The final desktop, category evidence, Nitrix, projects, PR filters, education/credentials, Blue Cred, phone, landscape and fallback views were opened and inspected after the final CSS/scene changes. Their manifest timestamps are in [browser results](round3-evidence/browser-results.json) and [additional delivery captures](round3-evidence/delivery-captures.json). Earlier phase-* images document intermediate review only.

- [Desktop overview](round3-evidence/final-desktop-overview.png)
- [Skills entrance](round3-evidence/final-desktop-skills.png), [Frontend](round3-evidence/final-skill-frontend-evidence.png), [Backend](round3-evidence/final-skill-backend-evidence.png), [AI](round3-evidence/final-skill-ai-evidence.png), [Data](round3-evidence/final-skill-data-evidence.png)
- [Nitrix role](round3-evidence/final-desktop-experience.png), [workflow](round3-evidence/final-nitrix-workflow.png), [responsibilities](round3-evidence/final-nitrix-responsibilities.png)
- [Project case](round3-evidence/final-project-case.png), [open PRs](round3-evidence/final-prs-open.png), [merged PRs](round3-evidence/final-prs-merged.png), [closed-unmerged limitation](round3-evidence/final-prs-closed-unmerged.png)
- [Education](round3-evidence/final-desktop-about.png), [achievements](round3-evidence/final-desktop-achievements.png), [Blue Cred](round3-evidence/final-blue-cred.png)
- [390px home](round3-evidence/final-mobile-390-home-viewport.png), [mobile Skills](round3-evidence/final-mobile-390-skills-viewport.png), [mobile Nitrix](round3-evidence/final-mobile-390-experience-viewport.png), [320px](round3-evidence/final-mobile-320-home-viewport.png), [landscape](round3-evidence/final-mobile-844-experience-viewport.png)
- [No WebGL](round3-evidence/final-no-webgl.png), [reduced motion](round3-evidence/final-reduced-motion-2d.png)

## 4. Functional and measured proof

Typecheck, ESLint, production build and **28 unit tests** passed. The original 20 tests remain, with the old six-station expectation adapted to seven; eight added tests cover content safety, standalone rendering and routes. The Round 2 browser sources are retained as history; current browser/world/performance entrypoints target Round 3. Build retains a warning for the lazy 3D chunk (~944 KB raw / 257 KB gzip); it is excluded from the default HTML index path.

Final production browser suite: seven actual station raycasts, all six skill pod picks, all four studio stage picks, three PR-node mappings and a project console. Numerical camera position/target/quaternion changes, interrupted flight retargeting, orbit/zoom, reset, seven keyboard routes, Escape/focus restoration, dialog focus, project filters/search, PR states/search, contact copying, direct links and Blue Cred safety were exercised. Viewports: 1440×900, 1280×800, 768×1024, 390×844, 320×780, 844×390. Touch Skills and Experience selection ran in browser emulation. All tested pages had no horizontal overflow and zero axe WCAG A/AA violations. Forced no-WebGL, context loss and reduced-motion 2D/opt-in instant 3D passed. Normal desktop runtime logged zero console/page errors, failed requests or third-party requests; responsive request checks also found no third-party traffic. Forced WebGL failure intentionally exercises the renderer error fallback.

| District | Overview camera x,y,z | Focus camera x,y,z | Focus target x,y,z |
| --- | --- | --- | --- |
${camera}

Full pick events and camera quaternions: [browser-results.json](round3-evidence/browser-results.json).

| Lab scenario | Identity ready | View ready | LCP sample | CLS sample | 3D loaded |
| --- | --- | --- | --- | --- | --- |
${perf}

Measured ${p.measured}. ${p.environment}. Mobile uses 4× CPU throttle, 150ms latency, 200,000 B/s download. Single samples vary with local CPU load. No Lighthouse score, field INP or hardware-GPU FPS is claimed. Automated checks and emulated touch do not replace physical-device, screen-reader or owner usability review. The public project backends, AI/payment integrations and PR test suites were not independently executed here. Static output pattern scan found no PDF, phone-contact or recognizable secret patterns; this is not a complete security audit.

## 5. Zero cost

₹0 incremental spend; **zero new packages**. Existing open-source dependency licenses are retained in docs/evidence/dependency-licenses.json and ATTRIBUTIONS.md. All new terrain, assemblies, panels and diagrams are original local code; system fonts only. No paid assets, APIs, keys, backend, external runtime content, credits, subscriptions, payment card, analytics or cloud billing. Only developer-side anonymous public GitHub verification ran. Static hosting remains a future owner-approved choice; nothing was activated. See [ZERO_COST_AUDIT](../ZERO_COST_AUDIT.md).

## 6. Open verifications

Owner review is still required for visual quality and current role wording/dates. LinkedIn URL, creator/brand counts and endorsements, hackathon claims, credential proofs/permissions, numeric academic results, public email and a redacted public-safe résumé remain pending. Unsupported values are omitted or hidden, not filled in. Project result/test numbers remain documentation-qualified until independently reproduced. The exact UNDP résumé can be reconciled later without blocking this safe subset.

## 7. Owner actions and maintenance

Local preview: http://127.0.0.1:5173/ . From C:/projects/TrunalOS-portfolio run **npm run dev -- --port 5173** if it is stopped. To reproduce production QA: **npm run build**, **npm run preview -- --port 4173**, then **npm run test:browser** in a second terminal. The QA preview server may be stopped after checks; the existing user development preview remains available.

Review the overview, Skills and Nitrix views first, then the mobile layout. Visual/content approval is the next decision. Push and deployment require separate explicit authorization and have not occurred. Update content using [CONTENT_EDITING_GUIDE](CONTENT_EDITING_GUIDE.md), [HOW_TO_ADD_SKILL](HOW_TO_ADD_SKILL.md), [HOW_TO_ADD_EXPERIENCE](HOW_TO_ADD_EXPERIENCE.md) and [project/Blue Cred steps](how-to-add-project.md).
`;
await fs.writeFile("docs/round3-redesign-report.md", text);
const images = (await fs.readdir(dir))
  .filter((n) => n.startsWith("final-") && n.endsWith(".png"))
  .sort();
await fs.writeFile(
  `${dir}/gallery.html`,
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRUNAL.OS final production screenshots</title><style>body{background:#151d1a;color:#edf1e6;font:16px system-ui;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}figure{margin:0;border:1px solid #45574b;padding:12px}img{width:100%;max-height:460px;object-fit:contain;object-position:top}figcaption{margin:12px 0}a{color:#c4b2e8}</style><h1>TRUNAL.OS — production screenshot proof</h1><p>AWAITING OWNER VISUAL APPROVAL. Captured from the actual final build; open each image for full resolution.</p><p><a href="comparison.html">Before / after comparison</a></p><main>${images.map((n) => `<figure><a href="${n}"><img src="${n}" alt="${n.replace("final-", "").replace(".png", "")}"></a><figcaption>${n}</figcaption></figure>`).join("")}</main></html>`,
);
console.log(
  `Wrote current report and gallery of ${images.length} final production screenshots.`,
);
