import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import {
  stations,
  skillPodOffsets,
  studioStageOffsets,
  type StationId,
} from "../content/stations";
import { skillCategories } from "../content/skills";
import { roles } from "../content/experience";
const anchors = [
  ...stations.map((s) => ({
    id: s.id,
    point: new Vector3(
      s.position[0] + s.labelOffset[0],
      s.labelOffset[1],
      s.position[2] + s.labelOffset[2],
    ),
  })),
  { id: "core", point: new Vector3(0, 2.15, 0.6) },
  { id: "reserved", point: new Vector3(-8.3, 0.3, 4.4) },
  ...skillCategories.map((c) => ({
    id: `skill-${c.id}`,
    point: new Vector3(
      -4.8 + skillPodOffsets[c.id][0],
      2.35,
      -5.5 + skillPodOffsets[c.id][2],
    ),
  })),
  ...roles[0].pipeline.map((c) => ({
    id: `stage-${c.id}`,
    point: new Vector3(
      3 + studioStageOffsets[c.id][0],
      1.75,
      -5.3 + studioStageOffsets[c.id][2],
    ),
  })),
];
export function ProjectLabels({ overview }: { overview: boolean }) {
  const { camera, size } = useThree();
  const elements = useRef<(HTMLElement | null)[]>([]);
  useFrame(() => {
    if (
      elements.current.length !== anchors.length ||
      !elements.current[0]?.isConnected
    )
      elements.current = anchors.map((a) =>
        document.querySelector<HTMLElement>(`[data-anchor="${a.id}"]`),
      );
    anchors.forEach((a, i) => {
      const el = elements.current[i];
      if (!el) return;
      const p = a.point.clone().project(camera);
      const rawX = ((p.x + 1) * size.width) / 2;
      const rawY = ((1 - p.y) * size.height) / 2;
      const half = (el.offsetWidth || 100) / 2;
      const halfHeight = (el.offsetHeight || 50) / 2;
      const x = overview
        ? Math.max(half + 12, Math.min(size.width - half - 12, rawX))
        : rawX;
      el.style.transform = `translate(-50%,-50%) translate3d(${x}px,${rawY}px,0)`;
      // Focus shots may place neighboring labels outside the usable canvas.
      // Hide those complete labels instead of leaving clipped edge fragments.
      const outside =
        !overview &&
        (rawX - half < 12 ||
          rawX + half > size.width - 12 ||
          rawY - halfHeight < 90 ||
          rawY + halfHeight > size.height - 155);
      el.style.visibility =
        p.z > 1 || p.z < -1 || outside ? "hidden" : "visible";
    });
  });
  return null;
}
export default function WorldLabels({
  selected,
  detail,
}: {
  selected: StationId | null;
  detail: string | null;
}) {
  return (
    <div className="world-anchors" aria-hidden="true">
      {stations.map((s) => (
        <div
          key={s.id}
          data-anchor={s.id}
          className={`anchor-label ${selected && selected !== s.id ? "inactive-anchor" : ""}`}
        >
          <div
            className={`station-label ${selected === s.id ? "selected" : ""}`}
            style={{ borderColor: s.accent }}
            data-world-label={s.id}
          >
            <span>{s.number} /</span>
            <strong>{s.short}</strong>
            <small>{s.description}</small>
          </div>
        </div>
      ))}
      <div
        className={`anchor-label ${selected ? "inactive-anchor" : ""}`}
        data-anchor="core"
      >
        <div className="core-label">
          <strong>
            TRUNAL<span>.OS</span>
          </strong>
          <small>THE ENGINEERING CAMPUS</small>
        </div>
      </div>
      <div
        className={`anchor-label ${selected && selected !== "projects" ? "inactive-anchor" : ""}`}
        data-anchor="reserved"
      >
        <div className="reserved-world-label">
          BLUE CRED<small>CARBON REGISTRY · PROTOTYPE</small>
        </div>
      </div>
      {skillCategories.map((c) => (
        <div
          key={c.id}
          className={`anchor-label ${selected === "skills" && detail === c.id ? "" : "inactive-anchor"}`}
          data-anchor={`skill-${c.id}`}
        >
          <div className="detail-world-label">{c.name}</div>
        </div>
      ))}
      {roles[0].pipeline.map((s) => (
        <div
          key={s.id}
          className={`anchor-label ${selected === "experience" && detail === s.id ? "" : "inactive-anchor"}`}
          data-anchor={`stage-${s.id}`}
        >
          <div className="detail-world-label studio-detail">{s.name}</div>
        </div>
      ))}
    </div>
  );
}
