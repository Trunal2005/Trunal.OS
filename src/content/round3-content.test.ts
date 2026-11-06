import { describe, it, expect } from "vitest";
import { skillCategories, skills } from "./skills";
import { roles } from "./experience";
import { education } from "./education";
import { certifications } from "./certifications";
import { achievements } from "./achievements";
import { projects } from "./projects";
describe("complete professional identity contracts", () => {
  it("covers six standalone skill domains with inspectable evidence", () => {
    expect(skillCategories).toHaveLength(6);
    for (const category of skillCategories)
      expect(skills.some((s) => s.category === category.id && s.visible)).toBe(
        true,
      );
    for (const s of skills.filter((s) => s.verified)) {
      expect(s.evidenceProjectIds.length).toBeGreaterThan(0);
      for (const id of s.evidenceProjectIds)
        expect(
          projects.some(
            (p) => p.id === id && !p.placeholderOnly && p.repositoryUrl,
          ),
        ).toBe(true);
    }
    expect(
      skills.some((s) => s.evidenceLevel === "concept-explored" && !s.verified),
    ).toBe(true);
  });
  it("represents Nitrix as a professional role with no unsupported metrics or endorsements", () => {
    const r = roles.find((r) => r.id === "nitrix")!;
    expect(r.company).toBe("Nitrix Talent Media");
    expect(r.role).toBe("Co-Founder & Chief Marketing Officer");
    expect(r.start).toBe("March 2025");
    expect(r.end).toBe("Present");
    expect(r.responsibilities.length).toBeGreaterThanOrEqual(4);
    expect(r.approvedMetrics).toEqual([]);
    expect(r.approvedClients).toEqual([]);
    expect(JSON.stringify(r.responsibilities)).not.toMatch(
      /1000|1,000|Nestl|Nescaf|5\+/,
    );
  });
  it("preserves education without publishing a disputed numeric grade", () => {
    expect(education.institution).toBe("Vidyalankar Institute of Technology");
    expect(education.grade).toBeNull();
    expect(education.expected).toBe(true);
    expect(education.coursework).toHaveLength(3);
  });
  it("distinguishes an approved self-description from verified contributions and credentials", () => {
    for (const a of achievements.filter((a) => a.visible && a.category === "community"))
      expect(a.verified && a.proofUrl).toBeTruthy();
    for (const c of certifications.filter((c) => c.visible))
      expect(c.verified && c.url).toBeTruthy();
    expect(
      achievements.find((a) => a.id === "hackathon-finalist")?.visible,
    ).toBe(true);
    const claim = achievements.find(a => a.id === "hackathon-finalist")!;
    expect(claim.title).toBe("2x National-Level Hackathon Finalist");
    expect(claim.verified).toBe(false);
    expect(claim.proofUrl).toBeNull();
    expect(certifications).toHaveLength(4);
  });
});
