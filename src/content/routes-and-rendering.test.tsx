import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { parsePortfolioRoute } from "../PortfolioApp";
import SkillsLab from "../components/SkillsLab";
import ExperienceStudio from "../components/ExperienceStudio";
describe("seven-district routes and independent professional content", () => {
  it("accepts all seven direct routes and keeps useful legacy routes", () => {
    for (const id of [
      "projects",
      "skills",
      "experience",
      "opensource",
      "about",
      "achievements",
      "contact",
    ])
      expect(parsePortfolioRoute(`#${id}`).station).toBe(id);
    expect(parsePortfolioRoute("#ai").category).toBe("ai");
    expect(parsePortfolioRoute("#networks").category).toBe("networks");
    expect(parsePortfolioRoute("#journey").station).toBe("about");
  });
  it("resolves actual project, skill, studio and encoded PR details", () => {
    expect(parsePortfolioRoute("#projects/revenue-recovery").project?.id).toBe(
      "recovery",
    );
    expect(parsePortfolioRoute("#skills/data").category).toBe("data");
    expect(parsePortfolioRoute("#experience/analysis").stage).toBe("analysis");
    expect(
      parsePortfolioRoute("#opensource/python-poetry%2Fpoetry%2311141").pr,
    ).toBe("python-poetry/poetry#11141");
    expect(parsePortfolioRoute("#projects/blue-cred").project?.id).toBe("blue-cred");
    expect(parsePortfolioRoute("#%broken").station).toBeNull();
  });
  it("renders a complete semantic skill index and source-linked applications", () => {
    const html = renderToStaticMarkup(
      <SkillsLab category="all" onCategory={() => {}} />,
    );
    expect(html).toContain("Frontend");
    expect(html).toContain("Backend &amp; APIs");
    expect(html).toContain("Concept explored");
    expect(html).toContain("#projects/business-intelligence");
    expect(html).not.toMatch(/99%|years of experience/);
  });
  it("renders Nitrix independently of projects, without disputed client claims", () => {
    const html = renderToStaticMarkup(
      <ExperienceStudio stage="analysis" onStage={() => {}} />,
    );
    expect(html).toContain("Nitrix Talent Media");
    expect(html).toContain("Co-Founder &amp; Chief Marketing Officer");
    expect(html).toContain("March 2025");
    expect(html).toContain("My responsibilities");
    expect(html).toContain("What I carry into engineering");
    expect(html).not.toMatch(/Nestl|Nescaf|1,000|5\+/);
  });
});
