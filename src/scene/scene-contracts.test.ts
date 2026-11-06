import { describe, it, expect } from "vitest";
import {
  stations,
  getPose,
  overview,
  projectOffsets,
} from "../content/stations";
const distance = (a: readonly number[], b: readonly number[]) =>
  Math.hypot(...a.map((v, i) => v - b[i]));
describe("spatial navigation contracts", () => {
  it("defines seven distinct physical destinations and silhouette roles", () => {
    expect(stations).toHaveLength(7);
    expect(new Set(stations.map((s) => JSON.stringify(s.position))).size).toBe(
      7,
    );
    expect(new Set(stations.map((s) => s.shape)).size).toBe(7);
  });
  it("moves both camera and target for every destination", () => {
    for (const s of stations) {
      const p = getPose(s.id);
      expect(distance(p.position, overview.position)).toBeGreaterThan(4);
      expect(distance(p.target, overview.target)).toBeGreaterThan(4);
      expect(distance(p.position, p.target)).toBeGreaterThan(7);
    }
  });
  it("assigns a distinct closer pose to real case-study terminals only", () => {
    for (const id of Object.keys(projectOffsets)) {
      const p = getPose("work", id);
      expect(distance(p.target, getPose("work").target)).toBeGreaterThan(0.5);
      expect(distance(p.position, p.target)).toBeLessThan(
        distance(getPose("work").position, getPose("work").target),
      );
    }
    expect(projectOffsets["blue-cred"]).toEqual([-2.3, 0.3, 4.3]);
  });
  it("positions three journey focuses along the physical milestone walk", () => {
    const targets = [0, 1, 2].map(
      (i) => getPose("journey", `journey-${i}`).target,
    );
    expect(distance(targets[0], targets[1])).toBeGreaterThan(1.5);
    expect(distance(targets[1], targets[2])).toBeGreaterThan(1.5);
  });
});
