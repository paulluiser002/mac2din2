import { BufferGeometry, Float32BufferAttribute } from 'three';

const columns = 96;
const rows = 28;

export function sampleCurtain(u: number, v: number, openness: number, side: -1 | 1) {
  const open = Math.max(0, Math.min(1, openness));
  const width = 2.95 - open * 2.3;
  const fold = u * Math.PI * 22;
  return {
    x: side * (3 - u * width),
    y: 5.05 - v * 4.88 + Math.sin(u * Math.PI * 11) * 0.023 * v * v,
    z: -0.72 + Math.cos(fold + Math.sin(v * 3 + u * 8) * v * 0.18) * (0.1 + v * 0.07 + open * 0.035) + Math.sin(v * Math.PI) * 0.06 + Math.sin(fold * 0.5) * 0.025 * v,
  };
}

export function updateCurtainGeometry(geometry: BufferGeometry, openness: number, side: -1 | 1) {
  const positions = geometry.getAttribute('position');
  for (let row = 0; row <= rows; row++) {
    for (let column = 0; column <= columns; column++) {
      const p = sampleCurtain(column / columns, row / rows, openness, side);
      positions.setXYZ(row * (columns + 1) + column, p.x, p.y, p.z);
    }
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}

export function createCurtainGeometry(openness: number, side: -1 | 1) {
  const geometry = new BufferGeometry();
  const count = (columns + 1) * (rows + 1);
  geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(count * 3), 3));
  const uv: number[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= columns; col++) {
      uv.push(col / columns, row / rows);
      if (row < rows && col < columns) {
        const a = row * (columns + 1) + col;
        if (side === -1) indices.push(a, a + columns + 1, a + 1, a + 1, a + columns + 1, a + columns + 2);
        else indices.push(a, a + 1, a + columns + 1, a + 1, a + columns + 2, a + columns + 1);
      }
    }
  }
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  updateCurtainGeometry(geometry, openness, side);
  return geometry;
}
