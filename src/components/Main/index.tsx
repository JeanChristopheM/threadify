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
import {
  calcLines,
  drawLines,
  generateSteps,
  getDots,
} from "../../utils/functions";
import { Mode } from "../../utils/interfaces";
import Canvas from "./Canvas";
import SetupSection from "./SetupSection";

const Main = () => {
  //. Local State
  //. -----------
  const [steps, setSteps] = useState<number[]>([]);
  const [points, setPoints] = useState<Map<number, Point>>(new Map());
  const [lines, setLines] = useState<Map<number, Line>>(new Map());

  //. Local References
  //. ----------------
  const drawingRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLCanvasElement>(null);

  //. Effects
  //. -------
  useEffect(() => {
    if (steps.length && points.size && lines.size && drawingRef.current) {
      const ctx = drawingRef.current.getContext("2d");
      ctx && drawLines(steps, lines, ctx, 5, 100, "#000");
    }
  }, [steps, points, lines, drawingRef]);

  //. Handlers
  //. --------
  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!drawingRef.current) throw new Error("No drawing canvas loaded");
    if (!pointsRef.current) throw new Error("No points canvas loaded");
    if (!imageRef.current) throw new Error("No image canvas loaded");
    const target = e.target as unknown as HTMLInputElement[];
    const pointsAmount = Number(target[0].value);
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
      new Uint32Array(20),
      MAX_ITERATIONS,
      lines,
      mode,
      DEFAULT_MIN_DISTANCE,
      DEFAULT_FADE,
      points,
      999,
      999,
      999,
      999
    );
    setSteps(steps);
    console.log("Done generating");
  };

  //. Return
  //. ------
  return (
    <main>
      <div className="mainContainer">
        <SetupSection imageRef={imageRef} generateHandler={handleGenerate} />
        <section className="mainSection--canvas">
          <Canvas
            ref={drawingRef}
            id="drawingCanvas"
            w={DEFAULT_CANVAS_WIDTH}
            h={DEFAULT_CANVAS_HEIGHT}
          />
          <Canvas
            ref={pointsRef}
            id="pointsCanvas"
            className="backgroundCanvas"
            w={DEFAULT_CANVAS_WIDTH}
            h={DEFAULT_CANVAS_HEIGHT}
          />
          <Canvas
            ref={imageRef}
            id="imageCanvas"
            className="backgroundCanvas"
            w={DEFAULT_CANVAS_WIDTH}
            h={DEFAULT_CANVAS_HEIGHT}
          />
        </section>
        <section className="mainSection--output">
          <label htmlFor="iterationsSlider">Number of steps</label>
          <input
            type="range"
            name="iterationsSlider"
            min="100"
            max="5000"
            defaultValue={DEFAULT_ITERATIONS}
          />
        </section>
      </div>
    </main>
  );
};

export default Main;
