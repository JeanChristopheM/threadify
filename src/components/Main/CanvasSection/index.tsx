import React, { useLayoutEffect } from "react";
import {
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
} from "../../../utils/constants";
import Canvas from "../Canvas";

type ICanvasSectionProps = {};
const CanvasSection = React.forwardRef<
  {
    drawingRef: React.RefObject<HTMLCanvasElement>;
    pointsRef: React.RefObject<HTMLCanvasElement>;
    imageRef: React.RefObject<HTMLCanvasElement>;
  },
  ICanvasSectionProps
>((_props, ref) => {
  const { drawingRef, pointsRef, imageRef } = (ref as any)?.current;
  return (
    <section className="mainSection--canvas">
      <div className="sectionHeader">
        <h2>Visualization</h2>
      </div>
      <div className="canvasContainer">
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
      </div>
    </section>
  );
});

export default CanvasSection;
