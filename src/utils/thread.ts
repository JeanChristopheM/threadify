import Line from "../entities/Line";
import Point from "../entities/Point";
import { pinPair, random } from "./functions";
import { Mode } from "./interfaces";

const lineScore = (img: Uint32Array, line: Line) => {
  let score: number = 0;
  line.pixelsIndexes.forEach((i) => {
    const color = img[i] & 0xff;
    score += 0xff - color;
  });
  return score / line.pixelsIndexes.length;
};

const nextPin = (
  current: number,
  lines: Map<number, Line>,
  // used: number[],
  used: Set<number>,
  img: Uint32Array,
  minDistance: number,
  pins: Map<number, Point>,
  mode: Mode,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
) => {
  let maxScore: number = 0;
  let next = -1;
  const squareMinXDiff = maxX - minX;
  const squareMinYDiff = maxY - minY;
  const pinsAmount = pins.size;
  const distMin = (minDistance * 2) / 3;
  const distMax = (minDistance * 4) / 3;
  for (const [i] of pins) {
    if (current === i) continue;
    const pairId = pinPair(current, i);
    const line = lines.get(pairId);
    if (!line) continue;
    // Prevent usage of already used line
    // if (used.includes(pairId)) continue;
    if (used.has(pairId)) continue;

    if (mode === Mode.CIRCLE) {
      const diff = Math.abs(current - i);
      const dist = random(distMin, distMax);
      // Prevent lines that are too short to be considered
      if (diff < dist || diff > pinsAmount - dist) continue;
    } else {
      const pCurr = pins.get(current)!;
      const pNext = pins.get(i)!;

      // Prevent lines that are on pins plane to be considered
      if (pCurr.x == minX && pNext.x == minX) continue;
      if (pCurr.x == maxX && pNext.x == maxX) continue;
      if (pCurr.y == minY && pNext.y == minY) continue;
      if (pCurr.y == maxY && pNext.y == maxY) continue;

      // Prevent lines that share a point &&
      // are at a too sharp of an angle to be considered
      if (pCurr.x === pNext.x) {
        const yDiff = Math.abs(pCurr.y - pNext.y);
        if (yDiff < squareMinYDiff) continue;
      }
      if (pCurr.y === pNext.y) {
        const xDiff = Math.abs(pCurr.x - pNext.x);
        if (xDiff < squareMinXDiff) continue;
      }
    }

    // Calculate line score and save next pin with maximum score
    const score = lineScore(img, line);
    // const score = lineScoreMemoized(img, line);

    if (score > maxScore) {
      maxScore = score;
      next = i;
    }
  }
  return next;
};

const reduceLine = (data: Uint32Array, line: Line, fade: number) => {
  if (!line) return data;
  const temp32 = new Uint32Array(1);
  const temp8 = new Uint8ClampedArray(temp32.buffer);
  line.pixelsIndexes.forEach((i) => {
    temp32[0] = data[i];
    temp8.forEach((_v, temp8index) => {
      temp8[temp8index] += fade;
    });
    data[i] =
      (255 << 24) | // alpha
      (temp8[2] << 16) | // blue
      (temp8[1] << 8) | // green
      temp8[0]; // red
  });
  return data;
};

export const generateSteps = (
  img: Uint32Array,
  lineAmount: number,
  lines: Map<number, Line>,
  mode: Mode,
  minDistance: number,
  fade: number,
  pins: Map<number, Point>,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
) => {
  const steps: number[] = new Array(lineAmount + 1);
  const used: Set<number> = new Set();
  let current = 0;
  let i = 0;
  steps[i++] = current;

  while (i <= lineAmount) {
    // Get next pin
    const next = nextPin(
      current,
      lines,
      used,
      img,
      mode === Mode.CIRCLE ? minDistance : -999,
      pins,
      mode,
      minX,
      minY,
      maxX,
      maxY
    );
    if (next < 0) {
      lineAmount = used.size;
      steps.length = i;
      return steps;
    }

    const pairId = pinPair(current, next);
    // Reduce darkness in image
    img = reduceLine(img, lines.get(pairId)!, fade);
    used.add(pairId);
    steps[i++] = next;

    current = next;
  }
  return steps;
};
