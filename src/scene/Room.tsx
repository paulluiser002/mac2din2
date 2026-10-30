import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CanvasTexture, Color, DoubleSide, MeshStandardMaterial, PlaneGeometry, PMREMGenerator, RepeatWrapping, Vector3, type DirectionalLight } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createCurtainGeometry, updateCurtainGeometry } from './curtain';
import { fabricColors, getScenePose, type Fabric, type ViewMode } from './pose';

export type RoomState = { progress: number; mode: ViewMode; fabric: Fabric; active: boolean; invalidate?: () => void; onSlow: () => void };
type Triple = [number, number, number];

function Box({ at, size, color, rotation = 0, soft = false }: { at: Triple; size: Triple; color: string; rotation?: number; soft?: boolean }) {
  const geometry = useMemo(() => soft ? new RoundedBoxGeometry(...size, 5, Math.min(...size) * 0.42) : undefined, [soft, ...size]);
  return <mesh position={at} rotation-y={rotation} castShadow receiveShadow geometry={geometry}>
    {!soft && <boxGeometry args={size} />}
    <meshStandardMaterial color={color} roughness={0.88} />
  </mesh>;
}

function Cylinder({ at, radius, height, color, radiusBottom = radius }: { at: Triple; radius: number; height: number; color: string; radiusBottom?: number }) {
  return <mesh position={at} castShadow receiveShadow><cylinderGeometry args={[radius, radiusBottom, height, 48]} /><meshStandardMaterial color={color} roughness={0.8} /></mesh>;
}

function Plant({ at, scale = 1 }: { at: Triple; scale?: number }) {
  return <group position={at} scale={scale}>
    <Cylinder at={[0, 0.28, 0]} radius={0.25} radiusBottom={0.19} height={0.56} color="#b7ac97" />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
      const angle = i * 2.4;
      const height = 0.8 + (i % 4) * 0.28;
      return <group key={i} rotation-y={angle}>
        <mesh position={[0.13, height * 0.5 + 0.4, 0]} rotation-z={-0.16}><cylinderGeometry args={[0.012, 0.018, height, 6]} /><meshStandardMaterial color="#5d6650" /></mesh>
        <mesh position={[0.22, height + 0.32, 0]} rotation={[0.22, angle, -0.5]} scale={[0.15, 0.4, 0.06]} castShadow><sphereGeometry args={[1, 12, 12]} /><meshStandardMaterial color={i % 2 ? '#727d57' : '#87916a'} roughness={0.9} /></mesh>
      </group>;
    })}
  </group>;
}

