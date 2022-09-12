import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Line from "../../entities/Line";
import Point from "../../entities/Point";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_FADE,
  DEFAULT_ITERATIONS,
  DEFAULT_MIN_DISTANCE,
  DEFAULT_POINTS,
  MAX_ITERATIONS,
} from "../../utils/constants";
import { calcLines, drawLines, getDots } from "../../utils/functions";
import { Mode } from "../../utils/interfaces";
import { generateSteps } from "../../utils/thread";
import CanvasSection from "./CanvasSection";
import OutputSection from "./OutputSection";
import SetupSection from "./SetupSection";
let minX: number, minY: number, maxX: number, maxY: number;
const Main = () => {
  //. Local State
  //. -----------
  const [pointsAmount, setPointsAmount] = useState<number>(DEFAULT_POINTS);
  const [iterations, setIterations] = useState<number>(DEFAULT_ITERATIONS);
  const [steps, setSteps] = useState<number[]>([]);
  const [points, setPoints] = useState<Map<number, Point>>(new Map());
  const [lines, setLines] = useState<Map<number, Line>>(new Map());

  //. Local References
  //. ----------------
  const drawingRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);

  const canvasesRef = useRef({ drawingRef, pointsRef, imageRef });

  //. Effects
  //. -------
  useEffect(() => {
    handleDrawLines();
  }, [steps, points, lines, drawingRef, iterations]);

  //. Handlers
  //. --------
  const handleDrawLines = () => {
    console.log("attempting to draw lines");
    if (steps.length && points.size && lines.size && drawingRef.current) {
      console.log("and we have everything we need to redraw lines");
      const ctx = drawingRef.current.getContext("2d");
      ctx && drawLines(steps, lines, ctx, 5, iterations, "#000");
    }
  };
  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!drawingRef.current) throw new Error("No drawing canvas loaded");
    if (!pointsRef.current) throw new Error("No points canvas loaded");
    if (!imageRef.current) throw new Error("No image canvas loaded");
    const imageCtx = imageRef.current.getContext("2d");
    if (!imageCtx) throw new Error("No image ctx for imageCanvas");
    const buf32 = new Uint32Array(
      imageCtx.getImageData(
        0,
        0,
        imageRef.current.width,
        imageRef.current.height
      ).data.buffer
    );
    const target = e.target as unknown as HTMLInputElement[];
    const mode = target[1].value as Mode;

    if (!pointsAmount) throw new Error("No points amount set in the form");
    if (!mode) throw new Error("No mode set in the form");
    const points = getDots(
      pointsAmount,
      drawingRef.current.width,
      drawingRef.current.height,
      mode
    );
    setPoints(points);
    const lines = calcLines(points);
    setLines(lines);
    const steps = generateSteps(
      buf32,
      MAX_ITERATIONS,
      lines,
      mode,
      DEFAULT_MIN_DISTANCE,
      DEFAULT_FADE,
      points,
      minX,
      minY,
      maxX,
      maxY
    );
    setSteps(steps);
    console.log("Done generating");
  };

  //. Return
  //. ------
  return (
    <main>
      <div className="mainContainer">
        <SetupSection
          imageRef={imageRef}
          generateHandler={handleGenerate}
          setPointsAmount={setPointsAmount}
        />
        <CanvasSection ref={canvasesRef} />
        <OutputSection setIterations={setIterations} />
      </div>
    </main>
  );
};

export default Main;
