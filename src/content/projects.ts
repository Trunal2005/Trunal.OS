import { projectMedia, type ProjectMedia } from "./project-media";
export type Category = "Full Stack" | "AI" | "Data" | "Systems" | "Security";
export interface Project {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: Category[];
  status: "shipped" | "prototype" | "in-development" | "reserved";
  projectType: string;
  mediaStatus:
    | "verified-existing-media"
    | "captured-from-running-prototype"
    | "owner-media-needed"
    | "no-real-UI-available";
  needsOwnerHero: boolean;
  featurePriority: number;
  tags: string[];
  shortDescription: string | null;
  problem: string | null;
  role: string | null;
  architecture: string | null;
  engineeringDecisions: string[];
  highlights: string[];
  verifiedMetrics: string[];
  challenges: string[];
  screenshots: string[];
  media: readonly ProjectMedia[];
  videos: string[];
  repositoryUrl: string | null;
  demoUrl: string | null;
  sourceEvidence: string[];
  lastVerifiedAt: string | null;
  displayed: boolean;
  placeholderOnly: boolean;
  needsVerification: string[];
}
const base = {
  status: "prototype" as const,
  mediaStatus: "verified-existing-media" as const,
  needsOwnerHero: false,
  role: "Student project development; individual responsibilities within team projects require confirmation.",
  verifiedMetrics: [],
  screenshots: [],
  media: [],
  videos: [],
  demoUrl: null,
  displayed: true,
  placeholderOnly: false,
  lastVerifiedAt: "2026-11-05",
  needsVerification: [
    "Independent clean-clone execution",
    "Individual contribution breakdown",
  ],
};
export const projects: Project[] = [
  {
    ...base,
    id: "bi",
    projectType: "Full-Stack Data Platform",
    media: projectMedia.bi,
    slug: "business-intelligence",
    name: "Business Intelligence",
    subtitle: "From raw data to reasoned insight",
    category: ["Full Stack", "AI", "Data"],
    featurePriority: 2,
    tags: ["React", "FastAPI", "SQLAlchemy", "scikit-learn"],
    shortDescription:
      "A dataset-aware analytics workspace that keeps private uploads, profiling and model compatibility in context.",
    problem:
      "Different datasets need different analytical assumptions. A dashboard should explain when a prediction does not apply.",
    architecture:
      "React + TypeScript interface → FastAPI and Pydantic → SQLAlchemy; SQLite locally, PostgreSQL as a documented target. Pandas and scikit-learn support the data workflow.",
    engineeringDecisions: [
      "Keep uploaded analytics independent of optional trained-model binaries.",
      "Return a reasoned Not Applicable state for incompatible data instead of inventing predictions.",
    ],
    highlights: [
      "Private CSV, spreadsheet and JSON dataset workflows",
      "Role-aware analysis and administration",
      "Deterministic fallback for optional AI",
    ],
    challenges: [
      "Serving models need separate local artifacts.",
      "The current repository differs from the older Next.js résumé description.",
    ],
    repositoryUrl:
      "https://github.com/Trunal2005/Autonomous-Business-Intellignece-Platform",
    sourceEvidence: [
      "https://github.com/Trunal2005/Autonomous-Business-Intellignece-Platform#readme",
    ],
  },
  {
    ...base,
    id: "recovery",
    projectType: "Guarded AI Workflow",
    media: projectMedia.recovery,
    slug: "revenue-recovery",
    name: "AI Revenue Recovery",
    subtitle: "Intelligence inside boundaries",
    category: ["Full Stack", "AI", "Systems"],
    featurePriority: 3,
    tags: ["Next.js", "TypeScript", "SQLite", "Gemini"],
    shortDescription:
      "A payment-recovery prototype that puts deterministic policy around AI strategy selection.",
    problem:
      "Failed-payment workflows need a clear boundary between choosing an action and proving that recovery actually happened.",
    architecture:
      "Next.js presentation and operations APIs → deterministic classification and policy → bounded Gemini strategy → executor → authenticated webhooks → SQLite audit records.",
    engineeringDecisions: [
      "Let the model choose only from permitted strategies.",
      "Use webhook verification as the boundary for recording recovery.",
    ],
    highlights: [
      "Policy checks before AI strategy selection",
      "Guardrails between decision and execution",
      "Traceable recovery and audit workflow",
    ],
    challenges: [
      "The project integrates Gemini and Razorpay; this portfolio invokes neither.",
      "No production transaction volume or independent test-count claim is made.",
    ],
    repositoryUrl: "https://github.com/Trunal2005/ai-revenue-recovery",
    sourceEvidence: [
      "https://github.com/Trunal2005/ai-revenue-recovery#readme",
    ],
  },
  {
    ...base,
    id: "cybertwin",
    projectType: "Network Research & Visualization",
    media: projectMedia.cybertwin,
    slug: "cybertwin-ai",
    name: "CyberTwin AI",
    subtitle: "Make network behaviour visible",
    category: ["Security", "Data", "Systems"],
    featurePriority: 4,
    tags: ["React", "FastAPI", "NetworkX", "Python"],
    shortDescription:
      "A local network research platform connecting replayed traffic, intrusion findings and a virtual defense model.",
    problem:
      "Network observations and simulated paths need to be distinguishable before they can support a useful investigation.",
    architecture:
      "React + TypeScript → FastAPI + SQLAlchemy → SQLite, with NetworkX, Pandas and scikit-learn supporting the research model.",
    engineeringDecisions: [
      "Start in simulation with monitoring stopped.",
      "Label uploaded traffic as replay and modeled paths separately from observations.",
    ],
    highlights: [
      "Traffic and PCAP replay workflows",
      "Graph-based defense simulation",
      "Evidence-linked investigation",
    ],
    challenges: [
      "Real kernel firewall enforcement is unverified.",
      "Simulation is not evidence of live-network protection.",
    ],
    repositoryUrl: "https://github.com/Trunal2005/CyberTwinAi",
    sourceEvidence: ["https://github.com/Trunal2005/CyberTwinAi#readme"],
  },
  {
    ...base,
    id: "anumitra",
    projectType: "Approval & Compliance Platform",
    media: projectMedia.anumitra,
    slug: "anumitra",
    name: "Anumitra",
    subtitle: "Every approval. Accounted for.",
    category: ["Full Stack", "Systems"],
    featurePriority: 6,
    tags: ["React", "PostgreSQL", "Workflow", "RBAC"],
    shortDescription:
      "An independent student prototype for approval and compliance workflows, built around explicit roles and evidence.",
    problem:
      "Multi-stage approvals need accountable transitions, permission checks and consistent records.",
    architecture:
      "Role-specific React workspaces → guarded API and background worker → PostgreSQL. A local adapter and fictional records support demonstrations.",
    engineeringDecisions: [
      "Separate fictional operational records from public reference profiles.",
      "Recheck permission, state and payload before committing an import.",
    ],
    highlights: [
      "Role-specific operational workspaces",
      "Evidence review and compliance ledger",
      "Guarded workflow transitions",
    ],
    challenges: [
      "No official AICTE deployment, endorsement or live integration.",
      "Team sign-off and authorized external integration remain pending.",
    ],
    repositoryUrl: "https://github.com/Trunal2005/Anumitra",
    sourceEvidence: ["https://github.com/Trunal2005/Anumitra#readme"],
  },
  {
    ...base,
    id: "resume",
    mediaStatus: "captured-from-running-prototype",
    projectType: "AI Document Prototype",
    media: projectMedia.resume,
    slug: "resume-analyser",
    name: "AI Resume Analyser",
    subtitle: "Read the match, not just the document",
    category: ["AI", "Full Stack"],
    featurePriority: 5,
    tags: ["Python", "Flask", "pypdf", "Gemini"],
    shortDescription:
      "A résumé-to-job-description prototype separating PDF extraction from model-dependent feedback.",
    problem:
      "A document parser and a language model serve different roles; the interface needs to make that distinction clear.",
    architecture:
      "Flask upload and job-description interface → pypdf extraction → Gemini analysis. This revision requires a key for analysis; the upload UI works without one.",
    engineeringDecisions: [
      "Remove the uploaded file after processing instead of retaining a résumé archive.",
      "Keep model-dependent analysis separate from PDF extraction.",
    ],
    highlights: [
      "PDF text extraction",
      "Job-description comparison",
      "Request-scoped upload cleanup",
    ],
    challenges: [
      "The current revision requires a configured model key for feedback. Only the upload interface is shown; live Gemini analysis was not run.",
      "Analysis scores are estimates, not hiring predictions.",
    ],
    repositoryUrl: "https://github.com/Trunal2005/Ai-resume-analyser",
    sourceEvidence: ["https://github.com/Trunal2005/Ai-resume-analyser#readme"],
  },
  {
    ...base,
    id: "blue-cred",
    slug: "blue-cred",
    name: "Blue Cred",
    subtitle: "Carbon Credit Transfer System",
    projectType: "Carbon Registry Prototype",
    category: ["Full Stack", "Systems"],
    featurePriority: 1,
    tags: ["Next.js", "TypeScript", "Solidity", "Appwrite"],
    shortDescription:
      "A blue-carbon registry prototype connecting project submissions, a marketplace interface and role-gated credit issuance code.",
    problem:
      "Carbon-project workflows need clear boundaries between submitting evidence, authorizing issuance and claiming a real-world outcome.",
    architecture:
      "Next.js 14 client with Appwrite integration and wallet libraries → Solidity ERC-1155 contract with AccessControl. Source reviewed; live deployment and environmental verification were not independently validated.",
    engineeringDecisions: [
      "Separate project-submission and verifier permissions in the contract.",
      "Track credits by project identifier with ERC-1155 rather than a single undifferentiated balance.",
      "Keep registry metadata and user-facing workflows separate from contract authorization.",
    ],
    highlights: [
      "Homepage and supplier onboarding interface",
      "Marketplace browsing and project registry UI",
      "Role-gated project submission and credit minting in contract source",
      "Administrator project-freeze function",
    ],
    challenges: [
      "Repository screenshots contain prototype marketing claims and demonstration listings; they do not establish verified carbon impact or real transfers.",
      "Wallet, Appwrite and network configuration are required for integrated execution. None were connected or billed during this portfolio work.",
      "Contract security, deployment and retirement claims require separate verification.",
      "Marketplace listings are demo records; search, filter and sort controls in this revision are presentational.",
    ],
    media: projectMedia["blue-cred"],
    repositoryUrl: "https://github.com/Trunal2005/Blue-Cred",
    sourceEvidence: [
      "https://github.com/Trunal2005/Blue-Cred/tree/357f05f682b917ea9879546bac463ed7d1317172",
      "https://github.com/Trunal2005/Blue-Cred/blob/357f05f682b917ea9879546bac463ed7d1317172/contracts/BlueCred.sol",
    ],
  },
];
export const editorialProjects = [...projects]
  .filter((p) => p.displayed)
  .sort((a, b) => a.featurePriority - b.featurePriority);
