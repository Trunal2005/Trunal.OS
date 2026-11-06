import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import ResumeActions from "../components/ResumeViewer";
import { renderToStaticMarkup } from "react-dom/server";
import { editorialProjects, projects } from "./projects";
import { resumeManifest, resolveResumeAsset, publicResume } from "./resume";
import { links } from "./links";
import { profile } from "./profile";
import ProjectFacts from "../components/ProjectFacts";
import ContactSection from "../components/ContactSection";
import ProjectsPanel from "../components/ProjectsPanel";
import {
  AboutSection,
  AchievementsSection,
} from "../components/PersonalSections";
describe("controlled owner-approved upgrade", () => {
  it("has six unique stable projects and editorially features four", () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(6);
    expect(editorialProjects.map((p) => p.id)).toEqual([
      "blue-cred",
      "bi",
      "recovery",
      "cybertwin",
      "resume",
      "anumitra",
    ]);
    expect(editorialProjects.map((p) => p.featurePriority)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    const html = renderToStaticMarkup(<ProjectsPanel onProject={() => {}} />);
    expect(html.match(/class="project-story-preview /g)).toHaveLength(4);
    expect(html).not.toContain("future-bay");
  });
  it("makes a genuine main view first in every shared gallery", () => {
    for (const p of projects) {
      expect(p.needsOwnerHero).toBe(false);
      expect(p.media[0].sourceRepo).toBe(p.repositoryUrl);
      expect(["homepage", "dashboard", "primary-workflow"]).toContain(
        p.media[0].view,
      );
      expect(p.mediaStatus).toBe(
        p.id === "resume"
          ? "captured-from-running-prototype"
          : "verified-existing-media",
      );
      expect(new Set(p.media.map((m) => m.id)).size).toBe(p.media.length);
    }
    for (const id of ["anumitra", "blue-cred", "bi", "recovery"])
      expect(projects.find((p) => p.id === id)!.media[0].view).toBe("homepage");
    expect(projects.find((p) => p.id === "cybertwin")!.media[0].view).toBe(
      "dashboard",
    );
  });
  it("renders accurate quick facts and exact approved contact destinations", () => {
    for (const p of projects) {
      const html = renderToStaticMarkup(<ProjectFacts project={p} />);
      expect(html).toContain(p.repositoryUrl!);
      expect(html).toContain("Prototype");
      for (const t of p.tags.slice(0, 4)) expect(html).toContain(t);
      expect(html).not.toContain("Production");
    }
    expect(links.linkedin).toBe(
      "https://www.linkedin.com/in/trunal-patil-866b97325/",
    );
    expect(profile.email).toBe("patiltrunal06@gmail.com");
    const html = renderToStaticMarkup(<ContactSection />);
    expect(html).toContain(`mailto:${profile.email}`);
    expect(html).toContain(links.github);
    expect(html).toContain(links.linkedin);
  });
  it("publishes the approved finalist story without a false proof badge or event", () => {
    const about = renderToStaticMarkup(<AboutSection />),
      ach = renderToStaticMarkup(<AchievementsSection />);
    expect(about.match(/2x National-Level Hackathon Finalist/g)).toHaveLength(
      1,
    );
    expect(ach.match(/2x National-Level Hackathon Finalist/g)).toHaveLength(1);
    expect(ach).toContain("Owner-provided résumé statement");
  });
  it("requires both explicit public approval and asset existence for résumé access", () => {
    expect(publicResume).toEqual(
      resolveResumeAsset(
        resumeManifest.approvedForPublic,
        existsSync(`public/${resumeManifest.path}`),
      ),
    );
    expect(resolveResumeAsset(false, true)).toBeNull();
    expect(resolveResumeAsset(true, false)).toBeNull();
    expect(resolveResumeAsset(true, true)?.filename).toBe(
      "Trunal_Patil_Resume_Public.pdf",
    );
    expect(publicResume?.url).toContain("resume/Trunal_Patil_Resume_Public.pdf");
    expect(renderToStaticMarkup(<ResumeActions />)).toContain("View Résumé");
    const html = renderToStaticMarkup(<ResumeActions asset={null} />);
    expect(html).toContain("Résumé coming soon");
    expect(html).not.toContain("<object");
    expect(html).not.toContain('href="./resume/');
  });
});
