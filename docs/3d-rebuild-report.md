# TRUNAL.OS — strict immersive rebuild

## Visual result and evidence

The rejected split-screen homepage has been replaced. The initial desktop view is a full-viewport perspective WebGL campus, with a dimensional central engine, six grounded architectural destinations, routed illuminated floor circuits, anchored names and a compact HUD. There is no large résumé column or scrolling card homepage. Content appears in contextual drawers after selection. Every required screenshot below is from the running local **production build**, not a mockup.

| Evidence | File |
|---|---|
| Clean desktop overview, 1440×900 | `3d-rebuild-evidence/01-desktop-3d-overview.png` |
| Actual Work mesh selection and close focus | `3d-rebuild-evidence/02-desktop-work-focus.png` |
| Open Source focus and verified snapshot | `3d-rebuild-evidence/03-desktop-open-source-focus.png` |
| Readable filtered contribution details | `3d-rebuild-evidence/03-open-pr-details.png`, `03-merged-pr-details.png` |
| Physical milestone walk and Journey content | `3d-rebuild-evidence/04-desktop-journey-focus.png` |
| Real simplified mobile 3D, 390×844 | `3d-rebuild-evidence/05-mobile-3d-or-lite.png` |
| Forced WebGL failure, accessible map | `3d-rebuild-evidence/06-no-webgl-fallback.png` |
| Empty Blue Cred reservation | `3d-rebuild-evidence/07-blue-cred-placeholder.png` |

These seven required images were opened and visually examined, as were phase renders, project details and intermediate compositor frames. The phase-one camera was rejected internally as too small/dark; framing, material lighting, routing and labels were revised. Portrait clipping was found by looking at screenshots and corrected. This is internal visual review; only the owner can give final subjective approval.

## Scene and interaction proof

| Destination | World position | Architecture |
|---|---|---|
| Work | −7, 0, 2.5 | Three server racks, visible slots/LEDs and five individual case-study terminals |
| AI + Data | −5, 0, −6.2 | Processing tanks, stages and connected pipeline |
| Networks | 4.5, 0, −5.5 | Router/switch assembly, antenna and observation array |
| Open Source | 7, 0, 2 | Branching contribution pylons and exchange platform |
| Journey | 1.5, 0, 7 | Ascending walk with three milestone beacons and separate milestone focuses |
| Contact | −6, 0, 8 | Communications dish, mast and terminal |

Overview camera is [20, 20, 25], target [0, 0.2, 1]. Each station has a distinct camera destination and target. For example, AI lands at [2, 7, 4], target [−5, 1, −6.2]; Networks at [13, 7, 4], target [4.5, 1, −5.5]. Tests assert changes to **position, target and quaternion**, not just a hash. Final numerical traces and real Mesh hit events are in `3d-rebuild-evidence/browser-results.json`. All six were clicked through projected visible geometry using ordinary mouse input, not by invoking navigation functions. A real Work terminal was also clicked and opened its case study with a closer camera pose.

Raycast event propagation stops at the selected physical assembly. Decorative contact shading, signal dots and selection corners do not act as invisible pick targets. Hover changes cursor, feedback and corner illumination. Selection increases the physical route's light/width. Hardware ambient detail includes bounded core rotation, packets, pipeline/branch signals, milestone pulses and dish movement. Drag orbits, wheel zooms, right-drag pans within limits; Reset, Overview, Escape and semantic destination buttons provide alternatives. New selections safely retarget an in-progress flight. Hash links restore station/case focus.

`flight-recording.json` and `sequence/flight-*.jpg` contain actual Chrome compositor frames plus timestamped sampled camera state, including intermediate `moving` states. Additional sequence frames cover a case opening/closing, reset and merged/open PR filters. Early sequential screenshots missed the short flight; the compositor capture was added to prove movement rather than mislabeling settled screenshots as animation.

## Preservation and content

The original implementation is archived in `.local/backups/pre-immersive-20261105.zip`. There was no Git repository; none was initialized, committed, pushed or deployed. The original source and scripts remain recoverable.

The project registry and PR snapshot are **byte-identical** to their archived originals:

- projects.ts SHA-256: `3f9dfbae3cf42333a7baca35cde888c29d591a1aea01f156f30d4674a59fc2b6`.
- prs.generated.json SHA-256: `a2c570e5cf1a354f165c43475b899081fa9d9c961d7464c1d8249ca89ee3dbf4`.

Five documented prototypes plus the reserved Blue Cred entry remain. Blue Cred has no stack, repository, demo, media, feature claims or metrics; its typed all-null/empty contract remains tested. All 23 stored PRs were independently rechecked against public GitHub search metadata during this rebuild: **17 merged, 6 open**, no state changes or additional records returned. Counts in the application and browser expectations derive from the dataset. No visitor fetch, token or automatic refresh was introduced. See preservation.json and pr-state-recheck.json.

