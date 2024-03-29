import React, { useEffect, useRef, useState } from "react";
import {
  UNSAFE_NavigationContext as NavigationContext,
  useLocation,
} from "react-router-dom";
import Line from "../../entities/Line";
import Point from "../../entities/Point";
import {
  DEFAULT_FADE,
  DEFAULT_ITERATIONS,
  DEFAULT_MIN_DISTANCE,
  DEFAULT_POINTS,
  MAX_ITERATIONS,
} from "../../utils/constants";
import {
  calcLines,
  clearCtx,
  drawDots,
  drawLines,
  getDots,
  getMaxs,
} from "../../utils/functions";
import { Mode } from "../../utils/interfaces";
import { generateSteps } from "../../utils/thread";
import ArtSettingsSection from "./ArtSettingsSection";
import { HTMLCanvasWithImage } from "./CanvasSection/ImageCanvas";
import FormSteps from "./FormSteps";
import ImageSection from "./ImageSection";
import OutputSection from "./OutputSection";
import SetupSection from "./SetupSection";
import Spinner from "./Spinner";

const NewProject = () => {
  //. Local State
  //. -----------
  // * UI *
  const [formStep, setFormStep] = useState<number>(1);

  const [generating, setGenerating] = useState<boolean>(false);

  // * ART VARIABLES *
  const [mode, setMode] = useState<Mode>(Mode.CIRCLE);

  const [pointsAmount, setPointsAmount] = useState<number>(DEFAULT_POINTS);
  const [points, setPoints] = useState<Map<number, Point>>(new Map());

  const [iterations, setIterations] = useState<number>(DEFAULT_ITERATIONS);
  const [steps, setSteps] = useState<number[]>([]);
  const [stepsDisplay, setStepsDisplay] = useState<string[]>([]);

  const [lines, setLines] = useState<Map<number, Line>>(new Map());

  const [artWidth, setArtWidth] = useState<number>(100);
  const [artHeight, setArtHeight] = useState<number>(100);

  //. Local References
  //. ----------------
  const drawingRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLCanvasWithImage>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const canvasesRef = useRef({ drawingRef, pointsRef, imageRef });

  //. Effects
  //. -------
  // * Changing points when mode/pointsAmount changes
  useEffect(() => {
    if (!drawingRef.current) return;
    const width = Math.floor(drawingRef.current.width * (artWidth / 100));
    const height = Math.floor(drawingRef.current.height * (artHeight / 100));
    const lostWidth = drawingRef.current.width - width;
    const lostHeight = drawingRef.current.height - height;
    setPoints(
      getDots(pointsAmount, width, height, mode, lostWidth, lostHeight)
    );
  }, [pointsAmount, drawingRef.current, mode, artWidth, artHeight]);
  // * Drawing lines when something changes
  useEffect(() => {
    if (points) handleDrawLines();
  }, [steps, lines, drawingRef, iterations]);
  // * Drawing points when they change
  useEffect(() => {
    if (points.size) handleDrawPoints();
  }, [points]);

  //* Form Steps
  useEffect(() => {
    scrollSteps("smooth");
  }, [formStep, generating]);

  //* Resize listener
  useEffect(() => {
    const handleResize = () => {
      scrollSteps();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  //. Handlers
  //. --------
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  };

  const handleDrawLines = () => {
    if (steps.length && points.size && lines.size && drawingRef.current) {
      const ctx = drawingRef.current.getContext("2d");
      ctx && drawLines(steps, lines, ctx, 5, iterations, "#000");
    }
  };

  const handleDrawPoints = () => {
    if (!pointsRef.current) return;
    const ctx = pointsRef.current.getContext("2d");
    if (!ctx) return;
    clearCtx(ctx);
    drawDots(ctx, points);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setTimeout(() => {
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

      if (!pointsAmount || !points)
        throw new Error("No points amount set in the form");
      const { minX, minY, maxX, maxY } = getMaxs(points);

      const lines = calcLines(points);
      setLines(lines);
      console.time("1");
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
      console.timeEnd("1");
      setSteps(steps);

      setStepsDisplay(
        steps.reduce((acc: string[], cur: number, i: number) => {
          steps[i + 1] && acc.push(`${cur} -> ${steps[i + 1]}`);
          if (i === steps.length - 1) acc.push(`||0`);
          return acc;
        }, [])
      );

      console.log("Done generating");
    }, 10);
    setTimeout(() => {
      setGenerating(false);
    }, 10);
  };
  const scrollSteps = (behavior?: ScrollBehavior) => {
    const container = document.querySelector(".sectionWrapper");
    if (!container || generating) return;
    const containerWidth = container.clientWidth;
    container.scrollTo({
      top: 0,
      left: (formStep - 1) * containerWidth,
      behavior,
    });
  };

  //. Return
  //. ------
  return (
    <>
      <Spinner active={generating} />
      <div className="newProject">
        <FormSteps
          formStep={formStep}
          totalSteps={3}
          setFormStep={setFormStep}
        />
        <div className="sectionWrapper">
          <ImageSection
            previewRef={previewRef}
            imageRef={imageRef}
            setFormStep={setFormStep}
          />
          {/* <ArtSettingsSection /> */}
          <SetupSection
            generateHandler={handleGenerate}
            setPointsAmount={setPointsAmount}
            modeSetter={handleModeChange}
            artWidthSetter={setArtWidth}
            artHeightSetter={setArtHeight}
            setFormStep={setFormStep}
            canvasesRef={canvasesRef}
            setIterations={setIterations}
          />
          <OutputSection
            steps={steps}
            stepsDisplay={stepsDisplay}
            setStepsDisplay={setStepsDisplay}
            lines={lines}
            iterations={iterations}
          />
        </div>
      </div>
    </>
  );
};

export default NewProject;
