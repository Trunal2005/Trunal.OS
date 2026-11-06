import { describe, it, expect } from "vitest";
import { projects } from "./projects";
import snapshot from "../data/prs.generated.json";
describe("public content contracts", () => {
  it("migrates Blue Cred once to a sourced prototype without impact or production claims", () => {
    const entries = projects.filter((p) => p.id === "blue-cred");
    expect(entries).toHaveLength(1);
    const p = entries[0];
    expect(p.slug).toBe("blue-cred");
    expect(p.status).toBe("prototype");
    expect(p.placeholderOnly).toBe(false);
    expect(p.repositoryUrl).toBe("https://github.com/Trunal2005/Blue-Cred");
    expect(p.media[0].view).toBe("homepage");
    expect(p.highlights).toHaveLength(4);
    expect(p.highlights.join(" ")).not.toMatch(
      /searchable|verified carbon impact|production/i,
    );
    expect(p.challenges.join(" ")).toContain("presentational");
    expect(p.verifiedMetrics).toEqual([]);
    expect(p.demoUrl).toBeNull();
    expect(p.shortDescription).not.toMatch(
      /production|verified carbon impact|real transfers/i,
    );
    expect(p.challenges.join(" ")).toMatch(
      /do not establish verified carbon impact/,
    );
  });
  it("publishes only audited repository identities", () => {
    const approved = [
      "Autonomous-Business-Intellignece-Platform",
      "ai-revenue-recovery",
      "CyberTwinAi",
      "Anumitra",
      "Ai-resume-analyser",
      "Blue-Cred",
    ];
    expect(
      projects.filter((p) => !p.placeholderOnly).map((p) => p.repositoryUrl),
    ).toEqual(approved.map((p) => `https://github.com/Trunal2005/${p}`));
    for (const p of projects.filter((p) => !p.placeholderOnly)) {
      expect(p.sourceEvidence.length).toBeGreaterThan(0);
      expect(p.lastVerifiedAt).toBeTruthy();
      expect(p.demoUrl).toBeNull();
    }
  });
  it("never counts closed unmerged contributions as merged", () => {
    for (const p of snapshot.items) {
      expect(p.author).toBe("Trunal2005");
      expect(p.url).toMatch(
        /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+$/,
      );
      expect(["merged", "open"]).toContain(p.state);
      if (p.state === "merged") expect(p.mergedAt).toBeTruthy();
      else expect(p.mergedAt).toBeNull();
    }
  });
  it("has one canonical identity per PR", () => {
    expect(new Set(snapshot.items.map((p) => p.id)).size).toBe(
      snapshot.items.length,
    );
  });
  it("keeps disputed test counts and sensitive fields out", () => {
    expect(projects.flatMap((p) => p.verifiedMetrics)).toEqual([]);
    expect(JSON.stringify(projects)).not.toMatch(/84 passing|phone|1000\+/i);
  });
});