LinkedIn, credential verification and a public-safe résumé still require owner evidence. No private phone or unredacted PDF was added. Project backend behavior and published project test counts remain qualified as documented, not independently executed by this portfolio audit.

## Executed validation

- `npm run typecheck`: passed under strict TypeScript.
- `npm run lint`: passed, zero errors.
- `npm test`: **20 passed in 4 files**; all prior 16 retained, plus four spatial contracts.
- `npm run build`: passed. Vite's >500 KB raw optional 3D chunk warning remains disclosed.
- `npm run test:browser`: **PASS** at 1440×900, 1280×800, 768×1024, 390×844 and 320×780. At every size: real default 3D, no horizontal overflow, no page/console errors, no failed resources or third-party runtime requests, and zero axe WCAG A/AA violations in tested overview/fallback contribution states. Additional dialog/PR accessibility checks passed.
- Six actual mesh picks, numerical camera/target/orientation movement, terminal case focus, route state, reset, orbit/zoom, mid-flight retargeting, all six keyboard destinations, Escape/focus restoration, project filters, PR state/search/empty states, Blue Cred, direct links and reduced-motion checks passed.
- Forced no-WebGL and dispatched context loss both retain working content through the accessible map. Reduced motion keeps static 3D and equivalent content; 2D remains an explicit choice. No display preference is persisted.
- `node scripts/final-smoke.mjs` against `http://127.0.0.1:4174/TrunalOS-portfolio/`: **PASS** for subpath assets, 3D Journey deep link, 2D Work, project dialog and Escape.

The full five-viewport suite preceded an isolated small-height/landscape media rule and corresponding camera-panel adjustment. Those branches do not activate at its five fixture sizes. Focused final checks **passed** at 844×390 and 320×568, including visible nav/panel bounds and zero axe violations; see final-extra-results.json. An axe API error from using an implicit context was fixed by creating an explicit context; a redundant breadcrumb hidden under the short-screen panel was removed from that selected layout. The subpath smoke check was made to wait for the asynchronous Work route before counting cards. No acceptance assertion was dropped to make a failure pass.

Other repaired failures: initial malformed sphere geometry arguments; React Strict Mode nested-root warnings from Drei HTML (replaced by a single projected DOM label layer); frame-rate-dependent camera timing; portrait clipping; software-GPU screenshot timeout; inactive dimmed 2D controls exposed to assistive technology (now inert/hidden while a drawer is active). Historical failed attempts remain described rather than claimed as passes.

## Performance, quality and ₹0 boundary

Original procedural geometry, one shared box geometry/material cache, instanced floor markers, a simple original contact-shade shader, capped DPR, static shadow updates, demand rendering, hidden-tab pause and narrow-screen quality tiers keep the scene local. Software renderers automatically select low power: real geometry and smooth camera-flight logic remain; continuous ambient animation and expensive shadows stop. Owners can change this preference. The same adaptive behavior ships to visitors; screenshot tests do not substitute a different scene.

Final local production lab samples using software WebGL: desktop HTML LCP 604 ms, scene/overview pose ready 1,851 ms, CLS 0; 390px with 4× CPU, 150 ms latency and ~1.6 Mbps: HTML LCP 1,252 ms, scene/pose ready 4,274 ms, CLS 0. Data-saver 2D: HTML LCP 264 ms, ready 721 ms, CLS 0. Resource transfers excluding the main HTML were approximately 352 KB for 3D and 96 KB for data-saver 2D. Canvas pixels are not measured by LCP; scene readiness is therefore recorded separately. These are single-run lab samples, not Lighthouse scores, field INP or hardware GPU FPS guarantees. Current raw 3D chunk is ~938 KB / ~256 KB gzip; initial JS ~84 KB gzip and CSS ~11 KB gzip.

No dependencies or paid assets were added. Existing React/Three/R3F/Drei and tooling licences are unchanged. No API key, credit, card, subscription, hosted backend, paid runner or cloud billing is required. All runtime requests stayed on the local origin in the tested production flows. No push, deployment, account creation or contest submission occurred. ZERO_COST_AUDIT.md and ATTRIBUTIONS.md are updated.

## Limits and owner review

The scene is deliberately stylized procedural architecture, not photorealistic purchased assets. Physical phone touch, hardware GPU playback, low-memory devices, screen readers and field responsiveness still need manual testing. The reference exposed Enter and then a black rendered view in local Chrome; further reference interactions could not be honestly assessed. Owner visual approval remains outstanding. Final domain SEO metadata, credentials/LinkedIn, safe résumé and any deployment/submission remain owner steps.

Run `npm run dev` and open Vite's local URL (normally http://127.0.0.1:5173/). Use a fresh root URL for the overview; existing `#journey` links intentionally open the Journey focus. To reproduce production checks, run `npm run build`, start `npm run preview -- --port 4173`, then run the browser/performance scripts from another terminal. No publication command is invoked by these steps.
