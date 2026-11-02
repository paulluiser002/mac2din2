export function createClothPull() {
  return { position: new Float32Array(8), velocity: new Float32Array(8) };
}

export function stepClothPull(
  state: ReturnType<typeof createClothPull>,
  target: number,
  delta: number,
) {
  const duration = Math.max(
    0,
    Math.min(0.1, Number.isFinite(delta) ? delta : 0),
  );
  const steps = Math.max(1, Math.ceil(duration * 120));
  const dt = duration / steps;
  const goal = Math.max(0, Math.min(1, target));
  for (let step = 0; step < steps; step++) {
    // Integrate from the hem upwards so tension propagates through the hanging cloth.
    for (let i = state.position.length - 1; i >= 0; i--) {
      const desired =
        i === 0 ? goal : state.position[i - 1] * 0.65 + goal * 0.35;
      state.velocity[i] +=
        ((desired - state.position[i]) * 400 - state.velocity[i] * 30) * dt;
      state.position[i] = Math.max(
        0,
        Math.min(1.03, state.position[i] + state.velocity[i] * dt),
      );
    }
  }
}
