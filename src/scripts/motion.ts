export function allowsMotion(reducedMotion: boolean, saveData: boolean) {
  return !reducedMotion && !saveData;
}
