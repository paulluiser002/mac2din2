export type ViewMode = "scroll" | "sheer" | "layered" | "closed";
export type Fabric = "stone" | "gold" | "ivory";
export const fabricColors: Record<Fabric, string> = {
  stone: "#ad9b85",
  gold: "#b39a63",
  ivory: "#d8d2c4",
};

export function getScenePose(progress: number, mode: ViewMode) {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const reveal = Math.min(1, p / 0.58);
  const closeup = Math.sin(Math.max(0, (p - 0.38) / 0.62) * Math.PI);
  const openness =
    mode === "closed"
      ? 0
      : mode === "sheer"
        ? 1
        : mode === "layered"
          ? 0.68
          : 0.15 + reveal * 0.85;
  return {
    openness,
    camera: [
      6.9 - closeup * 1.5,
      3.45 + closeup * 0.25,
      10.4 - closeup * 2.4,
    ] as [number, number, number],
    target: [0.15, 2.25 + closeup * 0.5, 0] as [number, number, number],
    light: 0.75 + openness * 0.75,
  };
}

type CameraStop = {
  at: number;
  camera: [number, number, number];
  target: [number, number, number];
  warmth: number;
};
const journeyStops: CameraStop[] = [
  { at: 0, camera: [6.9, 3.45, 10.4], target: [0.15, 2.25, 0], warmth: 0 },
  { at: 0.16, camera: [3.8, 3.6, 7.2], target: [0, 2.9, -0.6], warmth: 0.05 },
  {
    at: 0.32,
    camera: [-1.85, 3.1, 0.9],
    target: [-2.7, 3.1, -0.72],
    warmth: 0.1,
  },
  { at: 0.47, camera: [5.2, 3.2, 8.8], target: [0.2, 2.5, -0.2], warmth: 0.25 },
  { at: 0.62, camera: [1.5, 3, 6.8], target: [0, 2.8, -1.1], warmth: 0.95 },
  { at: 0.8, camera: [-0.8, 3.8, 5.6], target: [-1.1, 3.2, -1], warmth: 0.65 },
  { at: 1, camera: [6.4, 3.6, 10.1], target: [0.15, 2.4, 0], warmth: 0.3 },
];
export function journeyCamera(progress: number) {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const next = journeyStops.findIndex((stop) => stop.at >= p);
  const a = journeyStops[Math.max(0, next - 1)],
    b = journeyStops[Math.max(0, next)];
  const t = a === b ? 0 : (p - a.at) / (b.at - a.at);
  const eased = t * t * (3 - 2 * t);
  const mix = (a: number, b: number) => a + (b - a) * eased;
  return {
    x: mix(a.camera[0], b.camera[0]),
    y: mix(a.camera[1], b.camera[1]),
    z: mix(a.camera[2], b.camera[2]),
    target: a.target.map((value, index) => mix(value, b.target[index])) as [
      number,
      number,
      number,
    ],
    warmth: mix(a.warmth, b.warmth),
  };
}
