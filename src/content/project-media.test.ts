import { describe, it, expect } from "vitest";
import fs from "node:fs";
import { projects } from "./projects";
import { projectMedia, usableProjectMedia, mediaLabel } from "./project-media";
describe("verified prototype media", () => {
  it("maps sixteen actual UI captures to six exact repositories", () => {
    expect(Object.values(projectMedia).flat()).toHaveLength(16);
    for (const p of projects.filter((p) => !p.placeholderOnly)) {
      expect(p.media.length).toBeGreaterThan(0);
      for (const m of p.media) {
        expect(m.kind).toBe("real-ui");
        expect(m.sourceRepo).toBe(p.repositoryUrl);
        expect(m.evidenceRef).toMatch(/^(?:[a-f0-9]{40}|owner-upload) /);
        expect(m.alt).toBeTruthy();
        expect(m.caption).toBeTruthy();
      }
    }
    expect(projects.some((p) => p.placeholderOnly)).toBe(false);
    expect(projectMedia["blue-cred"][0].captureSource).toBe("repo");
  });
  it("ships local full-resolution, thumbnail and PNG fallback assets with truthful preview dimensions", () => {
    for (const m of Object.values(projectMedia).flat()) {
      for (const src of [m.src, m.fullSrc, m.fallbackSrc, m.thumbnailSrc]) {
        expect(src).not.toMatch(/^https?:/);
        expect(fs.statSync(`public/${src}`).size).toBeGreaterThan(0);
      }
      const png = fs.readFileSync(`public/${m.fallbackSrc}`);
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([
        m.width,
        m.height,
      ]);
      expect(fs.statSync(`public/${m.src}`).size).toBeLessThan(250000);
    }
  });
  it("rejects missing/malformed/remote media instead of rendering a broken or unsafe image", () => {
    expect(usableProjectMedia(undefined)).toEqual([]);
    expect(usableProjectMedia({})).toEqual([]);
    expect(usableProjectMedia([{ ...projectMedia.bi[0], width: 0 }])).toEqual(
      [],
    );
    expect(
      usableProjectMedia([
        { ...projectMedia.bi[0], src: "https://example.com/image.webp" },
      ]),
    ).toEqual([]);
    expect(usableProjectMedia(projectMedia.bi)).toHaveLength(3);
  });
  it("never calls a concept or architecture asset an actual application screenshot", () => {
    expect(mediaLabel("concept")).toBe("Concept illustration");
    expect(mediaLabel("architecture")).toBe("Architecture diagram");
    expect(mediaLabel("recorded-demo")).toBe("Recorded demo frame");
    expect(mediaLabel("real-ui")).toBe("Actual application screenshot");
  });
  it("does not claim that the captured résumé form is successful keyless analysis", () => {
    const p = projects.find((p) => p.id === "resume")!;
    expect(p.architecture).toMatch(/requires a key/);
    expect(p.media[0].context).toBe("keyless-form");
    expect(p.media[0].caption).toMatch(/does not show generated feedback/);
    expect(p.highlights.join(" ")).not.toMatch(/key-free|mock-data demo/i);
  });
});
