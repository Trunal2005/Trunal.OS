// Disposable QA harness: imports the actual production component, never public/ or dist/.
import fs from "node:fs/promises";
import { build } from "vite";
import react from "@vitejs/plugin-react";
await fs.mkdir(".local/resume-harness", { recursive: true });
await fs.writeFile(
  ".local/resume-harness/index.html",
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RÃ©sumÃ© viewer QA fixture</title><div id="root"></div><script type="module" src="/entry.tsx"></script></html>`,
);
await fs.writeFile(
  ".local/resume-harness/entry.tsx",
  `import React,{useState} from 'react';import {createRoot} from 'react-dom/client';import PortfolioApp from '../../src/PortfolioApp';import ResumeActions from '../../src/components/ResumeViewer';import {resolveResumeAsset} from '../../src/content/resume';import '../../src/styles.css';import '../../src/round3.css';import '../../src/project-media.css';function Fixture(){const [fallback,setFallback]=useState(false);return <><PortfolioApp/><aside style={{position:'fixed',zIndex:100,top:100,left:20,padding:16,background:'#1b2821',color:'#f0f3e8',maxWidth:340}} aria-label="Test-only résumé harness"><strong>TEST FIXTURE — not owner résumé</strong><p>This harness is excluded from the portfolio build.</p><label><input type="checkbox" checked={fallback} onChange={e=>setFallback(e.target.checked)}/>Force no inline PDF</label><ResumeActions asset={resolveResumeAsset(true,true)} forceNoInline={fallback}/></aside></>}createRoot(document.getElementById('root')!).render(<Fixture/>);`,
);
await build({
  configFile: false,
  root: ".local/resume-harness",
  base: "./",
  publicDir: false,
  plugins: [react()],
  define: { __PUBLIC_RESUME_EXISTS__: "false" },
  build: { outDir: "../resume-fixture-dist", emptyOutDir: true },
});
