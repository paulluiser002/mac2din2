import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import {
  CanvasTexture,
  Color,
  TextureLoader,
  SRGBColorSpace,
  DoubleSide,
  MeshStandardMaterial,
  PMREMGenerator,
  RepeatWrapping,
  Vector3,
  type DirectionalLight,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import WindowDisplays from "./WindowDisplays";
import {
  fabricColors,
  getScenePose,
  journeyCamera,
  introCamera,
  type Fabric,
  type ViewMode,
} from "./pose";

export type RoomState = {
  progress: number;
  journey: number;
  mode: ViewMode;
  fabric: Fabric;
  active: boolean;
  introProgress?: number;
  invalidate?: () => void;
  onSlow: () => void;
};
type Triple = [number, number, number];

function Box({
  at,
  size,
  color,
  rotation = 0,
  soft = false,
}: {
  at: Triple;
  size: Triple;
  color: string;
  rotation?: number;
  soft?: boolean;
}) {
  const geometry = useMemo(
    () =>
      soft
        ? new RoundedBoxGeometry(...size, 5, Math.min(...size) * 0.42)
        : undefined,
    [soft, ...size],
  );
  return (
    <mesh
      position={at}
      rotation-y={rotation}
      castShadow
      receiveShadow
      geometry={geometry}
    >
      {!soft && <boxGeometry args={size} />}
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  );
}

function Cylinder({
  at,
  radius,
  height,
  color,
  radiusBottom = radius,
}: {
  at: Triple;
  radius: number;
  height: number;
  color: string;
  radiusBottom?: number;
}) {
  return (
    <mesh position={at} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radiusBottom, height, 48]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

function Plant({ at, scale = 1 }: { at: Triple; scale?: number }) {
  return (
    <group position={at} scale={scale}>
      <Cylinder
        at={[0, 0.28, 0]}
        radius={0.25}
        radiusBottom={0.19}
        height={0.56}
        color="#b7ac97"
      />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const angle = i * 2.4;
        const height = 0.8 + (i % 4) * 0.28;
        return (
          <group key={i} rotation-y={angle}>
            <mesh position={[0.13, height * 0.5 + 0.4, 0]} rotation-z={-0.16}>
              <cylinderGeometry args={[0.012, 0.018, height, 6]} />
              <meshStandardMaterial color="#5d6650" />
            </mesh>
            <mesh
              position={[0.22, height + 0.32, 0]}
              rotation={[0.22, angle, -0.5]}
              scale={[0.15, 0.4, 0.06]}
              castShadow
            >
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial
                color={i % 2 ? "#727d57" : "#87916a"}
                roughness={0.9}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function Room({
  state,
  mobile,
  onReady,
}: {
  state: RefObject<RoomState>;
  mobile: boolean;
  onReady: (canvas: HTMLCanvasElement) => void;
}) {
  const { gl, scene, camera, invalidate, setDpr } = useThree();
  const [outlook, clothTexture] = useLoader(TextureLoader, [
    "/media/window-garden.webp",
    "/media/entrance-fabric.webp",
  ]);
  clothTexture.colorSpace = SRGBColorSpace;
  outlook.colorSpace = SRGBColorSpace;
  const firstFrame = useRef(false);
  const introStart = useRef<number | null>(null);
  const readyFrame = useRef(0);
  const sunlight = useRef<DirectionalLight>(null);
  const current = useRef({ slow: 0 });
  const target = useMemo(() => new Vector3(0.15, 2.25, 0), []);
  const color = useMemo(() => new Color(fabricColors.stone), []);
  const lookDestination = useMemo(() => new Vector3(), []);
  const daySun = useMemo(() => new Color("#fff7e6"), []);
  const goldenSun = useMemo(() => new Color("#ffc885"), []);
  const destination = useMemo(() => new Vector3(), []);
  const weave = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d")!;
    const pixels = context.createImageData(64, 64);
    for (let y = 0; y < 64; y++)
      for (let x = 0; x < 64; x++) {
        const value =
          180 + ((x + y) % 2 ? 28 : 0) + Math.sin(x * 1.9 + y * 4.7) * 12;
        const i = (y * 64 + x) * 4;
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
        pixels.data[i + 3] = 255;
      }
    context.putImageData(pixels, 0, 0);
    const texture = new CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(18, 35);
    return texture;
  }, []);
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: fabricColors.stone,
        side: DoubleSide,
        roughness: 0.95,
        bumpMap: clothTexture,
        bumpScale: 0.018,
      }),
    [weave, clothTexture],
  );

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.45;
    state.current.invalidate = invalidate;
    invalidate();
    return () => {
      cancelAnimationFrame(readyFrame.current);
      environment.dispose();
      room.dispose();
      pmrem.dispose();
      weave.dispose();
      material.dispose();
      state.current.invalidate = undefined;
    };
  }, [gl, scene, invalidate, state, weave]);

  useFrame((_, delta) => {
    if (!firstFrame.current) {
      firstFrame.current = true;
      readyFrame.current = requestAnimationFrame(() => onReady(gl.domElement));
    }
    if (!state.current.active) return;
    const pose = getScenePose(state.current.progress, state.current.mode);
    const blend = 1 - Math.exp(-Math.min(delta, 0.05) * 7);
    color.set(fabricColors[state.current.fabric]);
    material.color.lerp(color, blend);
    const journey = journeyCamera(state.current.journey);
    destination.set(
      mobile
        ? journey.target[0] + (journey.x - journey.target[0]) * 0.48
        : journey.x,
      journey.y + (mobile ? 0.25 : 0),
      journey.z + (mobile ? 2.2 : 0),
    );
    const opening = document.getElementById("opening-curtain");
    const introActive =
      document.documentElement.classList.contains("intro-controlled") &&
      opening &&
      !opening.hidden &&
      opening.dataset.revealSource !== "fallback";
    let cameraMoving = false,
      targetMoving = false;
    if (introActive) {
      if (introStart.current === null) introStart.current = performance.now();
      const progress = Math.min(
        1,
        (performance.now() - introStart.current) / 2200,
      );
      state.current.introProgress = progress;
      const pose = introCamera(progress, mobile);
      camera.position.set(...pose.camera);
      target.set(...pose.target);
      cameraMoving = progress < 1;
    } else {
      state.current.introProgress = undefined;
      cameraMoving = camera.position.distanceTo(destination) > 0.001;
      camera.position.lerp(destination, blend);
      lookDestination.set(...journey.target);
      targetMoving = target.distanceTo(lookDestination) > 0.001;
      target.lerp(lookDestination, blend);
    }
    camera.lookAt(target);
    if (sunlight.current) {
      sunlight.current.intensity = pose.light * (2.2 - journey.warmth * 0.45);
      sunlight.current.color.copy(daySun).lerp(goldenSun, journey.warmth);
    }
    const colorMoving =
      Math.abs(material.color.r - color.r) +
        Math.abs(material.color.g - color.g) +
        Math.abs(material.color.b - color.b) >
      0.001;
    if (cameraMoving || targetMoving || colorMoving) {
      if (delta > 0.065 && delta < 0.3) current.current.slow++;
      else current.current.slow = Math.max(0, current.current.slow - 1);
      if (current.current.slow === 30) setDpr(0.8);
      if (current.current.slow > 100) {
        state.current.onSlow();
        return;
      }
      invalidate();
    }
  });

  return (
    <>
      <color attach="background" args={["#eee9df"]} />
      <fog attach="fog" args={["#eee9df", 21, 45]} />
      <ambientLight intensity={0.18} />
      <hemisphereLight args={["#fff8e8", "#a99a80", 0.8]} />
      <directionalLight
        ref={sunlight}
        position={[-3, 7, 4]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-12}
        shadow-camera-right={34}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-normalBias={0.025}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[2, 5, -5]} intensity={1} color="#fff9dd" />

      <Box at={[10.5, -0.15, 1]} size={[52, 0.28, 18]} color="#d5d1c3" />
      {[-5.25, 5.25, 15.75, 26.25].map((x) => (
        <Box
          key={x}
          at={[x, 3.5, -1.75]}
          size={[4.2, 7, 0.24]}
          color="#eee9df"
        />
      ))}
      <Box at={[10.5, 6.1, -1.75]} size={[40, 1.8, 0.24]} color="#eee9df" />
      <Box at={[10.5, 0.08, -1.75]} size={[40, 0.16, 0.24]} color="#eee9df" />
      <WindowDisplays
        state={state}
        material={material}
        weave={weave}
        outlook={outlook}
      />
      <Box
        at={[10.5, 0.35, 0.8]}
        size={[3.2, 0.12, 0.7]}
        color="#a48558"
        soft
      />
      <Box at={[9.3, 0.16, 0.8]} size={[0.12, 0.35, 0.6]} color="#8d7049" />
      <Box at={[11.7, 0.16, 0.8]} size={[0.12, 0.35, 0.6]} color="#8d7049" />
      <Box
        at={[0, 0.014, 2.3]}
        size={[6.25, 0.025, 4.6]}
        color="#c8c1ad"
        soft
      />
      <group position={[-1.55, 0, 1.25]} rotation-y={-0.12}>
        <Box at={[0, 0.31, 0]} size={[2.9, 0.35, 1.05]} color="#8f765c" soft />
        <Box at={[0, 0.6, 0.08]} size={[2.7, 0.3, 0.99]} color="#dfd9ca" soft />
        <Box at={[0, 1, -0.48]} size={[2.9, 1.05, 0.32]} color="#d6d0bf" soft />
        {[-0.72, 0.72].map((x) => (
          <Box
            key={x}
            at={[x, 1.08, -0.27]}
            size={[1.34, 0.76, 0.25]}
            color="#e0dacb"
            soft
          />
        ))}
        <Box
          at={[-1.5, 0.8, 0]}
          size={[0.23, 0.74, 1.2]}
          color="#d0c7b2"
          soft
        />
        <Box at={[1.5, 0.8, 0]} size={[0.23, 0.74, 1.2]} color="#d0c7b2" soft />
        {[-0.78, 0.78].map((x) => (
          <Box
            key={x}
            at={[x, 0.77, -0.1]}
            size={[1.3, 0.16, 0.8]}
            color="#e7e1d3"
            soft
          />
        ))}
        <Box
          at={[-0.92, 1.05, -0.19]}
          size={[0.51, 0.54, 0.19]}
          color="#8c947a"
          rotation={0.1}
          soft
        />
        <Box
          at={[0.92, 1.05, -0.19]}
          size={[0.51, 0.54, 0.19]}
          color="#b3a58a"
          rotation={-0.1}
          soft
        />
      </group>
      <group position={[2.35, 0, 1.8]} rotation-y={-0.55}>
        <Box at={[0, 0.6, 0]} size={[1.1, 0.24, 1]} color="#d2ccbb" soft />
        <Box
          at={[0, 1.02, -0.36]}
          size={[1.05, 0.85, 0.2]}
          color="#d2ccbb"
          soft
        />
        {[-0.6, 0.6].map((x) => (
          <group key={x}>
            <Box at={[x, 0.8, 0]} size={[0.08, 0.12, 1.1]} color="#84745a" />
            <Box
              at={[x, 0.37, 0.4]}
              size={[0.075, 0.74, 0.075]}
              color="#84745a"
            />
            <Box
              at={[x, 0.37, -0.4]}
              size={[0.075, 0.74, 0.075]}
              color="#84745a"
            />
          </group>
        ))}
      </group>
      <group position={[-0.15, 0, 3]}>
        <mesh
          position={[0, 0.47, 0]}
          scale={[1.32, 1, 0.82]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.9, 0.9, 0.12, 64]} />
          <meshStandardMaterial color="#8d795a" roughness={0.65} />
        </mesh>
        <Cylinder
          at={[-0.45, 0.23, 0]}
          radius={0.13}
          height={0.44}
          color="#8d795a"
        />
        <Cylinder
          at={[0.45, 0.23, 0]}
          radius={0.13}
          height={0.44}
          color="#8d795a"
        />
        <Box
          at={[-0.35, 0.56, 0.02]}
          size={[0.55, 0.055, 0.4]}
          color="#e5e2d5"
          rotation={0.15}
        />
        <Cylinder
          at={[0.34, 0.67, -0.05]}
          radius={0.11}
          radiusBottom={0.16}
          height={0.28}
          color="#bfb6a2"
        />
      </group>
      <Plant at={[-3.8, 0, -0.2]} scale={1.25} />
      <Cylinder at={[3.7, 0.5, 0]} radius={0.4} height={1} color="#a99b82" />
      <Plant at={[3.7, 1.02, 0]} scale={0.45} />
    </>
  );
}
