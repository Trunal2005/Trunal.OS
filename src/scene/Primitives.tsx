import { useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { Vec3 } from "../content/stations";
export const cyan = "#8feedd";
const shadeMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  vertexShader:
    "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
  fragmentShader:
    "varying vec2 vUv; void main(){float d=length((vUv-0.5)*2.0);gl_FragColor=vec4(0.005,0.02,0.025,(1.0-smoothstep(0.3,1.0,d))*0.42);}",
});
const shadeGeometry = new THREE.PlaneGeometry(1, 1);
const noRaycast = () => {};
export function ContactShade({
  width = 5,
  depth = 4.6,
}: {
  width?: number;
  depth?: number;
}) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.008, 0]}
      scale={[width, depth, 1]}
      geometry={shadeGeometry}
      material={shadeMaterial}
      dispose={null}
      raycast={noRaycast}
    />
  );
}
const unitBox = new THREE.BoxGeometry(1, 1, 1);
const materials = new Map<string, THREE.Material>();
function material(color: string, glow: boolean) {
  const key = `${color}/${glow}`;
  if (!materials.has(key))
    materials.set(
      key,
      glow
        ? new THREE.MeshBasicMaterial({ color, toneMapped: false })
        : new THREE.MeshStandardMaterial({
            color,
            roughness: 0.5,
            metalness: 0.28,
          }),
    );
  return materials.get(key)!;
}
export function Box({
  p = [0, 0, 0],
  s = [1, 1, 1],
  color = "#273c42",
  glow = false,
  rotation = [0, 0, 0],
  pickable = true,
}: {
  p?: Vec3;
  s?: Vec3;
  color?: string;
  glow?: boolean;
  rotation?: Vec3;
  pickable?: boolean;
}) {
  return (
    <mesh
      position={p}
      rotation={rotation}
      scale={s}
      geometry={unitBox}
      raycast={pickable ? THREE.Mesh.prototype.raycast : noRaycast}
      material={material(color, glow)}
      dispose={null}
      castShadow
      receiveShadow
    />
  );
}
export function RepeatedBoxes({
  positions,
  scale,
  color,
}: {
  positions: Vec3[];
  scale: Vec3;
  color: string;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < positions.length; i++) {
      m.compose(
        new THREE.Vector3(...positions[i]),
        new THREE.Quaternion(),
        new THREE.Vector3(...scale),
      );
      ref.current.setMatrixAt(i, m);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }, [positions, scale]);
  return (
    <instancedMesh
      ref={ref}
      args={[unitBox, material(color, false), positions.length]}
      dispose={null}
    />
  );
}
export function Cylinder({
  p = [0, 0, 0],
  radius = 0.5,
  height = 1,
  color = "#344f56",
  segments = 24,
  glow = false,
}: {
  p?: Vec3;
  radius?: number;
  height?: number;
  color?: string;
  segments?: number;
  glow?: boolean;
}) {
  return (
    <mesh position={p} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, segments]} />
      {glow ? (
        <meshBasicMaterial color={color} toneMapped={false} />
      ) : (
        <meshStandardMaterial color={color} metalness={0.35} roughness={0.4} />
      )}
    </mesh>
  );
}
export function Ring({
  p = [0, 0, 0],
  radius = 1,
  tube = 0.025,
  color = cyan,
  rotation = [Math.PI / 2, 0, 0],
}: {
  p?: Vec3;
  radius?: number;
  tube?: number;
  color?: string;
  rotation?: Vec3;
}) {
  return (
    <mesh position={p} rotation={rotation}>
      <torusGeometry args={[radius, tube, 6, 64]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}
export function Deck({
  children,
  accent = cyan,
  width = 4,
  depth = 3.6,
}: {
  children: ReactNode;
  accent?: string;
  width?: number;
  depth?: number;
}) {
  return (
    <>
      <ContactShade width={width + 1.5} depth={depth + 1.5} />
      <Box
        p={[0, 0.08, 0]}
        s={[width + 0.3, 0.16, depth + 0.3]}
        color="#101e26"
      />
      <Box p={[0, 0.23, 0]} s={[width, 0.2, depth]} color="#253b41" />
      <Box
        p={[0, 0.345, 0]}
        s={[width - 0.16, 0.035, depth - 0.16]}
        color="#1a2c33"
      />
      {[-1, 1].map((k) => (
        <Box
          key={k}
          p={[0, 0.36, k * (depth / 2 - 0.08)]}
          s={[width - 0.4, 0.025, 0.025]}
          color={accent}
          glow
        />
      ))}
      {children}
    </>
  );
}
