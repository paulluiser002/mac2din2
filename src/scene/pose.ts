export type ViewMode = "scroll" | "sheer" | "layered" | "closed";
export type Fabric = "stone" | "gold" | "ivory";
export const fabricColors: Record<Fabric, string> = {
  stone: "#9d9487",
  gold: "#bf9a54",
  ivory: "#e8e0ce",
};

export const fabricLabels: Record<Fabric, string> = {
  stone: "Stone",
  gold: "Champagne",
  ivory: "Ivory",
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
  { at: 0.16, camera: [1.6, 3.4, 4.2], target: [0, 2.9, -0.8], warmth: 0.12 },
  { at: 0.28, camera: [6.8, 3.7, 9.4], target: [3.2, 2.7, -0.8], warmth: 0.2 },
  { at: 0.4, camera: [14.5, 3.6, 8.6], target: [10.5, 2.7, -0.7], warmth: 0.3 },
  { at: 0.52, camera: [11.8, 3.3, 5.5], target: [10.5, 3, -1], warmth: 0.5 },
  { at: 0.63, camera: [19, 3.7, 9.5], target: [16.2, 2.8, -0.7], warmth: 0.95 },
  { at: 0.76, camera: [26.7, 3.4, 10], target: [21, 2.7, -0.6], warmth: 0.8 },
  { at: 0.87, camera: [23, 3.2, 6.8], target: [21, 3, -1], warmth: 0.6 },
  { at: 1, camera: [27.2, 3.8, 11], target: [21, 2.5, -0.5], warmth: 0.3 },
];
export const windowLabels = [
  "Pleated drapes & sheers",
  "Arched window · Linen curtains",
  "Wide window · Wood blinds",
] as const;
export function windowJourney(progress: number) {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const smooth = (value: number) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  };
  const openness = [0, 1, 2].map((i) => {
    const local = p * 3 - i;
    return (
      (i === 0 ? 0.28 + 0.72 * smooth(local / 0.4) : smooth(local / 0.4)) *
      (1 - smooth((local - 0.62) / 0.38))
    );
  });
  const index = Math.min(2, Math.floor(p * 3));
  return { index, openness, label: windowLabels[index] };
}
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

export function introCamera(progress: number, mobile: boolean) {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const t = p * p * (3 - 2 * p),
    end = journeyCamera(0);
  const cameraEnd = [
    mobile ? end.target[0] + (end.x - end.target[0]) * 0.48 : end.x,
    end.y + (mobile ? 0.25 : 0),
    end.z + (mobile ? 2.2 : 0),
  ];
  const camera = [1.5, 3.2, 0.55].map(
    (value, index) => value + (cameraEnd[index] - value) * t,
  ) as [number, number, number];
  const target = [1.5, 3.2, -0.72].map(
    (value, index) => value + (end.target[index] - value) * t,
  ) as [number, number, number];
  return { camera, target };
}
