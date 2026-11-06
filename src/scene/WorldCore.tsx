import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Box, Cylinder, Ring, ContactShade } from "./Primitives";
export default function WorldCore({
  motion,
  onHome,
}: {
  motion: boolean;
  onHome: () => void;
}) {
  const ring = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ring.current && motion) ring.current.rotation.y += dt * 0.08;
  });
  return (
    <group
      position={[0, 0, 0.6]}
      name="trunal-core"
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta < 5) onHome();
      }}
    >
      <ContactShade width={5.5} depth={4.8} />
      <Cylinder
        p={[0, 0.22, 0]}
        radius={2.15}
        height={0.3}
        segments={6}
        color="#64715f"
      />
      <Cylinder
        p={[0, 0.42, 0]}
        radius={1.9}
        height={0.12}
        segments={6}
        color="#384c3e"
      />
      <Box p={[0, 0.8, 0]} s={[2.4, 0.6, 1.3]} color="#74836e" />
      <Box p={[0, 1.25, 0.2]} s={[2.9, 0.45, 0.16]} color="#b5c6a4" />
      <Box p={[0, 1.25, 0.3]} s={[2.65, 0.25, 0.025]} color="#bce6c5" glow />
      {[-1, 1].map((k) => (
        <group key={k} rotation={[0, k * 0.6, 0]}>
          <Box p={[k * 1.15, 1.1, 0]} s={[0.2, 1.15, 1]} color="#768a72" />
          <Box
            p={[k * 1.28, 1.15, 0]}
            s={[0.025, 0.8, 0.6]}
            color="#b8d8be"
            glow
          />
        </group>
      ))}
      <group ref={ring}>
        <Ring p={[0, 1.7, 0]} radius={1.7} tube={0.015} color="#b3d8bb" />
        <Box p={[1.7, 1.7, 0]} s={[0.2, 0.08, 0.2]} color="#d4f2cc" glow />
      </group>
    </group>
  );
}
