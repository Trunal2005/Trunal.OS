export const featuredPrIds = [
  "python-poetry/poetry#11141",
  "chhavikant03/Civic-Connect#49",
  "VarshithReddy2006/DevTrack#26",
];
export const prSpotlights: Record<string, string> = {
  "python-poetry/poetry#11141":
    "Removing a dependency group could leave indirect references behind. This change cleans those chains while preserving unrelated empty groups.",
  "chhavikant03/Civic-Connect#49":
    "Keep a complaint transition and its notification in the same transaction, so a failed notification cannot leave a misleading partial update.",
  "VarshithReddy2006/DevTrack#26":
    "Use the actual reward result to admit daily-challenge side effects once when completion requests overlap.",
};
export const prStoryDetails: Record<string, { fix: string; tests: string }> = {
  "python-poetry/poetry#11141": {
    fix: "Recursively remove references to deleted dependency groups while retaining unrelated empty groups and cross-section definitions.",
    tests:
      "PR-described regression cases cover inclusion chains, shared-parent diamonds, declaration orders and project reloads.",
  },
  "chhavikant03/Civic-Connect#49": {
    fix: "Commit complaint transitions and notifications in one transaction, recheck stored eligibility and block overlapping page submissions.",
    tests:
      "PR-described cases inject notification failures, stale progression and overlapping submissions using simulated Firestore transactions; deployed rules remain unverified.",
  },
  "VarshithReddy2006/DevTrack#26": {
    fix: "Admit completion effects only when the XP processor actually awards the reward, then include the new completion in the response.",
    tests:
      "PR-described regression checks race overlapping authenticated reads, assert duplicate results and check fresh counts with disposable MongoDB.",
  },
};
