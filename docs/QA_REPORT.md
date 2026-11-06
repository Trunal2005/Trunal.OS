> Historical report retained. The later 2026-11-05 controlled upgrade is documented in [CONTROLLED_UPGRADE_REPORT.md](CONTROLLED_UPGRADE_REPORT.md) and [PROJECT_MEDIA_AUDIT.md](PROJECT_MEDIA_AUDIT.md). Earlier empty Blue Cred/contact gates are superseded by the owner’s new brief.

# QA report — 5 November 2026

**Historical report for the rejected split-screen build.** Current rebuild acceptance evidence and results are in `docs/3d-rebuild-report.md` and `docs/3d-rebuild-evidence/`. Passing results below are not presented as proof of the rebuilt art direction.

Environment: Windows, Node 20.19.4, npm 10.8.2, installed Google Chrome controlled by Playwright 1.64.1. Public network access was needed for npm/GitHub research. Sandboxed browser access to localhost failed (`ERR_NETWORK_ACCESS_DENIED`), then a server in the isolated network timed out. Starting preview and Chrome with permitted local network access resolved this. No paid browser service or downloaded browser was used.

## Executed checks and outputs

| Command | Actual result |
|---|---|
| `npm run typecheck` | Exit 0, TypeScript strict |
| `npm run lint` | Exit 0 after fixing missing browser-global declarations in QA scripts |
| `npm test` | 3 files passed, 16 tests passed; latest recorded run 1.28 seconds |
| `npm run build` with `VITE_BASE_PATH=/TrunalOS-portfolio/` | Exit 0; static production artifact generated |
| `npm run sync:prs` | Exit 0; 23 verified PRs saved: 17 merged, 6 open |
| `node scripts/audit-previous.mjs` | 3 old-site viewports returned HTTP 200; screenshots, DOM text and network evidence saved |
| `node scripts/verify-sources.mjs` / `inspect-details.mjs` | Five featured public repos verified; manifests/source selected; featured upstream PR bodies/states checked |
| `TEST_URL=http://127.0.0.1:4173/TrunalOS-portfolio/ npm run test:browser` | PASS at 1440×900, 768×1024, 390×844, 320×780 |
| `TEST_URL=http://127.0.0.1:4173/TrunalOS-portfolio/ node scripts/world-test.mjs` | PASS: 3D focus/reset, context-loss fallback, clipboard feedback; no page errors or console warnings |
| `node scripts/performance-test.mjs` | Actual local paint/transfer measurements below |
| `node scripts/render-social.mjs` | Original SVG rendered to public/og.png, 1200×630 |
| `node scripts/final-smoke.mjs` | PASS: manual reduced motion also uses instant hash-route scrolling; AI station filters correctly; final PNG/favicon/robots return 200; case-study deep link/Escape work; WebGL-disabled desktop renders the actual network diagram |

PowerShell equivalents for TEST_URL and VITE_BASE_PATH are in README. Test scripts use the actual local production preview, not a deployed website. No deployment success is claimed.

## Browser assertions

At all four widths: no horizontal overflow; correct heading; Blue Cred contains no links; project filters change actual cards; native dialog opens and keyboard focus stays within it on Tab; Escape closes it; open-only PR view yields 6 records; PapaParse search yields 4 open records; no-match search produces an empty state; 2D switch and reset work. Axe with WCAG 2 A/AA, 2.1 AA and 2.2 AA tags reported **zero violations** at all four sizes. No page errors, failed requests or third-party runtime requests were observed in these flows.

Separate paths: OS reduced motion starts in 2D; direct case-study hash opens correctly; no-WebGL content remains accessible. 3D test renders real WebGL through Chrome software rasterization, disables motion before comparing focus changes, checks selection text and reset, dispatches context loss and confirms the diagram fallback. Clipboard succeeds or gives explicit fallback feedback. Native dialog focus restoration is implemented; full physical keyboard/screen-reader review remains advisable.

Unit checks: Blue Cred all-null/empty detail contract; curated repository allowlist; exact PR author/merged timestamp/URL; PR dedupe; no unsupported test metrics; closed-unmerged rejection; open-state validation; malicious text treated as data; capped/incomplete/malformed page rejection; multi-page collection through both groups; early failure/empty-page handling; no numerical claim before successful sync; historical snapshot label; escaped HTML/script in rendered PR titles.

## Measured performance

Single local Chromium production samples, 2D mode with reduced motion, no external services. Desktop 1440px unthrottled: **LCP 484 ms, CLS 0**. Mobile 390px with **4× CPU, 150 ms latency, 200,000 B/s download (~1.6 Mbps)**: **LCP 2,032 ms, CLS 0**. The first mobile sample returned no LCP entry; the script was corrected to bring the page forward, force a real frame capture and wait for an entry. Missing measurements now report null, never a misleading zero. See performance-results.json.

Production approximate gzip budgets: initial JS 83.57 KB; CSS 6.14 KB; optional 3D JS 250.63 KB; local PNG social image 39.2 KB (not loaded by the portfolio UI). Performance resource evidence confirms the 3D chunk is absent from 2D loading. Vite warns that the uncompressed 3D chunk exceeds 500 KB; it remains intentionally lazy-loaded and is ~925 KB raw. No heavy model/textures or remote fonts. DPR cap, offscreen pause, demand rendering for stationary reduced-motion scenes and narrow-screen 2D defaults reduce work.

No Lighthouse score, real-user INP, physical GPU FPS, battery measurement or WCAG certification is claimed. Local lab results do not establish field performance. Real mobile devices, touch navigation, screen readers, orientation and low-memory hardware remain owner/manual review items.

## Evidence and boundaries

`docs/evidence/browser-results.json`, `world-results.json`, `performance-results.json`, `source-verification.json`, `featured-pr-review.json`, `previous-audit.json`, viewport screenshots and world screenshots. Public source manifests/tree hashes support descriptions; third-party project tests/backends, live Gemini compatibility and payment execution were not run. The résumé transcription was reviewed; no local PDF was available. No private PDF, phone, keys or personal tokens are bundled.

Old initial full-page screenshots have scroll-reveal blanks; see the audit's explicit limitations. Social/canonical absolute URLs and sitemap depend on final approved deployment domain. No push, commit, deployment or competition submission occurred. See competition-readiness.md for owner actions.

Final follow-up: a smoke-test locator initially timed out because the station accessible name includes its number; using the visible station text fixed the selector, and the same check passed. Manual reduced-motion routing was corrected to consult the explicit UI preference as well as the OS preference. Final lint/typecheck/unit/build all passed; the focused production smoke check passed after that change. The full four-viewport suite and performance sample preceded this small preference fix and PNG metadata addition; their scope is recorded above rather than represented as an additional full rerun.
# Current QA: Round 3

Current selective media pass: see `PROJECT_MEDIA_REPORT.md` and `project-media-evidence/` for final command logs, real production screenshots and the combined district/media regression results. Existing tests are preserved; media-specific tests extend them. Earlier evidence below remains historical.

The earlier reports below are historical. Current commands, results, fresh production screenshots and measured limits are in `round3-redesign-report.md` and `round3-evidence/`. Round 3 replaces six-station and mobile-default-3D assumptions with seven real destinations and content-first mobile. Automated results never imply owner visual approval.
