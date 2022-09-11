import { useEffect, useRef } from "react";
import Point from "../../../entities/Point";
import { DEFAULT_MIN_DISTANCE, DEFAULT_FADE } from "../../../utils/constants";
import {
  calcLines,
  drawLines,
  generateSteps,
  getDots,
} from "../../../utils/functions";
import { Mode } from "../../../utils/interfaces";

const HeaderMainSeparator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const sep = canvas.parentElement;
      if (!sep) return;
      const dim = sep.getBoundingClientRect();
      const { width: w, height: h } = dim;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const amount = 100;
      const points = getDots(amount, w, h, Mode.SQUARE);
      const lines = calcLines(points);
      const steps = generateSteps(
        new Uint32Array(199000),
        100,
        lines,
        Mode.SQUARE,
        DEFAULT_MIN_DISTANCE,
        DEFAULT_FADE,
        points,
        99,
        99,
        99,
        99
      );
      drawLines(steps, lines, ctx, 5, 100, "#000");
    }
  });
  return <canvas id="separator-canvas" ref={canvasRef}></canvas>;
};

export default HeaderMainSeparator;
