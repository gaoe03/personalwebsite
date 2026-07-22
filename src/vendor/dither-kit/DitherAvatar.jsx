import { useEffect, useRef } from 'react';

// Minimal React 18 port of Dither Kit's standalone avatar primitive.
// Source: https://github.com/Boring-Software-Inc/dither-kit
// Dither Kit is published under the MIT license.
const GRID = 8;
const CELL_SIZE = 4;
const BAYER_4 = [
  [0 / 16, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16],
];

const hashName = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const makeRandom = (seed) => {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
};

const hueToRgb = (hue) => {
  const saturation = 0.52;
  const lightness = 0.52;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const sector = ((hue % 360) + 360) % 360 / 60;
  const second = chroma * (1 - Math.abs((sector % 2) - 1));
  const [red, green, blue] = sector < 1 ? [chroma, second, 0]
    : sector < 2 ? [second, chroma, 0]
      : sector < 3 ? [0, chroma, second]
        : sector < 4 ? [0, second, chroma]
          : sector < 5 ? [second, 0, chroma]
            : [chroma, 0, second];
  const match = lightness - chroma / 2;
  return [red, green, blue].map((channel) => Math.round((channel + match) * 255));
};

const makeModel = (name, hue) => {
  const random = makeRandom(hashName(name));
  const bits = Array.from({ length: 32 }, () => random() < 0.5);
  const vertical = random() < 0.5;
  const densitySeeds = Array.from({ length: 32 }, () => 0.55 + random() * 0.45);
  const cells = [];

  for (let row = 0; row < GRID; row += 1) {
    for (let column = 0; column < GRID; column += 1) {
      const sourceIndex = vertical
        ? Math.min(row, GRID - 1 - row) * GRID + column
        : row * (GRID / 2) + Math.min(column, GRID - 1 - column);
      cells.push({ on: bits[sourceIndex], density: densitySeeds[sourceIndex] });
    }
  }

  return { cells, fill: hueToRgb(hue) };
};

export default function DitherAvatar({ name, hue = 210, size = 18 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const pixels = GRID * CELL_SIZE;
    canvas.width = pixels;
    canvas.height = pixels;
    const model = makeModel(name, hue);

    const draw = (progress) => {
      context.clearRect(0, 0, pixels, pixels);
      model.cells.forEach((cell, cellIndex) => {
        if (!cell.on) return;
        const row = Math.floor(cellIndex / GRID);
        const column = cellIndex % GRID;
        const start = BAYER_4[row % 4][column % 4] * 0.7;
        const cellAlpha = Math.max(0, Math.min(1, (progress - start) / 0.3));
        if (cellAlpha === 0) return;

        for (let y = 0; y < CELL_SIZE; y += 1) {
          for (let x = 0; x < CELL_SIZE; x += 1) {
            const pixelX = column * CELL_SIZE + x;
            const pixelY = row * CELL_SIZE + y;
            const lit = cell.density > BAYER_4[pixelY % 4][pixelX % 4];
            const alpha = (lit ? cell.density : cell.density * 0.35) * cellAlpha;
            context.fillStyle = `rgba(${model.fill.join(',')},${alpha})`;
            context.fillRect(pixelX, pixelY, 1, 1);
          }
        }
      });
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(1);
      return undefined;
    }

    let frame = 0;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / 220, 1);
      draw(1 - (1 - progress) ** 3);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [hue, name]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`${name} wallet avatar`}
      width={GRID * CELL_SIZE}
      height={GRID * CELL_SIZE}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    />
  );
}
