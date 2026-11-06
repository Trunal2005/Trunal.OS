import { useEffect, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import WorldLabels, { ProjectLabels } from "./WorldLabels";
import { Box } from "./Primitives";
import * as THREE from "three";
import {
  stations,
  overview,
  projectOffsets,
  skillPodOffsets,
  studioStageOffsets,
  type StationId,
} from "../content/stations";
import WorldCore from "./WorldCore";
import WorldFloor from "./WorldFloor";
import StationArchitecture from "./StationArchitecture";
import CameraDirector from "./CameraDirector";
import StationSignals from "./StationSignals";
export type SceneProof = {
  camera: number[];
  target: number[];
  orientation: number[];
  flight: string;
  points: Record<string, { x: number; y: number }[]>;
  picks: { id: string; object: string; type: string; time: number }[];
  geometries: Record<
    string,
    { meshes: number; types: string[]; position: number[]; shape: string }
  >;
  activePath: string | null;
};
function RenderCadence({ animate }: { animate: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (!animate) return;
    const timer = setInterval(() => invalidate(), 33);
    return () => clearInterval(timer);
  }, [animate, invalidate]);
  return null;
}
declare global {
  interface Window {
    __TRUNAL_SCENE__?: SceneProof;
  }
}
function Diagnostics({ selected }: { selected: StationId | null }) {
  const { scene, camera, gl } = useThree();
  const last = useRef(0);
  const previousStamp = useRef("");
  useFrame(({ clock }) => {
    if (!location.search.includes("qa=1")) return;
    const stamp = `${selected}/${gl.domElement.dataset.camera}/${gl.domElement.dataset.flight}`;
    if (
      stamp === previousStamp.current &&
      clock.elapsedTime - last.current < 0.1
    )
      return;
    previousStamp.current = stamp;
    last.current = clock.elapsedTime;
    const rect = gl.domElement.getBoundingClientRect();
    const points: SceneProof["points"] = {};
    const geometries: SceneProof["geometries"] = {};
    for (const s of stations) {
      const g = scene.getObjectByName(`station-${s.id}`);
      if (!g) continue;
      const all: { x: number; y: number }[] = [];
      const types = new Set<string>();
      let meshes = 0;
      g.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          meshes++;
          types.add(o.geometry.type);
          const v = new THREE.Box3()
            .setFromObject(o)
            .getCenter(new THREE.Vector3())
            .project(camera);
          if (v.z < 1 && v.z > -1)
            all.push({
              x: rect.left + ((v.x + 1) * rect.width) / 2,
              y: rect.top + ((1 - v.y) * rect.height) / 2,
            });
        }
      });
      points[s.id] = all;
      geometries[s.id] = {
        meshes,
        types: [...types],
        position: [...s.position],
        shape: s.shape,
      };
    }
    const canvas = gl.domElement;
    const detailNames = [
      ...Object.keys(projectOffsets).map((id) => `project-${id}`),
      ...Object.keys(skillPodOffsets).map((id) => `skill-${id}`),
      ...Object.keys(studioStageOffsets).map((id) => `stage-${id}`),
    ];
    scene.traverse((o) => {
      if (o.name.startsWith("pr-")) detailNames.push(o.name);
    });
    for (const name of detailNames) {
      const g = scene.getObjectByName(name);
      const list: { x: number; y: number }[] = [];
      g?.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          const p = new THREE.Box3()
            .setFromObject(o)
            .getCenter(new THREE.Vector3())
            .project(camera);
          list.push({
            x: rect.left + ((p.x + 1) * rect.width) / 2,
            y: rect.top + ((1 - p.y) * rect.height) / 2,
          });
          // The existing low Blue Cred pad is partly occluded by the Contact
          // dish from overview. Sample its actual top surface, not just its centre.
          if (name === "project-blue-cred") {
            const bounds = new THREE.Box3().setFromObject(o);
            for (const x of [0.2, 0.5, 0.8])
              for (const z of [0.2, 0.5, 0.8]) {
                const v = new THREE.Vector3(
                  THREE.MathUtils.lerp(bounds.min.x, bounds.max.x, x),
                  bounds.max.y,
                  THREE.MathUtils.lerp(bounds.min.z, bounds.max.z, z),
                ).project(camera);
                list.push({
                  x: rect.left + ((v.x + 1) * rect.width) / 2,
                  y: rect.top + ((1 - v.y) * rect.height) / 2,
                });
              }
          }
        }
      });
      points[name] = list;
    }
    window.__TRUNAL_SCENE__ = {
      camera: camera.position.toArray(),
      target: JSON.parse(canvas.dataset.target ?? "[0,0,0]"),
      orientation: camera.quaternion.toArray(),
      flight: canvas.dataset.flight ?? "moving",
      points,
      picks: window.__TRUNAL_SCENE__?.picks ?? [],
      geometries,
      activePath: selected,
    };
  });
  return null;
}
function Scene({
  selected,
  projectId,
  motion,
  resetKey,
  onSelect,
  onProject,
  onHome,
  onHover,
  hovered,
  ambientMotion,
  skipIntro,
}: {
  selected: StationId | null;
  projectId: string | null;
  motion: boolean;
  resetKey: number;
  onSelect: (s: StationId) => void;
  onProject: (id: string) => void;
  onHome: () => void;
  onHover: (s: StationId | null) => void;
  hovered: StationId | null;
  ambientMotion: boolean;
  skipIntro: boolean;
}) {
  function pick(id: StationId, e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    if (e.delta > 5) return;
    if (window.__TRUNAL_SCENE__)
      window.__TRUNAL_SCENE__.picks.push({
        id,
        object: e.object.name || e.object.uuid,
        type: e.object.type,
        time: performance.now(),
      });
    onSelect(id);
  }
  return (
    <>
      <color attach="background" args={["#131b1a"]} />
      <fog attach="fog" args={["#131b1a", 42, 78]} />
      <hemisphereLight args={["#e8eadb", "#25382b", 2.2]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[-3, 18, 6]}
        intensity={3.2}
        color="#ffebd0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.001}
      />
      <pointLight
        position={[0, 5, 0]}
        color="#87fbe0"
        intensity={25}
        distance={15}
      />
      <WorldFloor
        selected={selected}
        motion={ambientMotion}
        onProject={onProject}
        onHover={onHover}
      />
      <WorldCore motion={ambientMotion} onHome={onHome} />
      {stations.map((s) => (
        <group
          key={s.id}
          name={`station-${s.id}`}
          position={[...s.position]}
          userData={{ station: s.id }}
          onClick={(e) => pick(s.id, e)}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(s.id);
          }}
          onPointerOut={() => onHover(null)}
        >
          <StationArchitecture
            id={s.id}
            active={selected === s.id}
            accent={s.accent}
            motion={ambientMotion}
            onProject={onProject}
            selectedDetail={projectId}
          />
          <StationSignals
            id={s.id}
            active={selected === s.id}
            motion={ambientMotion}
          />
          <group
            visible={hovered === s.id || selected === s.id}
            name={`highlight-${s.id}`}
          >
            {[-1, 1].flatMap((x) =>
              [-1, 1].map((z) => (
                <group key={`${x}/${z}`} position={[x * 2.1, 0.4, z * 1.8]}>
                  <Box
                    s={[0.45, 0.03, 0.055]}
                    color={s.accent}
                    glow
                    pickable={false}
                  />
                  <Box
                    s={[0.055, 0.03, 0.45]}
                    color={s.accent}
                    glow
                    pickable={false}
                  />
                </group>
              )),
            )}
          </group>
        </group>
      ))}
      <CameraDirector
        selected={selected}
        projectId={projectId}
        motion={motion}
        resetKey={resetKey}
        skipIntro={skipIntro}
      />
      <Diagnostics selected={selected} />
      <ProjectLabels overview={!selected} />
    </>
  );
}
export default function WorldCanvas({
  selected,
  projectId,
  motion,
  lowPower,
  resetKey,
  onSelect,
  onProject,
  onHome,
  onFailure,
  onLowPower,
  onReady,
  skipIntro,
}: {
  selected: StationId | null;
  projectId: string | null;
  motion: boolean;
  lowPower: boolean;
  resetKey: number;
  onSelect: (s: StationId) => void;
  onProject: (id: string) => void;
  onHome: () => void;
  onFailure: () => void;
  onLowPower: () => void;
  onReady: () => void;
  skipIntro: boolean;
}) {
  const [hover, setHover] = useState<StationId | null>(null);
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const change = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    document.body.style.cursor = hover ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover]);
  return (
    <div
      className="immersive-canvas"
      data-hover={hover ?? ""}
      aria-hidden="true"
    >
      <Canvas
        shadows={lowPower ? false : "basic"}
        camera={{
          position: [
            overview.position[0] + 3,
            overview.position[1] + 2,
            overview.position[2] + 3,
          ],
          fov: 40,
          near: 0.1,
          far: 120,
        }}
        dpr={lowPower ? 1 : [1, 1.5]}
        frameloop={!visible ? "never" : "demand"}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: lowPower ? "low-power" : "default",
        }}
        onCreated={({ gl }) => {
          const info = gl
            .getContext()
            .getExtension("WEBGL_debug_renderer_info");
          const renderer = info
            ? String(gl.getContext().getParameter(info.UNMASKED_RENDERER_WEBGL))
            : "";
          if (/swiftshader|llvmpipe|software|microsoft basic/i.test(renderer))
            onLowPower();
          gl.shadowMap.autoUpdate = false;
          gl.shadowMap.needsUpdate = true;
          gl.domElement.dataset.renderer = "webgl";
          onReady();
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              onFailure();
            },
            { once: true },
          );
        }}
      >
        <RenderCadence animate={visible && motion && !lowPower} />
        <Scene
          selected={selected}
          projectId={projectId}
          motion={motion}
          ambientMotion={motion && !lowPower}
          resetKey={resetKey}
          onSelect={onSelect}
          onProject={onProject}
          onHome={onHome}
          onHover={setHover}
          hovered={hover}
          skipIntro={skipIntro}
        />
      </Canvas>
      <WorldLabels selected={selected} detail={projectId} />
      {hover && (
        <div className="hover-caption" role="status">
          <span /> {stations.find((s) => s.id === hover)?.label}{" "}
          <small>CLICK TO ENTER ↗</small>
        </div>
      )}
    </div>
  );
}
