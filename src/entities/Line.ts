import { DEFAULT_CANVAS_WIDTH } from "../utils/constants";
import Point from "./Point";
const getPixelsIndexesFromPositions = (pos: Point[]) => {
  const result: number[] = [];
  pos.forEach((p, _i) => {
    const index = p.x + p.y * DEFAULT_CANVAS_WIDTH;
    result.push(index);
  });
  return result;
};
export default class Line {
  p1: Point;
  p2: Point;

  pixelsPosition: Point[];
  pixelsIndexes: number[];
  getPixelsInLine: (p1: Point, p2: Point) => Point[];

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;

    this.getPixelsInLine = (a: Point, b: Point) => {
      const points: Point[] = [];
      const dx = Math.abs(b.x - a.x);
      const dy = -Math.abs(b.y - a.y);
      const sx = a.x < b.x ? 1 : -1;
      const sy = a.y < b.y ? 1 : -1;
      let e = dx + dy,
        e2;
      let px = a.x;
      let py = a.y;
      let condition = true;
      while (condition) {
        points.push(new Point(px, py));
        if (px == b.x && py == b.y) {
          condition = false;
          break;
        }
        e2 = 2 * e;
        if (e2 > dy) {
          e += dy;
          px += sx;
        }
        if (e2 < dx) {
          e += dx;
          py += sy;
        }
      }
      return points;
    };

    this.pixelsPosition = this.getPixelsInLine(this.p1, this.p2);
    this.pixelsIndexes = getPixelsIndexesFromPositions(this.pixelsPosition);
  }
}
