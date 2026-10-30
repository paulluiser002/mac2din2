export type ViewMode = 'scroll' | 'sheer' | 'layered' | 'closed';
export type Fabric = 'stone' | 'olive' | 'ivory';
export const fabricColors: Record<Fabric, string> = { stone: '#ad9b85', olive: '#68705b', ivory: '#d8d2c4' };

export function getScenePose(progress: number, mode: ViewMode) {
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const reveal = Math.min(1, p / 0.58);
  const closeup = Math.sin(Math.max(0, (p - 0.38) / 0.62) * Math.PI);
  const openness = mode === 'closed' ? 0 : mode === 'sheer' ? 1 : mode === 'layered' ? 0.68 : 0.15 + reveal * 0.85;
  return {
    openness,
    camera: [6.9 - closeup * 1.5, 3.45 + closeup * 0.25, 10.4 - closeup * 2.4] as [number, number, number],
    target: [0.15, 2.25 + closeup * 0.5, 0] as [number, number, number],
    light: 0.75 + openness * 0.75,
  };
}
