import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  DoubleSide,
  Shape,
  Path,
  ShapeGeometry,
  ExtrudeGeometry,
  Matrix4,
  type Texture,
  type MeshStandardMaterial,
  type InstancedMesh,
  type Group,
} from "three";
import { createClothPull, stepClothPull } from "../scripts/cloth";
import { createCurtainGeometry, updateCurtainGeometry } from "./curtain";
import { getScenePose, windowJourney } from "./pose";
import type { RoomState } from "./Room";

type Triple = [number, number, number];
function Bar({
  at,
  size,
  color = "#62503a",
}: {
  at: Triple;
  size: Triple;
  color?: string;
}) {
  return (
    <mesh position={at} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}
function Outlook({ map, wide = false }: { map: Texture; wide?: boolean }) {
  return (
    <mesh position={[0, wide ? 3 : 2.75, -4.6]}>
      <planeGeometry args={[9.4, 7.2]} />
      <meshBasicMaterial map={map} color="#e5ebe0" />
    </mesh>
  );
}
function RectangularFrame({ wide = false }: { wide?: boolean }) {
  const bottom = wide ? 1.1 : 0.12,
    top = wide ? 4.95 : 5.28,
    height = top - bottom,
    center = (top + bottom) / 2;
  return (
    <>
      {[-3.04, 3.04].map((x) => (
        <Bar
          key={x}
          at={[x, center, -1.76]}
          size={[0.18, height + 0.18, 0.5]}
          color={wide ? "#34312c" : "#3d3830"}
        />
      ))}
      {[bottom, top].map((y) => (
        <Bar
          key={y}
          at={[0, y, -1.76]}
          size={[6.25, 0.18, 0.5]}
          color={wide ? "#34312c" : "#3d3830"}
        />
      ))}
      {[-1.48, 0, 1.48].map((x) => (
        <Bar key={x} at={[x, center, -1.67]} size={[0.06, height, 0.16]} />
      ))}
      <Bar at={[0, center, -1.64]} size={[5.95, 0.06, 0.14]} />
      <Bar
        at={[0, bottom - 0.06, -1.47]}
        size={[6.5, 0.14, 0.78]}
        color="#d4cbbb"
      />
      <mesh position={[0, center, -1.75]}>
        <planeGeometry args={[5.95, height]} />
        <meshPhysicalMaterial
          color="#e5eeeb"
          transparent
          opacity={0.08}
          roughness={0.08}
          depthWrite={false}
        />
      </mesh>
      {[-0.12, 0.12].map((x) => (
        <Bar
          key={x}
          at={[x, center - 0.25, -1.45]}
          size={[0.035, 0.26, 0.08]}
          color="#ad8c4b"
        />
      ))}
    </>
  );
}
function arch<T extends Shape | Path>(
  path: T,
  width: number,
  bottom: number,
  spring: number,
  rise: number,
): T {
  const half = width / 2;
  path.moveTo(-half, bottom);
  path.lineTo(half, bottom);
  path.lineTo(half, spring);
  path.absellipse(0, spring, half, rise, 0, Math.PI, false, 0);
  path.lineTo(-half, bottom);
  path.closePath();
  return path;
}
function ArchedFrame() {
  const { frame, cap } = useMemo(() => {
    const outer = arch(new Shape(), 6.06, 0.08, 3.7, 1.62);
    outer.holes.push(arch(new Path(), 5.76, 0.22, 3.7, 1.46));
    const surround = new Shape();
    surround.moveTo(-3.3, 0);
    surround.lineTo(3.3, 0);
    surround.lineTo(3.3, 5.5);
    surround.lineTo(-3.3, 5.5);
    surround.closePath();
    surround.holes.push(arch(new Path(), 5.77, 0.2, 3.7, 1.47));
    return {
      frame: new ExtrudeGeometry(outer, {
        depth: 0.26,
        bevelEnabled: true,
        bevelSize: 0.012,
        bevelThickness: 0.012,
        bevelSegments: 2,
        curveSegments: 48,
      }),
      cap: new ShapeGeometry(surround, 48),
    };
  }, []);
  useEffect(
    () => () => {
      frame.dispose();
      cap.dispose();
    },
    [frame, cap],
  );
  return (
    <>
      <mesh geometry={cap} position={[0, 0, -1.68]} receiveShadow>
        <meshStandardMaterial color="#eee9df" side={DoubleSide} />
      </mesh>
      <mesh geometry={frame} position={[0, 0, -1.77]} castShadow receiveShadow>
        <meshStandardMaterial color="#8f7045" roughness={0.55} />
      </mesh>
      <Bar at={[0, 2.55, -1.6]} size={[5.75, 0.055, 0.14]} color="#b19a70" />
      {[-1.92, 0, 1.92].map((x) => (
        <Bar
          key={x}
          at={[x, x === 0 ? 2.65 : 2.48, -1.62]}
          size={[0.05, x === 0 ? 4.9 : 4.56, 0.14]}
          color="#b19a70"
        />
      ))}
      <Bar at={[0, 0.14, -1.45]} size={[6.15, 0.16, 0.72]} color="#d6cbb6" />
    </>
  );
}
function Drapes({
  state,
  index,
  material,
  weave,
}: {
  state: RefObject<RoomState>;
  index: 0 | 1;
  material: MeshStandardMaterial;
  weave: Texture;
}) {
  const { invalidate } = useThree();
  const folds = index === 0 ? 11 : 7;
  const geometries = useMemo(
    () => [
      createCurtainGeometry(0, -1, folds),
      createCurtainGeometry(0, 1, folds),
    ],
    [folds],
  );
  const pull = useRef(createClothPull());
  useEffect(
    () => () => geometries.forEach((geometry) => geometry.dispose()),
    [geometries],
  );
  useFrame((_, delta) => {
    if (!state.current.active) return;
    const intro = state.current.introProgress;
    const t =
      intro === undefined ? 0 : Math.max(0, Math.min(1, (intro - 0.25) / 0.75));
    const desired =
      index === 0 && intro !== undefined
        ? 0.28 * t * t * (3 - 2 * t)
        : index === 0 &&
            state.current.journey < 1 / 3 &&
            state.current.mode !== "scroll"
          ? getScenePose(state.current.progress, state.current.mode).openness
          : windowJourney(state.current.journey).openness[index];
    const moving = pull.current.position.some(
      (value, i) =>
        Math.abs(desired - value) > 0.0001 ||
        Math.abs(pull.current.velocity[i]) > 0.001,
    );
    if (moving) {
      stepClothPull(pull.current, desired, delta);
      updateCurtainGeometry(
        geometries[0],
        desired,
        -1,
        folds,
        pull.current.position,
      );
      updateCurtainGeometry(
        geometries[1],
        desired,
        1,
        folds,
        pull.current.position,
      );
      invalidate();
    }
  });
  return (
    <>
      <Bar at={[0, 5.18, -0.78]} size={[6.4, 0.09, 0.14]} color="#ac9365" />
      {index === 0 && (
        <mesh position={[0, 2.62, -1.32]} receiveShadow>
          <planeGeometry args={[5.65, 4.82, 80, 12]} />
          <meshStandardMaterial
            color="#fffdf4"
            transparent
            opacity={0.28}
            side={DoubleSide}
            roughness={1}
            bumpMap={weave}
            bumpScale={0.012}
            depthWrite={false}
          />
        </mesh>
      )}
      {geometries.map((geometry, i) =>
        index === 0 ? (
          <mesh
            key={i}
            geometry={geometry}
            material={material}
            castShadow
            receiveShadow
          />
        ) : (
          <mesh key={i} geometry={geometry} receiveShadow>
            <meshStandardMaterial
              color="#fff8e7"
              transparent
              opacity={0.72}
              side={DoubleSide}
              roughness={1}
              bumpMap={weave}
              bumpScale={0.018}
              depthWrite={false}
            />
          </mesh>
        ),
      )}
    </>
  );
}
function WoodBlinds({ state }: { state: RefObject<RoomState> }) {
  const { invalidate } = useThree();
  const slats = useRef<InstancedMesh>(null),
    cords = useRef<Group>(null);
  const current = useRef(-1);
  const matrix = useMemo(() => new Matrix4(), []);
  useFrame((_, delta) => {
    if (!state.current.active || !slats.current) return;
    const desired = windowJourney(state.current.journey).openness[2];
    if (current.current < 0) current.current = desired;
    else if (Math.abs(desired - current.current) < 0.0001) return;
    else
      current.current +=
        (desired - current.current) *
        (1 - Math.exp(-Math.min(delta, 0.05) * 8));
    const opened = current.current,
      spacing = 0.134 * (1 - opened * 0.2);
    for (let i = 0; i < 28; i++) {
      matrix.makeRotationX(opened * 1.45);
      matrix.setPosition(
        0,
        4.84 - i * spacing,
        -0.69 + Math.sin(i * 0.3) * 0.002,
      );
      slats.current.setMatrixAt(i, matrix);
    }
    slats.current.instanceMatrix.needsUpdate = true;
    if (!slats.current.boundingSphere) slats.current.computeBoundingSphere();
    if (cords.current) {
      cords.current.position.y = 4.84 - (27 * spacing) / 2;
      cords.current.scale.y = 27 * spacing;
    }
    invalidate();
  });
  return (
    <>
      <Bar at={[0, 5.02, -0.75]} size={[6.2, 0.18, 0.28]} color="#4a3724" />
      <instancedMesh
        frustumCulled={false}
        ref={slats}
        args={[undefined, undefined, 28]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[5.85, 0.128, 0.035]} />
        <meshStandardMaterial color="#8e633b" roughness={0.72} />
      </instancedMesh>
      <group ref={cords}>
        {[-1.8, 1.8].map((x) => (
          <mesh key={x} position={[x, 0, -0.57]}>
            <cylinderGeometry args={[0.006, 0.006, 1, 6]} />
            <meshStandardMaterial color="#c9b68f" />
          </mesh>
        ))}
      </group>
    </>
  );
}
export default function WindowDisplays({
  state,
  material,
  weave,
  outlook,
}: {
  state: RefObject<RoomState>;
  material: MeshStandardMaterial;
  weave: Texture;
  outlook: Texture;
}) {
  return (
    <>
      <group>
        <Outlook map={outlook} />
        <RectangularFrame />
        <Drapes state={state} index={0} material={material} weave={weave} />
      </group>
      <group position={[10.5, 0, 0]}>
        <Outlook map={outlook} />
        <ArchedFrame />
        <Drapes state={state} index={1} material={material} weave={weave} />
      </group>
      <group position={[21, 0, 0]}>
        <Outlook map={outlook} wide />
        <RectangularFrame wide />
        <WoodBlinds state={state} />
        <Bar at={[0, 0.55, -1.73]} size={[6.2, 1.1, 0.3]} color="#eee9df" />
        <Bar at={[0, 5.55, -1.73]} size={[6.2, 1.1, 0.3]} color="#eee9df" />
      </group>
    </>
  );
}
