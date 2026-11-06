# TRUNAL.OS

Trunal Patil's interactive engineering portfolio. The desktop experience is a seven-district 3D campus; smaller screens and reduced-motion devices get an accessible 2D index. Projects, skills, Nitrix experience, open-source contributions, education, achievements and contact are local content. No visitor API key, backend or paid runtime service is required.

## Run locally

Use Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Open the URL Vite prints (normally `http://127.0.0.1:5173/`).

## Verify

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

The built site is in `dist/`. `npm run preview` serves that build locally. `npm run test:browser` runs the 3D and media browser suites against a local production preview on port 4173; it uses installed Windows Chrome. The browser suite is not required for a Vercel build.

## Deploy manually on Vercel

Import this GitHub repository as a new Vercel project. The repository root is the project root. Use the **Vite** framework preset, **`npm run build`** as the build command and **`dist`** as the output directory. The checked-in `vercel.json` also specifies these values. No environment variables or paid API keys are needed. Deploy from the Vercel dashboard when you choose.

The portfolio uses hash routes (`/#projects`, `/#contact`), so no server rewrite is needed. `public/` assets, including the public-safe résumé PDF at `public/resume/Trunal_Patil_Resume_Public.pdf`, are copied into `dist/` by Vite. The build checks the résumé file's presence before showing its viewer button. The original private résumé is not in this repository.

## Content and provenance

The six project records and their explicit display order are in `src/content/projects.ts`: Blue Cred, Business Intelligence, AI Revenue Recovery, CyberTwin AI, AI Resume Analyser, Anumitra. Real project screenshots are in `public/project-media/`; the typed gallery registry is `src/content/project-media.ts`. The local, reviewed GitHub PR snapshot is `src/data/prs.generated.json`, with merged and open PRs displayed separately. The visitor app makes no GitHub API calls.

Editing guides and audit notes are in `docs/`. Earlier reports describe earlier milestones; `docs/CONTROLLED_UPGRADE_REPORT.md` is historical and predates the final résumé/order fix. The public résumé has its own generation script at `scripts/prepare-public-resume.py`; it needs the owner-supplied source PDF as an argument and redacts the private contact number before publication.