export default function Room({ state, mobile }: { state: RefObject<RoomState>; mobile: boolean }) {
  const { gl, scene, camera, invalidate, setDpr } = useThree();
  const drapeLeft = useMemo(() => createCurtainGeometry(0.15, -1), []);
  const drapeRight = useMemo(() => createCurtainGeometry(0.15, 1), []);
  const sunlight = useRef<DirectionalLight>(null);
  const current = useRef({ open: 0.15, slow: 0, frames: 0 });
  const target = useMemo(() => new Vector3(0.15, 2.25, 0), []);
  const color = useMemo(() => new Color(fabricColors.stone), []);
  const destination = useMemo(() => new Vector3(), []);
  const sheer = useMemo(() => {
    const geometry = new PlaneGeometry(5.65, 4.82, 160, 20);
    const positions = geometry.getAttribute('position');
    for (let i = 0; i < positions.count; i++) positions.setZ(i, Math.cos(positions.getX(i) * 28) * 0.032);
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  const weave = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const context = canvas.getContext('2d')!;
    const pixels = context.createImageData(64, 64);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
      const value = 180 + ((x + y) % 2 ? 28 : 0) + Math.sin(x * 1.9 + y * 4.7) * 12;
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
  const material = useMemo(() => new MeshStandardMaterial({ color: fabricColors.stone, side: DoubleSide, roughness: 0.95, bumpMap: weave, bumpScale: 0.035 }), [weave]);

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.45;
    state.current.invalidate = invalidate;
    invalidate();
    return () => { environment.dispose(); room.dispose(); pmrem.dispose(); weave.dispose(); material.dispose(); state.current.invalidate = undefined; };
  }, [gl, scene, invalidate, state, weave]);

  useFrame((_, delta) => {
    if (!state.current.active) return;
    const pose = getScenePose(state.current.progress, state.current.mode);
    const blend = 1 - Math.exp(-Math.min(delta, 0.05) * 7);
    const difference = pose.openness - current.current.open;
    if (Math.abs(difference) > 0.0001) {
      current.current.open += difference * blend;
      updateCurtainGeometry(drapeLeft, current.current.open, -1);
      updateCurtainGeometry(drapeRight, current.current.open, 1);
    }
    color.set(fabricColors[state.current.fabric]);
    material.color.lerp(color, blend);
    const [cx, cy, cz] = pose.camera;
    destination.set(mobile ? cx * 0.52 : cx, mobile ? cy + 0.25 : cy, mobile ? cz + 2.2 : cz);
    const cameraMoving = camera.position.distanceTo(destination) > 0.001;
    camera.position.lerp(destination, blend);
    target.lerp(new Vector3(...pose.target), blend);
    camera.lookAt(target);
    if (sunlight.current) sunlight.current.intensity = pose.light * 2.2;
    const colorMoving = Math.abs(material.color.r - color.r) + Math.abs(material.color.g - color.g) + Math.abs(material.color.b - color.b) > 0.001;
    if (Math.abs(difference) > 0.0001 || cameraMoving || colorMoving) {
      if (delta > 0.065 && delta < 0.3) current.current.slow++; else current.current.slow = Math.max(0, current.current.slow - 1);
      if (current.current.slow === 30) setDpr(0.8);
      if (current.current.slow > 100) { state.current.onSlow(); return; }
      invalidate();
    }
  });

  return <>
    <color attach="background" args={['#e8e6df']} />
    <fog attach="fog" args={['#e8e6df', 21, 45]} />
    <ambientLight intensity={0.18} />
    <hemisphereLight args={['#fff7e8', '#a4aa92', 0.7]} />
    <directionalLight ref={sunlight} position={[-3, 7, 4]} intensity={2.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-normalBias={0.025} shadow-bias={-0.0001} />
    <directionalLight position={[2, 5, -5]} intensity={1} color="#fff9dd" />

    <Box at={[0, -0.15, 1]} size={[22, 0.28, 18]} color="#d5d1c3" />
    <Box at={[-6.5, 3.5, -1.75]} size={[6.8, 7, 0.22]} color="#e8e6df" />
    <Box at={[6.5, 3.5, -1.75]} size={[6.8, 7, 0.22]} color="#e8e6df" />
    <Box at={[0, 6.1, -1.75]} size={[6.3, 1.8, 0.22]} color="#e8e6df" />
    <Box at={[0, 0.08, -1.75]} size={[6.3, 0.16, 0.22]} color="#e8e6df" />
    <Box at={[-5.4, 3.2, 2]} size={[0.2, 6.4, 7.7]} color="#eeece5" />
    <mesh position={[0, 2.7, -1.95]}><planeGeometry args={[6.15, 5.1]} /><meshBasicMaterial color="#e7edde" /></mesh>
    {[-2.9, -1.45, 0, 1.45, 2.9].map(x => <Box key={x} at={[x, 2.7, -1.65]} size={[0.035, 4.9, 0.075]} color="#b0b3a7" />)}
    <Box at={[0, 2.7, -1.63]} size={[5.85, 0.035, 0.075]} color="#b0b3a7" />
    <Box at={[0, 5.18, -0.78]} size={[6.4, 0.1, 0.15]} color="#ddd8c8" />

    <mesh geometry={sheer} position={[0, 2.62, -1.32]} receiveShadow><meshStandardMaterial color="#fffef5" side={DoubleSide} transparent opacity={0.68} roughness={0.95} depthWrite={false} /></mesh>
    <mesh geometry={drapeLeft} material={material} castShadow receiveShadow />
    <mesh geometry={drapeRight} material={material} castShadow receiveShadow />

    <Box at={[0, 0.014, 2.3]} size={[6.25, 0.025, 4.6]} color="#c8c1ad" soft />
    <group position={[-1.55, 0, 1.25]} rotation-y={-0.12}>
      <Box at={[0, 0.31, 0]} size={[2.9, 0.35, 1.05]} color="#8f765c" soft />
      <Box at={[0, 0.6, 0.08]} size={[2.7, 0.3, 0.99]} color="#dfd9ca" soft />
      <Box at={[0, 1, -0.48]} size={[2.9, 1.05, 0.32]} color="#d6d0bf" soft />
      {[-0.72, 0.72].map(x => <Box key={x} at={[x, 1.08, -0.27]} size={[1.34, 0.76, 0.25]} color="#e0dacb" soft />)}
      <Box at={[-1.5, 0.8, 0]} size={[0.23, 0.74, 1.2]} color="#d0c7b2" soft />
      <Box at={[1.5, 0.8, 0]} size={[0.23, 0.74, 1.2]} color="#d0c7b2" soft />
      {[-0.78, 0.78].map(x => <Box key={x} at={[x, 0.77, -0.1]} size={[1.3, 0.16, 0.8]} color="#e7e1d3" soft />)}
      <Box at={[-0.92, 1.05, -0.19]} size={[0.51, 0.54, 0.19]} color="#8c947a" rotation={0.1} soft />
      <Box at={[0.92, 1.05, -0.19]} size={[0.51, 0.54, 0.19]} color="#b3a58a" rotation={-0.1} soft />
    </group>
    <group position={[2.35, 0, 1.8]} rotation-y={-0.55}>
      <Box at={[0, 0.6, 0]} size={[1.1, 0.24, 1]} color="#d2ccbb" soft />
      <Box at={[0, 1.02, -0.36]} size={[1.05, 0.85, 0.2]} color="#d2ccbb" soft />
      {[-0.6, 0.6].map(x => <group key={x}><Box at={[x, 0.8, 0]} size={[0.08, 0.12, 1.1]} color="#84745a" /><Box at={[x, 0.37, 0.4]} size={[0.075, 0.74, 0.075]} color="#84745a" /><Box at={[x, 0.37, -0.4]} size={[0.075, 0.74, 0.075]} color="#84745a" /></group>)}
    </group>
    <group position={[-0.15, 0, 3]}>
      <mesh position={[0, 0.47, 0]} scale={[1.32, 1, 0.82]} castShadow receiveShadow><cylinderGeometry args={[0.9, 0.9, 0.12, 64]} /><meshStandardMaterial color="#8d795a" roughness={0.65} /></mesh>
      <Cylinder at={[-0.45, 0.23, 0]} radius={0.13} height={0.44} color="#8d795a" />
      <Cylinder at={[0.45, 0.23, 0]} radius={0.13} height={0.44} color="#8d795a" />
      <Box at={[-0.35, 0.56, 0.02]} size={[0.55, 0.055, 0.4]} color="#e5e2d5" rotation={0.15} />
      <Cylinder at={[0.34, 0.67, -0.05]} radius={0.11} radiusBottom={0.16} height={0.28} color="#bfb6a2" />
    </group>
    <Plant at={[-3.8, 0, -0.2]} scale={1.25} />
    <Cylinder at={[3.7, 0.5, 0]} radius={0.4} height={1} color="#a99b82" />
    <Plant at={[3.7, 1.02, 0]} scale={0.45} />
    <mesh position={[2, 5.3, 1.2]}><cylinderGeometry args={[0.008, 0.008, 1.8, 6]} /><meshStandardMaterial color="#8a8778" /></mesh>
    <mesh position={[2, 4.35, 1.2]} scale={[1, 0.36, 1]} castShadow><sphereGeometry args={[0.63, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><meshStandardMaterial color="#eee8d6" side={DoubleSide} roughness={0.9} /></mesh>
  </>;
}
