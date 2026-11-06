export interface ProjectMedia {
  view: "homepage" | "dashboard" | "primary-workflow" | "architecture";
  id: string;
  title: string;
  src: string;
  fallbackSrc: string;
  thumbnailSrc: string;
  fullSrc: string;
  kind: "real-ui" | "recorded-demo" | "architecture" | "concept";
  alt: string;
  caption: string;
  context: "seeded-demo" | "keyless-form";
  captureSource:
    "repo" | "local-demo" | "live-demo" | "owner-upload" | "authored-diagram";
  verifiedAt: string;
  sourceRepo: string;
  evidenceRef: string;
  width: number;
  height: number;
  fullWidth: number;
  fullHeight: number;
  featured: boolean;
}
const repos: Record<string, string> = {
  "blue-cred": "Blue-Cred",
  bi: "Autonomous-Business-Intellignece-Platform",
  recovery: "ai-revenue-recovery",
  cybertwin: "CyberTwinAi",
  anumitra: "Anumitra",
  resume: "Ai-resume-analyser",
};
function ui(
  project: string,
  name: string,
  title: string,
  size: [number, number],
  full: [number, number],
  alt: string,
  caption: string,
  source: ProjectMedia["captureSource"],
  ref: string,
): ProjectMedia {
  const path = `project-media/${project}/${name}`;
  return {
    view:
      project === "cybertwin" && name === "security-overview"
        ? "dashboard"
        : "primary-workflow",
    id: `${project}-${name}`,
    title,
    src: `${path}.webp`,
    fallbackSrc: `${path}.png`,
    thumbnailSrc: `${path}-thumb.webp`,
    fullSrc: `${path}-full.webp`,
    kind: "real-ui",
    alt,
    caption,
    context: project === "resume" ? "keyless-form" : "seeded-demo",
    captureSource: source,
    verifiedAt: "2026-11-05",
    sourceRepo: `https://github.com/Trunal2005/${repos[project]}`,
    evidenceRef: ref,
    width: size[0],
    height: size[1],
    fullWidth: full[0],
    fullHeight: full[1],
    featured: true,
  };
}
export const projectMedia: Readonly<Record<string, readonly ProjectMedia[]>> = {
  "blue-cred": [
    {
      ...ui(
        "blue-cred",
        "homepage",
        "Homepage",
        [1200, 750],
        [1440, 900],
        "Blue Cred homepage prototype interface.",
        "Actual repository homepage, matched against frontend/src/app/page.tsx. Marketing statements inside the image are prototype copy, not verified carbon impact or production transfers.",
        "repo",
        "357f05f682b917ea9879546bac463ed7d1317172 / assets/screenshots/homepage.png",
      ),
      view: "homepage",
    },
    {
      ...ui(
        "blue-cred",
        "marketplace",
        "Marketplace",
        [1200, 750],
        [1440, 900],
        "Blue Cred marketplace prototype interface.",
        "Repository marketplace UI \u00b7 demonstration listings and prices; VERIFIED badges belong to the prototype, not an independent environmental audit.",
        "repo",
        "357f05f682b917ea9879546bac463ed7d1317172 / assets/screenshots/marketplace.png",
      ),
      view: "primary-workflow",
    },
    {
      ...ui(
        "blue-cred",
        "impact",
        "Impact",
        [1200, 750],
        [1440, 900],
        "Blue Cred impact prototype interface.",
        "Repository impact UI \u00b7 illustrative chart and zero counters. Not evidence of actual issued credits or conservation impact.",
        "repo",
        "357f05f682b917ea9879546bac463ed7d1317172 / assets/screenshots/impact.png",
      ),
      view: "dashboard",
    },
    {
      ...ui(
        "blue-cred",
        "submit-project",
        "Submit Project",
        [1200, 917],
        [1440, 1100],
        "Blue Cred submit project prototype interface.",
        "Repository supplier form \u00b7 sample organization fields, empty contact fields. No live registration or wallet transaction performed.",
        "repo",
        "357f05f682b917ea9879546bac463ed7d1317172 / assets/screenshots/submit-project.png",
      ),
      view: "primary-workflow",
    },
  ],
  bi: [
    {
      ...ui(
        "bi",
        "home",
        "ABI homepage",
        [1200, 583],
        [1915, 930],
        "Bi application homepage with its initial navigation and primary entry action.",
        "Owner-supplied ABI homepage \u00b7 actual opening interface. Product copy describes the prototype, not independently validated production use.",
        "owner-upload",
        "owner-upload / screenshot supplied 2026-11-05; original capture 2026-10-22",
      ),
      view: "homepage",
    },
    ui(
      "bi",
      "dashboard",
      "Analytics dashboard",
      [1200, 833],
      [1440, 4075],
      "Business Intelligence dashboard with dataset filters, order metrics and delivery analytics.",
      "Actual dashboard detail · synthetic test dataset. The preview focuses on calculated metrics; enlarge for the complete original application capture.",
      "local-demo",
      "a564c85887b09aa28313479845bd471f927b2a5c / frontend/e2e/ui-design.spec.ts",
    ),
    ui(
      "bi",
      "dataset-manager",
      "Dataset workspace",
      [1200, 833],
      [1440, 1000],
      "Dataset Manager with folder and ZIP import controls and separate uploaded test bundles.",
      "Actual application · synthetic test bundles. Separate sources retain their own import status and schema.",
      "local-demo",
      "a564c85887b09aa28313479845bd471f927b2a5c / frontend/e2e/ui-design.spec.ts",
    ),
  ],
  recovery: [
    {
      ...ui(
        "recovery",
        "home",
        "Recovery homepage",
        [1200, 663],
        [1783, 985],
        "Recovery application homepage with its initial navigation and primary entry action.",
        "Repository homepage capture \u00b7 prototype interface. No payments or paid model calls were performed for this portfolio.",
        "repo",
        "7455b2b2753aebc86b548bb5c0c171c098cc0051 / docs/assets/home.png",
      ),
      view: "homepage",
    },
    ui(
      "recovery",
      "command-center",
      "Recovery command center",
      [1200, 663],
      [1783, 985],
      "Recovery operations interface showing policy stages, bounded strategy selection and a demo batch.",
      "Actual application · seeded simulation. All amounts and recovery states are demo data; no real money movement is claimed.",
      "repo",
      "7455b2b2753aebc86b548bb5c0c171c098cc0051 / docs/assets/command-center.png",
    ),
    ui(
      "recovery",
      "analytics",
      "Simulation analytics",
      [1200, 663],
      [1783, 985],
      "Recovery Analytics with simulated recovery funnel and failure categories.",
      "Actual application · simulated batch analytics. These figures describe the repository demo, not business outcomes.",
      "repo",
      "7455b2b2753aebc86b548bb5c0c171c098cc0051 / docs/assets/analytics.png",
    ),
  ],
  cybertwin: [
    ui(
      "cybertwin",
      "security-overview",
      "Security research overview",
      [807, 1200],
      [1264, 1880],
      "CyberTwin security overview with monitoring stopped, simulated observations and enforcement disabled.",
      "Actual application · simulation workspace with monitoring stopped and enforcement disabled. Enlarge for the complete captured page.",
      "repo",
      "017af9f202730fde7102bfe90340b08c2d27982c / docs/screenshots/overview.png",
    ),
    ui(
      "cybertwin",
      "network-replay",
      "Observed-traffic replay",
      [1200, 1178],
      [1440, 1413],
      "Network Digital Twin with replay timeline, observed endpoints and a modeled virtual topology.",
      "Actual application · test traffic replay and virtual topology. Modeled paths are not proof of attacker movement or real packet blocking.",
      "repo",
      "017af9f202730fde7102bfe90340b08c2d27982c / docs/screenshots/cn-observed-network.png",
    ),
  ],
  anumitra: [
    {
      ...ui(
        "anumitra",
        "home",
        "Anumitra homepage",
        [1200, 702],
        [1560, 912],
        "Anumitra application homepage with its initial navigation and primary entry action.",
        "Owner-supplied application homepage \u00b7 independent student prototype. Fictional institution.a@anumitra.test is a demonstration address; password field is empty. No official regulatory integration.",
        "owner-upload",
        "owner-upload / screenshot supplied 2026-11-05; original capture 2026-10-30",
      ),
      view: "homepage",
    },
    ui(
      "anumitra",
      "action-desk",
      "Regional action desk",
      [1200, 833],
      [1440, 1789],
      "Anumitra action desk with fictional review tasks, scoped responsibilities and demonstration deadlines.",
      "Actual application · fictional institutions and demo policies, not live regulatory records. Enlarge for the complete action desk.",
      "repo",
      "37984fad3b4983e7793a07c769d0fef1f59f2c66 / docs/evidence/operations-2026-10-30/full-3/overview-1440.png",
    ),
    ui(
      "anumitra",
      "evc-planner",
      "Expert-visit planner",
      [1200, 800],
      [1440, 960],
      "Expert-visit planner with fictional local appointments, eligible queue and scheduling controls.",
      "Actual application · fictional local reservations. Demo scheduling does not represent statutory appointments or an official deployment.",
      "repo",
      "37984fad3b4983e7793a07c769d0fef1f59f2c66 / docs/evidence/operations-2026-10-30/full-3/operations/evc-after.png",
    ),
  ],
  resume: [
    ui(
      "resume",
      "upload-workspace",
      "Upload and job-description form",
      [1200, 833],
      [1440, 1000],
      "AI Resume Analyser upload form with a synthetic job description and an empty API-key field.",
      "Actual upload/JD interface · synthetic example. Analysis requires a configured model service; this capture does not show generated feedback.",
      "local-demo",
      "5529bf987591c7c52702854544c54d78b3ed9cbf / main.py + Analyse_pdf.py",
    ),
  ],
};
export function isProjectMedia(value: unknown): value is ProjectMedia {
  if (!value || typeof value !== "object") return false;
  const m = value as Partial<ProjectMedia>;
  return (
    typeof m.src === "string" &&
    /^project-media\/[a-z0-9/-]+\.webp$/.test(m.src) &&
    typeof m.fallbackSrc === "string" &&
    /^project-media\/[a-z0-9/-]+\.png$/.test(m.fallbackSrc) &&
    typeof m.fullSrc === "string" &&
    /^project-media\/[a-z0-9/-]+\.webp$/.test(m.fullSrc) &&
    typeof m.thumbnailSrc === "string" &&
    /^project-media\/[a-z0-9/-]+\.webp$/.test(m.thumbnailSrc) &&
    typeof m.alt === "string" &&
    !!m.alt &&
    typeof m.caption === "string" &&
    typeof m.id === "string" &&
    typeof m.title === "string" &&
    typeof m.fullWidth === "number" &&
    m.fullWidth > 0 &&
    typeof m.fullHeight === "number" &&
    m.fullHeight > 0 &&
    typeof m.width === "number" &&
    m.width > 0 &&
    typeof m.height === "number" &&
    m.height > 0 &&
    ["real-ui", "recorded-demo", "architecture", "concept"].includes(
      m.kind ?? "",
    )
  );
}
export function usableProjectMedia(media: unknown): ProjectMedia[] {
  return Array.isArray(media) ? media.filter(isProjectMedia) : [];
}
export const mediaLabel = (kind: ProjectMedia["kind"]) =>
  ({
    "real-ui": "Actual application screenshot",
    "recorded-demo": "Recorded demo frame",
    architecture: "Architecture diagram",
    concept: "Concept illustration",
  })[kind];
export const mediaUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;
