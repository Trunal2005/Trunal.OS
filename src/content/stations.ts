import type { SkillCategoryId } from "./skills";
import { featuredPrIds } from "./featured-prs";
export type Vec3 = [number, number, number];
export const stations = [
  {
    id: "projects",
    label: "Projects",
    short: "PROJECTS",
    navLabel: "Projects",
    number: "01",
    position: [-6, 0, 0.1],
    accent: "#9ae4cd",
    description: "Build Foundry",
    camera: [2.3, 7.6, 10.8],
    target: [-6, 1, 0.1],
    shape: "open-control-hall",
    labelOffset: [0, 4.2, 0],
  },
  {
    id: "skills",
    label: "Skills Lab",
    short: "SKILLS",
    navLabel: "Skills",
    number: "02",
    position: [-4.8, 0, -5.5],
    accent: "#b8a7e5",
    description: "Technology Lab",
    camera: [-12, 8.6, 0.5],
    target: [-4.8, 1, -5.5],
    shape: "six-pod-workbench",
    labelOffset: [0, 4.3, 0],
  },
  {
    id: "experience",
    label: "Work Experience",
    short: "EXPERIENCE",
    navLabel: "Experience",
    number: "03",
    position: [3, 0, -5.3],
    accent: "#e7bd82",
    description: "Nitrix Studio",
    camera: [12, 7, 4.5],
    target: [3, 1.5, -5.3],
    shape: "creator-operations-studio",
    labelOffset: [0, 4.9, 0],
  },
  {
    id: "opensource",
    label: "Open Source",
    short: "OPEN SOURCE",
    navLabel: "Open source",
    number: "04",
    position: [6.6, 0, 0.3],
    accent: "#9cbfe0",
    description: "Contribution Exchange",
    camera: [15, 7.4, 10.5],
    target: [6.6, 1, 0.3],
    shape: "branching-contribution-bridge",
    labelOffset: [0, 3.9, 0],
  },
  {
    id: "about",
    label: "About & Education",
    short: "ABOUT & EDUCATION",
    navLabel: "About / Education",
    number: "05",
    position: [0.8, 0, 5.4],
    accent: "#bcc8ad",
    description: "The Learning Walk",
    camera: [9, 8, 16],
    target: [0.8, 0.7, 5.4],
    shape: "terraced-learning-walk",
    labelOffset: [0, 2.8, 0],
  },
  {
    id: "achievements",
    label: "Achievements & Certifications",
    short: "ACHIEVEMENTS",
    navLabel: "Achievements",
    number: "06",
    position: [6.7, 0, 6.2],
    accent: "#cbbf9a",
    description: "Evidence Tower",
    camera: [15, 8, 16.5],
    target: [6.7, 1.8, 6.2],
    shape: "credential-signal-tower",
    labelOffset: [0, 5.1, 0],
  },
  {
    id: "contact",
    label: "Contact",
    short: "CONTACT",
    navLabel: "Contact",
    number: "07",
    position: [-5.6, 0, 6.5],
    accent: "#98d5ca",
    description: "Connection Port",
    camera: [3, 6.8, 16.5],
    target: [-5.6, 1.2, 6.5],
    shape: "communication-terrace",
    labelOffset: [0, 3.7, 0],
  },
] as const;
export type StationId = (typeof stations)[number]["id"];
export const overview = {
  position: [18.5, 18.5, 24] as Vec3,
  target: [0, 0.6, 0.2] as Vec3,
};
export const projectOffsets: Record<string, Vec3> = {
  bi: [-1, 0.7, -0.6],
  recovery: [0.2, 0.7, -0.6],
  cybertwin: [1.3, 0.7, -0.6],
  anumitra: [-0.7, 0.7, 1],
  resume: [0.8, 0.7, 1],
  "blue-cred": [-2.3, 0.3, 4.3],
};
export const skillPodOffsets: Record<SkillCategoryId, Vec3> = {
  frontend: [-1.5, 0.7, 1],
  backend: [0, 0.7, 1],
  ai: [1.5, 0.7, 1],
  data: [-1.5, 0.7, -1],
  tools: [0, 0.7, -1],
  networks: [1.5, 0.7, -1],
};
export const studioStageOffsets: Record<string, Vec3> = {
  outreach: [-1.65, 0.9, 0.8],
  alignment: [-0.55, 0.9, 0.8],
  coordination: [0.55, 0.9, 0.8],
  analysis: [1.65, 0.9, 0.8],
};
export function canonicalStation(id: string | null): StationId | null {
  const aliases: Record<string, StationId> = {
    work: "projects",
    ai: "skills",
    networks: "skills",
    journey: "about",
  };
  return aliases[id ?? ""] ?? stations.find((s) => s.id === id)?.id ?? null;
}
export function getPose(
  id: StationId | "work" | "journey" | null,
  detail?: string | null,
) {
  const canonical = canonicalStation(id);
  const s = stations.find((s) => s.id === canonical);
  if (!s) return overview;
  if (canonical === "about" && detail?.startsWith("journey-")) {
    const i = Number(detail.slice(8));
    if (Number.isInteger(i) && i >= 0 && i < 3) {
      const target: Vec3 = [
        s.position[0] + [-1.6, 0, 1.6][i],
        0.7,
        s.position[2],
      ];
      return { target, position: [target[0] + 6, 5.5, target[2] + 8] as Vec3 };
    }
  }
  const prIndex = detail ? featuredPrIds.indexOf(detail) : -1;
  const offset =
    canonical === "projects" && detail
      ? projectOffsets[detail]
      : canonical === "skills" && detail
        ? skillPodOffsets[detail as SkillCategoryId]
        : canonical === "experience" && detail
          ? studioStageOffsets[detail]
          : canonical === "opensource" && prIndex >= 0
            ? ([
                [-1.25, 0, 1.25][prIndex],
                1.8 + prIndex * 0.7,
                -0.5 + prIndex * 0.45,
              ] as Vec3)
            : null;
  if (offset) {
    const target: Vec3 = [
      s.position[0] + offset[0],
      1.2,
      s.position[2] + offset[2],
    ];
    return {
      target,
      position: [
        target[0] + (canonical === "skills" ? -6 : 5),
        target[1] + 5.8,
        target[2] + (canonical === "skills" ? 6 : 7),
      ] as Vec3,
    };
  }
  return { position: [...s.camera] as Vec3, target: [...s.target] as Vec3 };
}
