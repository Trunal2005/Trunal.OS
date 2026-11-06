import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as Controls } from "three-stdlib";
import * as THREE from "three";
import { getPose, type StationId } from "../content/stations";
export default function CameraDirector({
  selected,
  projectId,
  motion,
  resetKey,
  skipIntro,
}: {
  selected: StationId | null;
  projectId: string | null;
  motion: boolean;
  resetKey: number;
  skipIntro: boolean;
}) {
  const controls = useRef<Controls>(null);
  const { camera, invalidate, size, events } = useThree();
  const previousMatrix = useRef(new THREE.Matrix4());
  const flight = useRef({
    active: true,
    t: 0,
    started: performance.now(),
    start: new THREE.Vector3(),
    from: new THREE.Vector3(),
    end: new THREE.Vector3(),
    target: new THREE.Vector3(),
  });
  useEffect(() => {
    const pose = getPose(selected, projectId);
    const f = flight.current;
    f.start.copy(camera.position);
    f.from.copy(controls.current?.target ?? new THREE.Vector3());
    f.end.set(...pose.position);
    f.target.set(...pose.target);
    if (size.width < 700 && !selected)
      f.end.multiplyScalar(
        1.3 * Math.max(1, 0.46 / (size.width / size.height)),
      );
    if (size.width < 700 && selected)
      f.end.copy(f.target).add(new THREE.Vector3(10, 10, 15));
    f.t = 0;
    f.started = performance.now();
    f.active = true;
    invalidate();
  }, [
    selected,
    projectId,
    resetKey,
    skipIntro,
    camera,
    invalidate,
    size.width,
    size.height,
  ]);
  useFrame(() => {
    const c = controls.current;
    if (!c) return;
    const f = flight.current;
    if (f.active) {
      f.t =
        motion && !(skipIntro && !selected)
          ? Math.min(1, (performance.now() - f.started) / 950)
          : 1;
      const t = f.t < 0.5 ? 4 * f.t ** 3 : 1 - (-2 * f.t + 2) ** 3 / 2;
      camera.position.lerpVectors(f.start, f.end, t);
      c.target.lerpVectors(f.from, f.target, t);
      c.update();
      if (f.t === 1) f.active = false;
      else invalidate();
    }
    c.target.x = THREE.MathUtils.clamp(c.target.x, -12, 12);
    c.target.z = THREE.MathUtils.clamp(c.target.z, -10, 12);
    c.target.y = THREE.MathUtils.clamp(c.target.y, 0, 4);
    const perspective = camera as THREE.PerspectiveCamera;
    const desiredFov =
      size.height < 600
        ? 43
        : size.width < 700
          ? 58
          : size.width < 900
            ? 58
            : 40;
    if (perspective.fov !== desiredFov) {
      perspective.fov = desiredFov;
      perspective.updateProjectionMatrix();
    }
    if (selected) {
      if (size.width >= 900 || (size.height < 600 && size.width >= 700))
        perspective.setViewOffset(
          size.width,
          size.height,
          Math.min(560, size.width * 0.42) / 2,
          0,
          size.width,
          size.height,
        );
      else
        perspective.setViewOffset(
          size.width,
          size.height,
          0,
          size.height * 0.16,
          size.width,
          size.height,
        );
    } else perspective.clearViewOffset();
    const canvas = document.querySelector<HTMLCanvasElement>(
      ".immersive-canvas canvas",
    );
    if (!previousMatrix.current.equals(camera.matrixWorld)) {
      previousMatrix.current.copy(camera.matrixWorld);
      events.update?.();
    }
    if (canvas) {
      canvas.dataset.flight = f.active ? "moving" : "settled";
      canvas.dataset.camera = JSON.stringify(camera.position.toArray());
      canvas.dataset.target = JSON.stringify(c.target.toArray());
      canvas.dataset.orientation = JSON.stringify(camera.quaternion.toArray());
    }
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan
      enableZoom
      zoomSpeed={0.6}
      panSpeed={0.5}
      rotateSpeed={0.45}
      minDistance={7}
      maxDistance={58}
      minPolarAngle={0.28}
      maxPolarAngle={1.16}
      onStart={() => {
        flight.current.active = false;
        invalidate();
      }}
    />
  );
}
