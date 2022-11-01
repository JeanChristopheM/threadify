import React, { useRef } from "react";
import { DEFAULT_ITERATIONS } from "../../../../utils/constants";

interface IIterationControls {
  setIterations: (iterations: number) => void;
  handleOpacityChange: (e: React.ChangeEvent) => void;
}

const IterationControls: React.FC<IIterationControls> = ({
  setIterations,
  handleOpacityChange,
}) => {
  const drawingSliderRef = useRef<HTMLInputElement | null>(null);
  // . Handlers
  // . --------

  const handleChangeIterations = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const span = document.querySelector("#iterationsAmount");
    if (span) span.textContent = target.value;
    setIterations(Number(target.value));
  };

  // . Return
  // . ------
  return (
    <div className="subSection">
      <div className="subSection__header">
        <h3>Thread</h3>
      </div>
      <div className="subSection__content">
        <div className="formGroup">
          <label htmlFor="iterationsSlider">
            Amount : <span id="iterationsAmount">{DEFAULT_ITERATIONS}</span>
          </label>
          <div className="inputRange_container">
            <input
              type="range"
              name="iterationsSlider"
              min="100"
              max="5000"
              defaultValue={DEFAULT_ITERATIONS}
              onChange={handleChangeIterations}
            />
          </div>
        </div>
        <div className="inputGroup">
          <label htmlFor="drawingOpacity">Opacity</label>
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

export default IterationControls;
