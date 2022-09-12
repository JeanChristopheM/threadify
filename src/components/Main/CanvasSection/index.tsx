import React, { ChangeEvent, useLayoutEffect, useState } from "react";
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
  //. Local State
  //. -----------
  const [imageOpacity, setImageOpacity] = useState<number>(1);
  const [drawingOpacity, setDrawingOpacity] = useState<number>(1);

  //. Refs
  //. ----
  const { drawingRef, pointsRef, imageRef } = (ref as any)?.current;

  //. Handlers
  //. --------

  const handleOpacityChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.name === "imageOpacity")
      setImageOpacity(Number(target.value) / 100);
    if (target.name === "drawingOpacity")
      setDrawingOpacity(Number(target.value) / 100);
  };
  //. Return
  //. ------
  return (
    <section className="mainSection--canvas">
      <div className="sectionHeader">
        <h2>Visualization</h2>
      </div>
      <div className="canvasControls">
        <div className="inputGroup">
          <label htmlFor="imageOpacity">Image</label>
          <input
            type="range"
            name="imageOpacity"
            min="0"
            max="100"
            defaultValue="100"
            onChange={handleOpacityChange}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="drawingOpacity">Thread</label>
          <input
            type="range"
            name="drawingOpacity"
            min="0"
            max="100"
            defaultValue="100"
            onChange={handleOpacityChange}
          />
        </div>
      </div>
      <div className="canvasContainer">
        <Canvas
          ref={drawingRef}
          id="drawingCanvas"
          w={DEFAULT_CANVAS_WIDTH}
          h={DEFAULT_CANVAS_HEIGHT}
          opacity={drawingOpacity}
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
          opacity={imageOpacity}
        />
      </div>
    </section>
  );
});

export default CanvasSection;
