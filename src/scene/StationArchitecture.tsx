import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Line } from "@react-three/drei";
import { Box, Cylinder, Ring, Deck } from "./Primitives";
import {
  projectOffsets,
  skillPodOffsets,
  studioStageOffsets,
  type StationId,
} from "../content/stations";
import { skillCategories } from "../content/skills";
import { roles } from "../content/experience";
import snapshot from "../data/prs.generated.json";
import { featuredPrIds } from "../content/featured-prs";
function registerPick(
  id: string,
  e: { object: { name: string; uuid: string; type: string } },
) {
  window.__TRUNAL_SCENE__?.picks.push({
    id,
    object: e.object.name || e.object.uuid,
    type: e.object.type,
    time: performance.now(),
  });
}
function detailHover(id: string | null) {
  document
    .querySelector(".immersive-canvas")
    ?.setAttribute("data-detail-hover", id ?? "");
}
export default function StationArchitecture({
  id,
  active,
  accent,
  motion,
  onProject,
  selectedDetail,
}: {
  id: StationId;
  active: boolean;
  accent: string;
  motion: boolean;
  onProject: (id: string) => void;
  selectedDetail: string | null;
}) {
  const animated = useRef<Group>(null);
  const [hoveredPod, setHoveredPod] = useState<string | null>(null);
  useFrame(({ clock }) => {
    if (animated.current && motion)
      animated.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.09;
  });
  if (id === "projects")
    return (
      <Deck width={6.2} depth={4.6} accent={accent}>
        {[-2.8, 2.8].flatMap((x) =>
          [-1.7, 1.7].map((z) => (
            <Box
              key={`${x}/${z}`}
              p={[x, 1.9, z]}
              s={[0.18, 3.1, 0.18]}
              color="#52625f"
            />
          )),
        )}
        <Box p={[0, 3.5, -1.7]} s={[5.9, 0.2, 0.23]} color="#667571" />
        <Box p={[0, 3.5, 1.7]} s={[5.9, 0.2, 0.23]} color="#667571" />
        {[-2, 0, 2].map((x) => (
          <Box key={x} p={[x, 3.5, 0]} s={[0.13, 0.15, 3.5]} color="#465451" />
        ))}
        <Box p={[0, 3.64, -1.7]} s={[5.3, 0.035, 0.04]} color={accent} glow />
        <Box p={[0, 1.8, -1.85]} s={[5.4, 2.5, 0.14]} color="#33423f" />
        {[-1.7, 0, 1.7].map((x, i) => (
          <group key={x}>
            <Box p={[x, 1.85, -1.73]} s={[1.25, 1.15, 0.08]} color="#102320" />
            <Box
              p={[x, 1.85, -1.67]}
              s={[1.03, 0.88, 0.025]}
              color={i === 1 ? "#8fb8ab" : "#527e72"}
              glow
            />
            <Box p={[x, 1.25, -1.66]} s={[1.25, 0.05, 0.1]} color="#759087" />
          </group>
        ))}
        {[-2.4, 2.4].map((x) => (
          <group key={x}>
            <Box p={[x, 1.15, -0.6]} s={[0.65, 1.6, 0.8]} color="#364a44" />
            {[0, 1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                p={[x, 0.6 + i * 0.25, -0.18]}
                s={[0.44, 0.12, 0.03]}
                color={i === 2 ? accent : "#6d8980"}
                glow={i === 2}
              />
            ))}
          </group>
        ))}
        {Object.entries(projectOffsets)
          .filter(([key]) => key !== "blue-cred")
          .map(([key, p]) => (
            <group
              key={key}
              name={`project-${key}`}
              onPointerOver={() => detailHover(`project-${key}`)}
              onPointerOut={() => detailHover(null)}
              position={[p[0], 0.45, p[2] + 0.6]}
              onClick={(e) => {
                if (!active) return;
                e.stopPropagation();
                if (e.delta < 5) {
                  registerPick(`project-${key}`, e);
                  onProject(key);
                }
              }}
            >
              <Box p={[0, 0.18, 0]} s={[0.85, 0.25, 0.65]} color="#50615a" />
              <Box
                p={[0, 0.65, -0.08]}
                s={[0.8, 0.55, 0.1]}
                color="#617f73"
                rotation={[-0.18, 0, 0]}
              />
              <Box
                p={[0, 0.67, -0.01]}
                s={[0.65, 0.37, 0.018]}
                color={selectedDetail === key ? "#d0ffe6" : "#84c2a8"}
                rotation={[-0.18, 0, 0]}
                glow
              />
            </group>
          ))}
      </Deck>
    );
  if (id === "skills")
    return (
      <Deck width={6.3} depth={4.7} accent={accent}>
        <Cylinder p={[0, 0.68, 0]} radius={1} height={0.65} color="#5e536d" />
        <Box p={[0, 1, 0]} s={[5.9, 0.2, 3.6]} color="#555263" />
        <Box p={[0, 1.13, 0]} s={[5.65, 0.05, 3.35]} color="#292637" />
        {[-2.8, 2.8].map((x) => (
          <Box key={x} p={[x, 2, -1.8]} s={[0.14, 3.2, 0.14]} color="#716584" />
        ))}
        <Box p={[0, 3.65, -1.8]} s={[5.75, 0.15, 0.15]} color="#716584" />
        <Box p={[0, 3.76, -1.8]} s={[5.4, 0.03, 0.025]} color={accent} glow />
        {skillCategories.map((c, i) => {
          const p = skillPodOffsets[c.id];
          const chosen =
            active && (selectedDetail === c.id || hoveredPod === c.id);
          return (
            <group
              key={c.id}
              name={`skill-${c.id}`}
              onPointerOver={() => {
                setHoveredPod(c.id);
                detailHover(`skill-${c.id}`);
              }}
              onPointerOut={() => {
                setHoveredPod(null);
                detailHover(null);
              }}
              position={[p[0], 1.15, p[2]]}
              onClick={(e) => {
                if (!active) return;
                e.stopPropagation();
                if (e.delta < 5) {
                  registerPick(`skill-${c.id}`, e);
                  onProject(`skill-${c.id}`);
                }
              }}
            >
              <Cylinder
                p={[0, 0.03, 0]}
                radius={0.61}
                height={0.08}
                color="#453d52"
                segments={6}
              />
              <Ring
                p={[0, 0.09, 0]}
                radius={0.55}
                tube={chosen ? 0.035 : 0.015}
                color={chosen ? "#e1d3ff" : accent}
              />
              {i === 0 ? (
                <>
                  <Box p={[0, 0.5, 0]} s={[0.85, 0.63, 0.1]} color="#857599" />
                  <Box
                    p={[0, 0.5, 0.065]}
                    s={[0.67, 0.42, 0.018]}
                    color="#c0b2d5"
                    glow
                  />
                  <Box
                    p={[0, 0.13, 0.2]}
                    s={[0.85, 0.08, 0.4]}
                    color="#6b6478"
                  />
                </>
              ) : i === 1 ? (
                <>
                  {[0, 1, 2].map((n) => (
                    <group key={n}>
                      <Box
                        p={[0, 0.2 + n * 0.22, 0]}
                        s={[0.7, 0.16, 0.5]}
                        color="#6b687e"
                      />
                      <Box
                        p={[-0.23, 0.2 + n * 0.22, 0.26]}
                        s={[0.07, 0.04, 0.02]}
                        color="#cdb9ef"
                        glow
                      />
                    </group>
                  ))}
                </>
              ) : i === 2 ? (
                <>
                  <mesh position={[0, 0.55, 0]}>
                    <octahedronGeometry args={[0.4, 0]} />
                    <meshStandardMaterial color="#ad91ce" wireframe />
                  </mesh>
                  {[-0.4, 0.4].map((x) => (
                    <Cylinder
                      key={x}
                      p={[x, 0.22, 0.25]}
                      radius={0.1}
                      height={0.2}
                      color="#c8b0e5"
                      glow
                    />
                  ))}
                </>
              ) : i === 3 ? (
                <>
                  {[-0.22, 0.22].map((x, n) => (
                    <group key={x}>
                      <Cylinder
                        p={[x, 0.3 + n * 0.13, 0]}
                        radius={0.22}
                        height={0.5 + n * 0.26}
                        color="#829792"
                      />
                      <Ring
                        p={[x, 0.57 + n * 0.26, 0]}
                        radius={0.23}
                        color="#c3d8cf"
                      />
                    </group>
                  ))}
                </>
              ) : i === 4 ? (
                <>
                  <Box
                    p={[-0.27, 0.4, 0]}
                    s={[0.08, 0.55, 0.1]}
                    color="#c2b3d6"
                  />
                  <Box
                    p={[0.27, 0.4, 0]}
                    s={[0.08, 0.55, 0.1]}
                    color="#c2b3d6"
                  />
                  <Box
                    p={[0, 0.4, 0.1]}
                    s={[0.45, 0.08, 0.08]}
                    rotation={[0, 0, 0.6]}
                    color="#d1c4e1"
                    glow
                  />
                </>
              ) : (
                <>
                  {[-0.3, 0, 0.3].map((x, n) => (
                    <group key={n}>
                      <Box
                        p={[x, 0.22 + n * 0.18, 0]}
                        s={[0.12, 0.45 + n * 0.35, 0.12]}
                        color="#8e8ba7"
                      />
                      <Cylinder
                        p={[x, 0.48 + n * 0.35, 0]}
                        radius={0.1}
                        height={0.07}
                        color="#b6cce6"
                        glow
                      />
                    </group>
                  ))}
                  <Line
                    points={[
                      [-0.3, 0.4, 0],
                      [0, 0.6, 0],
                      [0.3, 0.8, 0],
                    ]}
                    color="#acbde0"
                  />
                </>
              )}
            </group>
          );
        })}
      </Deck>
    );
  if (id === "experience")
    return (
      <Deck width={6.5} depth={4.8} accent={accent}>
        {[-2.95, 2.95].map((x) => (
          <Box
            key={x}
            p={[x, 2.2, -1.6]}
            s={[0.2, 3.7, 0.22]}
            color="#7b6c55"
          />
        ))}
        <Box p={[0, 4.08, -1.6]} s={[6.15, 0.23, 0.28]} color="#a08b69" />
        <Box p={[0, 4.23, -1.6]} s={[5.8, 0.035, 0.04]} color={accent} glow />
        <Box p={[0, 2.35, -1.45]} s={[4.9, 2.15, 0.18]} color="#635b4a" />
        <Box p={[0, 2.35, -1.32]} s={[4.55, 1.82, 0.04]} color="#292c28" />
        <group position={[0, 2.35, -1.26]}>
          <Box p={[-0.43, 0, 0]} s={[0.13, 1.1, 0.06]} color={accent} glow />
          <Box p={[0.43, 0, 0]} s={[0.13, 1.1, 0.06]} color={accent} glow />
          <Box
            s={[0.13, 1.26, 0.06]}
            rotation={[0, 0, 0.66]}
            color={accent}
            glow
          />
        </group>
        {[-1.8, -1.2, 1.2, 1.8].map((x, i) => (
          <group key={x}>
            <Box
              p={[x, 2.2 + (i % 2) * 0.5, -1.27]}
              s={[0.42, 0.53, 0.05]}
              color="#8f7b5c"
            />
            <Box
              p={[x, 2.2 + (i % 2) * 0.5, -1.22]}
              s={[0.26, 0.3, 0.02]}
              color="#c9b78f"
            />
          </group>
        ))}
        <Box p={[0, 1, 0.35]} s={[5.3, 0.15, 0.24]} color="#8b775b" />
        {roles[0].pipeline.map((s, i) => {
          const p = studioStageOffsets[s.id];
          return (
            <group
              key={s.id}
              name={`stage-${s.id}`}
              onPointerOver={() => detailHover(`stage-${s.id}`)}
              onPointerOut={() => detailHover(null)}
              position={[p[0], 0.5, p[2]]}
              onClick={(e) => {
                if (!active) return;
                e.stopPropagation();
                if (e.delta < 5) {
                  registerPick(`stage-${s.id}`, e);
                  onProject(`stage-${s.id}`);
                }
              }}
            >
              <Box p={[0, 0.14, 0]} s={[0.88, 0.23, 1]} color="#655b46" />
              <Box
                p={[0, 0.28, 0]}
                s={[0.75, 0.025, 0.86]}
                color={
                  active && selectedDetail === s.id ? "#edcf9d" : "#a18c66"
                }
                glow={active && selectedDetail === s.id}
              />
              {i === 0 ? (
                <>
                  <Ring
                    p={[0, 0.6, 0]}
                    radius={0.27}
                    rotation={[0, 0, 0]}
                    color={accent}
                  />
                  <Box
                    p={[0, 0.65, 0]}
                    s={[0.06, 0.55, 0.06]}
                    color="#e0c99b"
                  />
                </>
              ) : i === 1 ? (
                <>
                  {[-0.17, 0.17].map((x) => (
                    <Box
                      key={x}
                      p={[x, 0.55, 0]}
                      s={[0.28, 0.45, 0.12]}
                      color="#c3ae82"
                    />
                  ))}
                </>
              ) : i === 2 ? (
                <>
                  <Box
                    p={[0, 0.65, 0]}
                    s={[0.58, 0.13, 0.13]}
                    color="#cfba8f"
                  />
                  {[-0.22, 0.22].map((x) => (
                    <Box
                      key={x}
                      p={[x, 0.48, 0]}
                      s={[0.12, 0.4, 0.12]}
                      color="#cfba8f"
                    />
                  ))}
                </>
              ) : (
                <>
                  <Ring
                    p={[-0.06, 0.65, 0]}
                    radius={0.24}
                    rotation={[0, 0, 0]}
                    color="#e5ca97"
                  />
                  <Box
                    p={[0.22, 0.43, 0]}
                    s={[0.12, 0.35, 0.1]}
                    rotation={[0, 0, 0.6]}
                    color="#e5ca97"
                  />
                </>
              )}
            </group>
          );
        })}
      </Deck>
    );
  if (id === "opensource")
    return (
      <Deck width={4.7} depth={4.3} accent={accent}>
        <Box p={[0, 0.6, 0]} s={[0.2, 0.2, 3.3]} color="#597080" />
        <Box p={[0, 0.6, 0.8]} s={[3.4, 0.15, 0.17]} color="#7892a1" />
        {[-1.25, 0, 1.25].map((x, i) => {
          const pr = snapshot.items.find(
            (p) => p.id === featuredPrIds[i] && p.mergedAt,
          );
          return (
            <group
              key={x}
              name={pr ? `pr-${pr.id}` : undefined}
              onPointerOver={() => detailHover(pr ? `pr-${pr.id}` : null)}
              onPointerOut={() => detailHover(null)}
              onClick={(e) => {
                if (!active || !pr) return;
                e.stopPropagation();
                if (e.delta < 5) {
                  registerPick(`pr-${pr.id}`, e);
                  onProject(`pr-${pr.id}`);
                }
              }}
            >
              <Box
                p={[x, 1 + i * 0.35, -0.5 + i * 0.45]}
                s={[0.23, 1.4 + i * 0.7, 0.23]}
                color="#687f8e"
              />
              <Box
                p={[x, 1.8 + i * 0.7, -0.5 + i * 0.45]}
                s={[1, 0.65, 0.2]}
                color="#94a7ad"
              />
              <Box
                p={[x, 1.8 + i * 0.7, -0.37 + i * 0.45]}
                s={[0.8, 0.44, 0.025]}
                color={selectedDetail === pr?.id ? "#c9ecff" : "#91b6cd"}
                glow
              />
              <Ring
                p={[x, 0.4, -0.5 + i * 0.45]}
                radius={0.52}
                color={accent}
              />
            </group>
          );
        })}
      </Deck>
    );
  if (id === "about")
    return (
      <Deck width={5.9} depth={3.5} accent={accent}>
        {[-1.7, 0, 1.7].map((x, i) => (
          <group key={x}>
            <Box
              p={[x, 0.5 + i * 0.16, 0]}
              s={[1.4, 0.3 + i * 0.32, 2]}
              color="#596254"
            />
            <Box
              p={[x, 0.69 + i * 0.32, 0]}
              s={[1.15, 0.06, 1.7]}
              color="#83917b"
            />
            <group position={[x, 1 + i * 0.32, -0.2]}>
              <Box
                p={[-0.22, 0, 0]}
                s={[0.43, 0.06, 0.65]}
                rotation={[0, 0, -0.2]}
                color="#c0c6ad"
              />
              <Box
                p={[0.22, 0, 0]}
                s={[0.43, 0.06, 0.65]}
                rotation={[0, 0, 0.2]}
                color="#d0d4bc"
              />
            </group>
            <Cylinder
              p={[x, 0.9 + i * 0.32, 0.75]}
              radius={0.09}
              height={0.28}
              color={accent}
              glow
            />
          </group>
        ))}
      </Deck>
    );
  if (id === "achievements")
    return (
      <Deck width={3.6} depth={3.8} accent={accent}>
        <Cylinder
          p={[0, 0.5, 0]}
          radius={1.3}
          height={0.3}
          segments={6}
          color="#5b5b50"
        />
        {[-0.8, 0.8].flatMap((x) =>
          [-0.65, 0.65].map((z) => (
            <Box
              key={`${x}/${z}`}
              p={[x, 2.2, z]}
              s={[0.12, 3.5, 0.12]}
              color="#868774"
            />
          )),
        )}
        {[0, 1, 2].map((i) => (
          <group key={i}>
            <Box
              p={[0, 0.9 + i * 1.02, 0]}
              s={[1.9, 0.13, 1.7]}
              color="#8a8974"
            />
            <Box
              p={[0, 1.35 + i * 1.02, 0.2]}
              s={[1.1, 0.7, 0.08]}
              color="#d3d0b5"
              rotation={[-0.12, 0, 0]}
            />
            {[0, 1].map((n) => (
              <Box
                key={n}
                p={[-0.05, 1.25 + i * 1.02 + n * 0.18, 0.26]}
                s={[0.6, 0.035, 0.015]}
                color="#6d756c"
              />
            ))}
          </group>
        ))}
        <Ring
          p={[0, 4.1, 0]}
          radius={0.62}
          rotation={[0, 0, 0]}
          color={accent}
        />
        <Cylinder
          p={[0, 3.9, 0]}
          radius={1.1}
          height={0.12}
          segments={6}
          color="#8e8d77"
        />
      </Deck>
    );
  return (
    <Deck width={4.1} depth={3.7} accent={accent}>
      <Cylinder p={[0, 0.85, 0]} radius={0.55} height={1} />
      <Box p={[0, 1.65, 0]} s={[0.2, 1.4, 0.2]} color="#617c71" />
      <group ref={animated}>
        <group position={[0, 2.1, 0]} rotation={[0.5, 0, 0.2]}>
          <mesh castShadow>
            <sphereGeometry
              args={[1, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.4]}
            />
            <meshStandardMaterial
              color="#8ba399"
              roughness={0.5}
              metalness={0.25}
              side={2}
            />
          </mesh>
          <Ring p={[0, 0.43, 0]} radius={0.9} color={accent} />
          <Box p={[0, 1, 0]} s={[0.07, 1.1, 0.07]} color={accent} glow />
        </group>
      </group>
      <Box p={[1.25, 0.8, 0.8]} s={[0.8, 0.9, 0.6]} color="#5d7169" />
      <Box p={[1.25, 0.92, 1.12]} s={[0.57, 0.4, 0.02]} color={accent} glow />
    </Deck>
  );
}
