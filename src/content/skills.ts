export type SkillCategoryId =
  "frontend" | "backend" | "ai" | "data" | "tools" | "networks";
export const skillCategories = [
  {
    id: "frontend",
    name: "Frontend",
    kicker: "Interfaces people can use",
    flow: ["Input", "Component", "Feedback"],
    description:
      "Responsive interfaces, explicit state and meaningful feedback. A polished interaction starts with readable, accessible HTML.",
    evidence: "bi",
    color: "#b6abf2",
  },
  {
    id: "backend",
    name: "Backend & APIs",
    kicker: "Contracts before complexity",
    flow: ["Request", "Validation", "Response"],
    description:
      "Structured APIs, validated inputs and deliberate permissions. Keep the domain rules explainable and separate from presentation.",
    evidence: "cybertwin",
    color: "#99d8e1",
  },
  {
    id: "ai",
    name: "AI & ML",
    kicker: "Intelligence within boundaries",
    flow: ["Context", "Policy", "Decision"],
    description:
      "LLM-assisted workflows and classical ML, with deterministic boundaries around model output. Concepts explored are labelled separately from repository use.",
    evidence: "recovery",
    color: "#c4afe8",
  },
  {
    id: "data",
    name: "Data & databases",
    kicker: "From messy inputs to useful structure",
    flow: ["Ingest", "Profile", "Query"],
    description:
      "Dataset handling, relational storage and analytical context. A model should say when its assumptions do not fit.",
    evidence: "bi",
    color: "#8bccc1",
  },
  {
    id: "tools",
    name: "Tools & testing",
    kicker: "Change with a reason",
    flow: ["Change", "Test", "Review"],
    description:
      "Source control, regression tests and reviewable fixes. Public repositories and upstream contributions make the work inspectable.",
    evidence: "recovery",
    color: "#cbdcb8",
  },
  {
    id: "networks",
    name: "Networks",
    kicker: "Observe before you infer",
    flow: ["Replay", "Observe", "Model"],
    description:
      "Traffic replay and graph-based investigation through CyberTwin AI. Research and simulation are not claims of production network protection.",
    evidence: "cybertwin",
    color: "#9bbce8",
  },
] as const;
export interface Skill {
  name: string;
  category: SkillCategoryId;
  evidenceProjectIds: string[];
  evidenceLevel: "repository-documented" | "resume-listed" | "concept-explored";
  verified: boolean;
  visible: boolean;
  application: string;
}
const used = (
  name: string,
  category: SkillCategoryId,
  ids: string[],
  application: string,
): Skill => ({
  name,
  category,
  evidenceProjectIds: ids,
  evidenceLevel: "repository-documented",
  verified: true,
  visible: true,
  application,
});
const listed = (
  name: string,
  category: SkillCategoryId,
  application: string,
  concept = false,
): Skill => ({
  name,
  category,
  evidenceProjectIds: [],
  evidenceLevel: concept ? "concept-explored" : "resume-listed",
  verified: false,
  visible: true,
  application,
});
export const skills: Skill[] = [
  used(
    "React",
    "frontend",
    ["bi", "anumitra"],
    "Role-aware analytical and operational interfaces.",
  ),
  used(
    "TypeScript",
    "frontend",
    ["bi", "recovery"],
    "Typed UI and domain boundaries.",
  ),
  used(
    "Next.js",
    "frontend",
    ["recovery"],
    "Recovery operations interface and API routes.",
  ),
  used("JavaScript", "frontend", ["resume"], "Web interface interactions."),
  used(
    "HTML & CSS",
    "frontend",
    ["resume"],
    "Flask-based résumé analysis interface.",
  ),
  used(
    "Tailwind CSS",
    "frontend",
    ["bi", "cybertwin"],
    "Repository-documented responsive styling.",
  ),
  used(
    "Python",
    "backend",
    ["bi", "cybertwin", "resume"],
    "Data services and PDF extraction.",
  ),
  used(
    "FastAPI",
    "backend",
    ["bi", "cybertwin"],
    "Typed local research and analytics APIs.",
  ),
  used("Flask", "backend", ["resume"], "PDF-to-analysis request flow."),
  used(
    "REST APIs",
    "backend",
    ["bi", "cybertwin"],
    "Explicit service contracts.",
  ),
  used(
    "Pydantic",
    "backend",
    ["bi", "cybertwin"],
    "Structured request and response validation.",
  ),
  used(
    "JWT / permissions",
    "backend",
    ["bi"],
    "Repository-documented authentication and role boundaries.",
  ),
  used(
    "LLM applications",
    "ai",
    ["recovery", "resume"],
    "Model-assisted strategy or document analysis.",
  ),
  used(
    "Policy guardrails",
    "ai",
    ["recovery"],
    "Deterministic eligibility before strategy selection.",
  ),
  used(
    "scikit-learn",
    "ai",
    ["bi", "cybertwin"],
    "Classical ML in local data/research workflows.",
  ),
  used(
    "Gemini integration",
    "ai",
    ["recovery", "resume"],
    "A dependency of those projects; never called by this portfolio.",
  ),
  listed(
    "RAG & LangChain",
    "ai",
    "Résumé-listed concepts; a specific public implementation is not asserted.",
    true,
  ),
  listed(
    "Supervised learning / decision trees",
    "ai",
    "Résumé-listed learning focus; no benchmark claim.",
    true,
  ),
  listed(
    "Prompt engineering",
    "ai",
    "Résumé-listed study of structured model interaction.",
    true,
  ),
  used(
    "PostgreSQL",
    "data",
    ["anumitra"],
    "Guarded approval workflow persistence.",
  ),
  used(
    "SQLite",
    "data",
    ["recovery", "cybertwin"],
    "Local recovery and research records.",
  ),
  used(
    "Pandas & NumPy",
    "data",
    ["bi", "cybertwin"],
    "Data handling and ML preparation.",
  ),
  used(
    "Data profiling",
    "data",
    ["bi"],
    "Dataset-aware analytics and compatibility checks.",
  ),
  listed(
    "MySQL",
    "data",
    "Listed in the owner résumé; no featured case is attributed.",
  ),
  listed(
    "Matplotlib",
    "data",
    "Listed in the owner résumé for data visualization.",
  ),
  listed(
    "Warehousing / star schemas",
    "data",
    "Documented academic architecture concepts.",
    true,
  ),
  used(
    "Git & GitHub",
    "tools",
    ["bi", "recovery"],
    "Versioned source and public upstream contributions.",
  ),
  used(
    "Vitest",
    "tools",
    ["recovery"],
    "Repository-documented regression tests; no project test-count claim.",
  ),
  used(
    "Testing & review",
    "tools",
    ["recovery", "anumitra"],
    "Explicit failure cases and reviewable workflow decisions.",
  ),
  used(
    "PCAP / traffic replay",
    "networks",
    ["cybertwin"],
    "Bounded offline replay, distinguished from live observations.",
  ),
  used(
    "NetworkX / graph models",
    "networks",
    ["cybertwin"],
    "Virtual topology and defense simulation.",
  ),
  used(
    "IDS / IPS concepts",
    "networks",
    ["cybertwin"],
    "Research scope; real kernel enforcement remains unverified.",
  ),
];
