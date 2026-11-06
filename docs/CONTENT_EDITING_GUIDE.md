# TRUNAL.OS content editing

The current Round 3 architecture is seven districts. `src/content/stations.ts` defines navigation, identity, colors and camera presets. `src/PortfolioApp.tsx` owns hash routing and renders semantic content. The canvas is an optional enhancement on mobile, reduced-motion, data-saver and low-memory devices. No content is fetched at runtime.

| Content | File | Publication rule |
| --- | --- | --- |
| Identity / contact | `src/content/profile.ts`, `links.ts` | Public email, LinkedIn and safe PDF require explicit clearance. Never add a phone. |
| Skills | `src/content/skills.ts` | Record scope, application and evidence project IDs. No percentage bars. |
| Professional roles | `src/content/experience.ts` | Describe real responsibilities. Never turn an employer into a coding project. |
| Case studies | `src/content/projects.ts` | Check canonical repository, contribution and prototype limits. |
| Education | `src/content/education.ts` | Expected graduation is explicit; grade stays null pending confirmation. |
| Achievements | `src/content/achievements.ts` | Only `visible && verified` with proof may render. |
| Certifications | `src/content/certifications.ts` | Only verified visible records with authorized proof URLs may render. |
| PRs | `src/data/prs.generated.json` | Generated dated snapshot; manual developer refresh only. |
| Featured PR stories | `src/content/featured-prs.ts` | Match real IDs and source-described problem, fix and tests. |

Read `round3-content-gap-audit.md` for source conflicts. The exact UNDP résumé was unavailable; the latest owner transcription governs, corroborated where possible by older local PDFs and the previous public portfolio. Private PDFs and redacted review renders live outside publishable assets. Cert names and hackathon claims are retained internally but hidden publicly pending proof.

After an edit run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. Start `npm run preview -- --port 4173` and run `npm run test:browser`; inspect fresh screenshots in `docs/round3-evidence`. Use `node scripts/performance-test.mjs` when loading/rendering changes. Tests cannot approve visual design. No automatic publishing or syncing; obtain owner approval before push/deploy.

## Blue Cred upgrade

Keep its existing all-null/empty contract and non-clickable reserved UI until the owner supplies real implementation details. Then verify a canonical public repository, actual scope, contribution, technology, authorized media and evidence. Replace nulls only with supported facts, update `placeholderOnly`/visibility deliberately, and revise the reservation contract test alongside those approved requirements. Do not invent a token model, stack, architecture, demo or result to fill the space. See `how-to-add-project.md`.

## Controlled upgrade supersession — 2026-11-05

The owner explicitly authorized promoting the existing Blue Cred record into a sourced prototype and publishing the exact email, LinkedIn and finalist self-description. Earlier empty/reserved Blue Cred and withheld-contact requirements in historical docs/reports are superseded for current implementation. Historical evidence is preserved. Current source of truth: `PROJECT_MEDIA_AUDIT.md`, `HOW_TO_ADD_ANUMITRA_SCREENSHOTS.md`, `HOW_TO_ADD_PUBLIC_RESUME.md` and `CONTROLLED_UPGRADE_REPORT.md`. The private résumé remains private; public PDF approval is still pending.
