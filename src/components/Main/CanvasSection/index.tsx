import React, { ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import {
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
} from "../../../utils/constants";
import Canvas from "./Canvas";
import ImageCanvas from "./ImageCanvas";

type ICanvasSectionProps = {
  className?: string;
  imageOpacity: number;
  drawingOpacity: number;
};
const CanvasSection = React.forwardRef<
  {
    drawingRef: React.RefObject<HTMLCanvasElement>;
    pointsRef: React.RefObject<HTMLCanvasElement>;
    imageRef: React.RefObject<HTMLCanvasElement>;
  },
  ICanvasSectionProps
>((props, ref) => {
  //. Refs
  //. ----
  const { drawingRef, pointsRef, imageRef } = (ref as any)?.current;

  //. Return
  //. ------
  return (
    <>
      <div className="subSection">
        <div className="subSection__content">
          <div className="canvasContainer">
            <ImageCanvas
              ref={imageRef}
              id="imageCanvas"
              w={DEFAULT_CANVAS_WIDTH}
              h={DEFAULT_CANVAS_HEIGHT}
              opacity={props.imageOpacity}
            />
            <Canvas
              ref={drawingRef}
              id="drawingCanvas"
              className="backgroundCanvas"
              w={DEFAULT_CANVAS_WIDTH}
              h={DEFAULT_CANVAS_HEIGHT}
              opacity={props.drawingOpacity}
            />
            <Canvas
              ref={pointsRef}
              id="pointsCanvas"
              className="backgroundCanvas"
              w={DEFAULT_CANVAS_WIDTH}
              h={DEFAULT_CANVAS_HEIGHT}
            />
          </div>
        </div>
      </div>
    </>
  );
});

export default CanvasSection;
