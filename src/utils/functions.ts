import Line from "../entities/Line";
import Point from "../entities/Point";
import { Mode } from "./interfaces";
const W = 500;
export const pinPair = (a: number, b: number) => {
  return a < b ? 10000 * a + b : a + 10000 * b;
};
export const clearCtx = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};
export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
export const bezier = (
  line: Line,
  ctx: CanvasRenderingContext2D,
  variation: number
) => {
  const c1 = new Point(
    Math.round(random(-variation, variation) + (line.p1.x + line.p2.x) / 2),
    Math.round(random(-variation, variation) + (line.p1.y + line.p2.y) / 2)
  );
  ctx.beginPath();
  ctx.lineWidth = 0.3;
  ctx.moveTo(line.p1.x, line.p1.y);
  ctx.quadraticCurveTo(c1.x, c1.y, line.p2.x, line.p2.y);
  ctx.stroke();
  ctx.closePath();
};

export const getPixelsIndexesFromPositions = (pos: Point[]) => {
  const result: number[] = [];
  pos.forEach((p, _i) => {
    const index = p.x + p.y * W;
    result.push(index);
  });
  return result;
};
export const calcLines = (points: Map<number, Point>) => {
  const lines = new Map<number, Line>();
  for (let i = 0; i < points.size; ++i) {
    for (let j = i + 1; j < points.size; ++j) {
      const p1 = points.get(i);
      const p2 = points.get(j);
      if (!p1 || !p2) continue;
      if (p1.x == p2.x) continue;
      lines.set(pinPair(i, j), new Line(p1, p2));
    }
  }
  return lines;
};
export const drawLines = (
  steps: number[],
  lines: Map<number, Line>,
  ctx: CanvasRenderingContext2D,
  variation: number,
  iterations: number,
  color: string,
  noClear: boolean = false
) => {
  !noClear && clearCtx(ctx);
  ctx.strokeStyle = color;
  for (let i = 0; i < iterations - 1; i++) {
    const pair = pinPair(steps[i], steps[i + 1]);
    const line = lines.get(pair);
    line && bezier(line, ctx, variation);
  }
};
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
export const reduceLine = (data: Uint32Array, line: Line, fade: number) => {
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

export const getDots = (amount: number, w: number, h: number, mode: Mode) => {
  const points: Map<number, Point> = new Map();
  if (mode === Mode.CIRCLE) {
    for (let i = 0; i < amount; i++) {
      const x = w / 2 + (w / 2) * Math.cos((2 * Math.PI * i) / amount);
      const y = w / 2 + (w / 2) * Math.sin((2 * Math.PI * i) / amount);
      const point = new Point(Math.round(x), Math.round(y));
      points.set(i, point);
    }
  } else {
    const xPins = (amount * w) / (2 * (h + w));
    const yPins = (amount - 2 * xPins) / 2;
    const spaceX = w / xPins;
    const spaceY = h / yPins;
    // top left -> bottom left
    for (let i = 0; i < yPins; ++i) {
      points.set(points.size, new Point(0, Math.round(spaceY * i)));
    }
    // bottom left -> bottom right
    for (let i = 0; i < xPins; ++i) {
      points.set(points.size, new Point(Math.round(spaceX * i), h));
    }
    // bottom right -> top right
    for (let i = 0; i < yPins; ++i) {
      points.set(points.size, new Point(w, h - Math.round(spaceY * i)));
    }
    // top right -> top left
    for (let i = 0; i < xPins; ++i) {
      points.set(points.size, new Point(w - Math.round(spaceX * i), 0));
    }
  }
  return points;
};
export const getScaledImgSize = (iW: number, iH: number, cW: number) => {
  const ratio = iW / iH;
  const result = {
    width: iW,
    height: iH,
  };

  if (iW >= iH) {
    result.width = cW * ratio;
    result.height = cW;
  } else {
    result.width = cW;
    result.height = cW / ratio;
  }

  return result;
};
export const getImageDataFromFile = async (
  file: File,
  canvasWidth: number
): Promise<ImageData> =>
  new Promise((resolve, reject) => {
    let imageData: ImageData;
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasWidth;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const fr = new FileReader();
    if (!ctx) {
      reject("not good");
      return;
    }
    img.onload = () => {
      const dimensions = getScaledImgSize(img.width, img.height, canvasWidth);
      ctx.drawImage(
        img,
        canvas.width / 2 - dimensions.width / 2,
        canvas.height / 2 - dimensions.height / 2,
        dimensions.width,
        dimensions.height
      );
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };
    fr.onload = () => {
      img.src = fr.result as string;
    };
    fr.readAsDataURL(file);
  });
