import { HTMLCanvasWithImage } from "../components/NewProject/CanvasSection/ImageCanvas";
import Line from "../entities/Line";
import Point from "../entities/Point";
import { Mode } from "./interfaces";

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

export const calcLines = (points: Map<number, Point>) => {
  const lines = new Map<number, Line>();
  for (let i = 0; i < points.size; ++i) {
    const p1 = points.get(i);
    if (!p1) continue;
    for (let j = i + 1; j < points.size; ++j) {
      const p2 = points.get(j);
      if (!p2 || p1.x === p2.x) continue;
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

export const getDots = (
  amount: number,
  w: number,
  h: number,
  mode: Mode,
  lostWidth: number,
  lostHeight: number
) => {
  let points: Map<number, Point> = new Map();
  if (mode === Mode.CIRCLE) {
    for (let i = 0; i < amount; i++) {
      const x = w / 2 + (w / 2) * Math.cos((2 * Math.PI * i) / amount);
      const y = w / 2 + (w / 2) * Math.sin((2 * Math.PI * i) / amount);
      const point = new Point(Math.round(x), Math.round(y));
      points.set(i, point);
    }
    points.forEach((p) => {
      p.x += lostWidth / 2;
      p.y += lostWidth / 2;
    });
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
    points.forEach((p) => {
      p.x += lostWidth / 2;
      p.y += lostHeight / 2;
    });
  }
  return points;
};
export const getMaxs = (points: Map<number, Point>) => {
  let minX: number = 99999;
  let minY: number = 99999;
  let maxX: number = -1;
  let maxY: number = -1;
  for (let i = 0; i < points.size; i++) {
    const point = points.get(i);
    if (!point) continue;
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }
  return { minX, minY, maxX, maxY };
};
export const drawPoint = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) => {
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
};

export const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string
) => {
  ctx.font = "8px Arial";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

export const drawDots = (
  ctx: CanvasRenderingContext2D,
  dots: Map<number, Point>
) => {
  dots.forEach((dot, i) => {
    drawPoint(ctx, dot.x, dot.y, "#0dc143");
    drawText(ctx, `${i}`, dot.x, dot.y, "#ff0f0f");
  });
};

export const getScaledImgSize = (iW: number, iH: number, cW: number) => {
  const ratio = iW / iH;
  const result = {
    width: iW,
    height: iH,
  };

  if (iW >= iH) {
    result.width = cW;
    result.height = cW / ratio;
  } else {
    result.width = cW * ratio;
    result.height = cW;
  }

  return result;
};

export const getImageDataFromFile = async (
  file: File,
  canvasWidth: number,
  x: number,
  y: number
): Promise<{
  imageData: ImageData;
  image: {
    img: HTMLImageElement;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  };
}> =>
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
      ctx.drawImage(img, x, y, dimensions.width, dimensions.height);
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve({
        imageData,
        image: {
          img,
          width: dimensions.width,
          height: dimensions.height,
          originalWidth: img.width,
          originalHeight: img.height,
        },
      });
    };
    fr.onload = () => {
      img.src = fr.result as string;
    };
    fr.readAsDataURL(file);
  });

export const resizeImage = (
  ref: React.ForwardedRef<HTMLCanvasWithImage>,
  sizeMultiplier: number
) => {
  const result = { drawX: undefined, drawY: undefined };
  if (!ref) return result;
  const canvas: HTMLCanvasWithImage = (ref as any).current;
  if (!canvas || !canvas.file) return result;
  const lastPosMatches = canvas.className.match(/lastPos[X-Y]:-?\d+/g);
  if (!lastPosMatches) return result;
  const lastPosX = Number(lastPosMatches[0].split(":")[1]);
  const lastPosY = Number(lastPosMatches[1].split(":")[1]);
  canvas.file.width = (canvas.file.originalWidth * sizeMultiplier) / 100;
  canvas.file.height = (canvas.file.originalHeight * sizeMultiplier) / 100;
  return { drawX: lastPosX, drawY: lastPosY };
};
