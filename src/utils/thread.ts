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
  used: number[],
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

  for (let i = 0; i < pins.size; i++) {
    if (current === i) continue;
    const pair = pinPair(current, i);

    if (mode === Mode.CIRCLE) {
      const diff = Math.abs(current - i);
      const dist = random((minDistance * 2) / 3, (minDistance * 4) / 3);
      if (diff < dist || diff > pins.size - dist) continue;
    } else {
      const pCurr = pins.get(current);
      const pNext = pins.get(i);
      if (pCurr!.x == minX && pNext!.x == minX) continue;
      if (pCurr!.x == maxX && pNext!.x == maxX) continue;
      if (pCurr!.y == minY && pNext!.y == minY) continue;
      if (pCurr!.y == maxY && pNext!.y == maxY) continue;
      if (pCurr!.x === pNext!.x) {
        const yDiff = Math.abs(pCurr!.y - pNext!.y);
        if (yDiff < squareMinYDiff) continue;
      }
      if (pCurr!.y === pNext!.y) {
        const xDiff = Math.abs(pCurr!.x - pNext!.x);
        if (xDiff < squareMinXDiff) continue;
      }
    }

    // Prevent usage of already used pin pair
    if (used.includes(pair)) continue;

    const line = lines.get(pair);
    if (!line) continue;
    // Calculate line score and save next pin with maximum score
    const score = lineScore(img, line);

    if (score > maxScore) {
      maxScore = score;
      next = i;
    }
  }
  return next;
};
const reduceLine = (data: Uint32Array, line: Line, fade: number) => {
  const temp32 = new Uint32Array(1);
  const temp8 = new Uint8ClampedArray(temp32.buffer);
  if (!line) return data;
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
  const steps: number[] = [];
  const used: number[] = [];
  let current: number = 0;
  steps.push(current);
  let amount = lineAmount;
  for (let i = 0; i < amount; i++) {
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
      amount = used.length;
      return steps;
    }

    // Reduce darkness in image
    const pair = pinPair(current, next);
    img = reduceLine(img, lines.get(pair)!, fade);
    used.push(pair);
    steps.push(next);

    current = next;
  }
  return steps;
};
