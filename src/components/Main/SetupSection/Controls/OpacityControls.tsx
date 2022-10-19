import React, { useRef } from "react";

interface IOpacityControlsProps {
  // handleOpacityChange: (e: React.ChangeEvent) => void;
  // handleSwitchOpacity: () => void;
  // imageSliderRef: React.MutableRefObject<HTMLInputElement | null>;
  // drawingSliderRef: React.MutableRefObject<HTMLInputElement | null>;
  imageOpacity: number;
  drawingOpacity: number;
  setImageOpacity: (x: number) => void;
  setDrawingOpacity: (x: number) => void;
}

const OpacityControls: React.FC<IOpacityControlsProps> = ({
  imageOpacity,
  drawingOpacity,
  setImageOpacity,
  setDrawingOpacity,
}) => {
  const imageSliderRef = useRef<HTMLInputElement | null>(null);
  const drawingSliderRef = useRef<HTMLInputElement | null>(null);

  //. Handlers
  //. --------

  const handleOpacityChange = (e: React.ChangeEvent) => {
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
  return (
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
  );
};

export default OpacityControls;
