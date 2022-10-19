import React, { ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import {
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
} from "../../../utils/constants";
import Canvas from "./Canvas";
import ImageCanvas from "./ImageCanvas";

type ICanvasSectionProps = {
  className?: string;
};
const CanvasSection = React.forwardRef<
  {
    drawingRef: React.RefObject<HTMLCanvasElement>;
    pointsRef: React.RefObject<HTMLCanvasElement>;
    imageRef: React.RefObject<HTMLCanvasElement>;
  },
  ICanvasSectionProps
>((props, ref) => {
  //. Local State
  //. -----------
  const [imageOpacity, setImageOpacity] = useState<number>(1);
  const [drawingOpacity, setDrawingOpacity] = useState<number>(1);

  //. Refs
  //. ----
  const { drawingRef, pointsRef, imageRef } = (ref as any)?.current;
  const imageSliderRef = useRef<HTMLInputElement | null>(null);
  const drawingSliderRef = useRef<HTMLInputElement | null>(null);

  //. Handlers
  //. --------

  const handleOpacityChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.name === "imageOpacity")
      setImageOpacity(Number(target.value) / 100);
    if (target.name === "drawingOpacity")
      setDrawingOpacity(Number(target.value) / 100);
  };

  const handleSwitchOpacity = () => {
    const tempImageOpacity = imageOpacity;
    setImageOpacity(drawingOpacity);
    if (imageSliderRef.current)
      imageSliderRef.current.value = Math.round(
        drawingOpacity * 100
      ).toString();
    setDrawingOpacity(tempImageOpacity);
    if (drawingSliderRef.current)
      drawingSliderRef.current.value = Math.round(
        tempImageOpacity * 100
      ).toString();
  };
  //. Return
  //. ------
  return (
    <>
      <div className="subSection">
        <div className="subSection__header">
          <h3>Opacity</h3>
        </div>
        <div className="subSection__content">
          <div className="inputGroup">
            <label htmlFor="imageOpacity">Image</label>
            <div className="inputRange_container">
              <input
                type="range"
                name="imageOpacity"
                min="0"
                max="100"
                defaultValue="100"
                onChange={handleOpacityChange}
                ref={imageSliderRef}
              />
            </div>
          </div>
          <div className="inputGroup switchButton">
            <button type="button" onClick={handleSwitchOpacity}>
              SWITCH
            </button>
          </div>
          <div className="inputGroup">
            <label htmlFor="drawingOpacity">Thread</label>
            <div className="inputRange_container">
              <input
                type="range"
                name="drawingOpacity"
                min="0"
                max="100"
                defaultValue="100"
                onChange={handleOpacityChange}
                ref={drawingSliderRef}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="subSection">
        <div className="subSection__content">
          <div className="canvasContainer">
            <ImageCanvas
              ref={imageRef}
              id="imageCanvas"
              w={DEFAULT_CANVAS_WIDTH}
              h={DEFAULT_CANVAS_HEIGHT}
              opacity={imageOpacity}
            />
            <Canvas
              ref={drawingRef}
              id="drawingCanvas"
              className="backgroundCanvas"
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
          </div>
        </div>
      </div>
    </>
  );
});

export default CanvasSection;
