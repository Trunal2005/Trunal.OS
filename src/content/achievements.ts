import snapshot from "../data/prs.generated.json";
export interface Achievement {
  id: string;
  title: string;
  category: "community" | "hackathon";
  summary: string;
  proofUrl: string | null;
  date: string | null;
  verified: boolean;
  visible: boolean;
  source: string;
}
const stories: Record<string, { title: string; summary: string }> = {
  "python-poetry/poetry#11141": {
    title: "An upstream fix in Poetry",
    summary:
      "Clean up indirect dependency-group references while preserving unrelated empty groups.",
  },
  "chhavikant03/Civic-Connect#49": {
    title: "More consistent complaint workflows",
    summary:
      "Commit a complaint transition and its notification together instead of leaving partial updates.",
  },
  "VarshithReddy2006/DevTrack#26": {
    title: "Concurrency-aware completion handling",
    summary:
      "Admit challenge completion side effects once when requests overlap.",
  },
};
export const achievements: Achievement[] = [
  ...snapshot.items
    .filter((p) => stories[p.id] && p.state === "merged" && p.mergedAt)
    .map((p) => ({
      id: p.id,
      title: stories[p.id].title,
      category: "community" as const,
      summary: stories[p.id].summary,
      proofUrl: p.url,
      date: p.mergedAt,
      verified: true,
      visible: true,
      source: "GitHub PR snapshot; merged status verified",
    })),
  {
    id: "hackathon-finalist",
    title: "2x National-Level Hackathon Finalist",
    category: "hackathon",
    summary: "Owner résumé claim; official event/result evidence pending.",
    proofUrl: null,
    date: null,
    verified: false,
    visible: true,
    source: "Latest owner résumé transcription",
  },
];
export const publicAchievements = achievements.filter(
  (a) => a.verified && a.visible && a.proofUrl,
);
