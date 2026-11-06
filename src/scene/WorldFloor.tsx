import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { stations, type StationId, type Vec3 } from "../content/stations";
import { Box, Cylinder, RepeatedBoxes } from "./Primitives";
export function routeFor(id: StationId): Vec3[] {
  const s = stations.find((s) => s.id === id)!;
  const [x, , z] = s.position;
  return [
    [0, 0.07, 0.6],
    [x * 0.48, 0.07, 0.6],
    [x * 0.48, 0.07, z],
    [x, 0.07, z],
  ];
}
function Route({
  id,
  selected,
  motion,
}: {
  id: StationId;
  selected: boolean;
  motion: boolean;
}) {
  const s = stations.find((s) => s.id === id)!;
  const points = useMemo(() => routeFor(id), [id]);
  const particle = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const c = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 1; i < points.length; i++)
      c.add(
        new THREE.LineCurve3(
          new THREE.Vector3(...points[i - 1]),
          new THREE.Vector3(...points[i]),
        ),
      );
    return c;
  }, [points]);
  useFrame(({ clock }) => {
    if (particle.current && motion)
      particle.current.position.copy(
        curve.getPoint((clock.elapsedTime * 0.12) % 1),
      );
  });
  return (
    <group name={`route-${id}`} userData={{ active: selected }}>
      <Line points={points} color="#354843" lineWidth={9} />
      <Line
        points={points}
        color={selected ? s.accent : "#6c9387"}
        lineWidth={selected ? 3 : 1.1}
      />
      <mesh ref={particle} visible={selected && motion} raycast={() => {}}>
        <sphereGeometry args={[0.075, 8, 6]} />
        <meshBasicMaterial color={s.accent} toneMapped={false} />
      </mesh>
    </group>
  );
}
export default function WorldFloor({
  selected,
  motion,
  onProject,
  onHover,
}: {
  selected: StationId | null;
  motion: boolean;
  onProject: (id: string) => void;
  onHover: (id: StationId | null) => void;
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const points = [
      [-9.7, -8.3],
      [7.2, -8.3],
      [10, -5],
      [10, 7.8],
      [6.4, 9.5],
      [-7.5, 9.5],
      [-10, 5],
      [-10, -3],
    ];
    points.forEach(([x, z], i) =>
      i ? shape.lineTo(x, -z) : shape.moveTo(x, -z),
    );
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    });
  }, []);
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.7, 0]}
        geometry={geometry}
        receiveShadow
      >
        <meshStandardMaterial
          color="#29332f"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      <Box p={[-3.2, -0.22, -3.7]} s={[12.3, 0.25, 8.7]} color="#303b37" />
      <Box p={[5, -0.24, -2.6]} s={[7.8, 0.22, 9.8]} color="#333a34" />
      <Box p={[0.2, -0.22, 5.8]} s={[17.8, 0.23, 6.8]} color="#303a32" />
      <Box p={[0, -0.02, 0.7]} s={[5, 0.15, 4.3]} color="#4b554a" />
      <Box p={[-2.8, -0.02, 1.6]} s={[8.8, 0.12, 1.1]} color="#536052" />
      <Box p={[2.8, -0.02, 0.5]} s={[7.6, 0.12, 1.1]} color="#536052" />
      <Box p={[0, -0.02, 3.5]} s={[1.2, 0.12, 5.8]} color="#536052" />
      <Box p={[0.4, -0.02, -2.5]} s={[1.2, 0.12, 5.6]} color="#536052" />
      {stations.map((s) => (
        <Route
          key={s.id}
          id={s.id}
          selected={s.id === selected}
          motion={motion}
        />
      ))}
      {[
        [-5, -0.07, -5.5],
        [3, -0.07, -5.3],
        [6.5, -0.07, 4],
      ].map((p, i) => (
        <gridHelper
          key={i}
          args={[5, 10, "#58685a", "#3a483d"]}
          position={p as Vec3}
        />
      ))}
      <RepeatedBoxes
        positions={Array.from(
          { length: 16 },
          (_, i) => [-7.5 + (i % 8) * 2, 0.02, i < 8 ? -7.65 : 8.6] as Vec3,
        )}
        scale={[0.45, 0.025, 0.06]}
        color="#7a8874"
      />
      <group
        name="project-blue-cred"
        position={[-8.3, 0.06, 4.4]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover("projects");
          document
            .querySelector(".immersive-canvas")
            ?.setAttribute("data-detail-hover", "project-blue-cred");
        }}
        onPointerOut={() => {
          onHover(null);
          document
            .querySelector(".immersive-canvas")
            ?.setAttribute("data-detail-hover", "");
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 5) return;
          window.__TRUNAL_SCENE__?.picks.push({
            id: "project-blue-cred",
            object: e.object.name || e.object.uuid,
            type: e.object.type,
            time: performance.now(),
          });
          onProject("blue-cred");
        }}
      >
        <Box s={[2.25, 0.1, 1.9]} color="#3c453a" />
        <Line
          points={[
            [-1.12, 0.1, -0.95],
            [1.12, 0.1, -0.95],
            [1.12, 0.1, 0.95],
            [-1.12, 0.1, 0.95],
            [-1.12, 0.1, -0.95],
          ]}
          color="#82917e"
          dashed
          dashSize={0.16}
          gapSize={0.13}
        />
      </group>
      {[
        [-8.8, 0, -6.4],
        [8.6, 0, -4.8],
        [8.4, 0, 7.6],
        [-7.6, 0, 7.7],
      ].map((p, i) => (
        <group key={i} position={p as Vec3}>
          <Cylinder
            p={[0, 0.35, 0]}
            radius={0.18}
            height={0.7}
            color="#758472"
          />
          <Cylinder
            p={[0, 0.74, 0]}
            radius={0.22}
            height={0.06}
            color="#cee3bf"
            glow
          />
        </group>
      ))}
    </group>
  );
}
