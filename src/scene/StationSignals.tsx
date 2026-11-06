import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { stations, type StationId } from "../content/stations";
export default function StationSignals({
  id,
  active,
  motion,
}: {
  id: StationId;
  active: boolean;
  motion: boolean;
}) {
  const root = useRef<Group>(null);
  const color = stations.find((s) => s.id === id)!.accent;
  useFrame(({ clock }) => {
    root.current?.children.forEach((child, i) => {
      const p = (clock.elapsedTime * 0.25 + i / 3) % 1;
      child.position.set(
        (i - 1) * 0.6,
        0.5 + p * 0.3,
        id === "experience" ? 0.9 : 0,
      );
    });
  });
  return (
    <group ref={root} visible={active && motion}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} raycast={() => {}}>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}
