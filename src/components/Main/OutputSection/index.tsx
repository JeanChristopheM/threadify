import React, { useEffect, useState } from "react";
import Line from "../../../entities/Line";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_ITERATIONS,
} from "../../../utils/constants";
import { drawLines } from "../../../utils/functions";

type IOutputSectionProps = {
  setIterations: (iterations: number) => void;
  steps: number[];
  lines: Map<number, Line>;
  iterations: number;
};

const OutputSection = ({
  setIterations,
  steps,
  lines,
  iterations,
}: IOutputSectionProps) => {
  //. State
  //. -----
  const [downloadDisabled, setDownloadDisabled] = useState<boolean>(true);

  //. Effects
  //. -------
  useEffect(() => {
    if (steps.length && lines.size && iterations) setDownloadDisabled(false);
    else setDownloadDisabled(true);
  }, [steps, lines, iterations]);

  //. Handlers
  //. --------
  const handleChangeIterations = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.parentElement) {
      if (target.parentElement.parentElement) {
        if (target.parentElement.parentElement.lastChild)
          target.parentElement.parentElement.lastChild.textContent =
            target.value;
      }
    }
    setIterations(Number(target.value));
  };

  const handleSave = () => {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = DEFAULT_CANVAS_WIDTH;
    tempCanvas.height = DEFAULT_CANVAS_HEIGHT;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;
    tempCtx.fillStyle = "white";
    tempCtx.arc(
      DEFAULT_CANVAS_WIDTH / 2,
      DEFAULT_CANVAS_HEIGHT / 2,
      DEFAULT_CANVAS_WIDTH / 2,
      0,
      2 * Math.PI
    );
    tempCtx.fill();
    drawLines(steps, lines, tempCtx, 10, iterations, "#000", true);

    const link = document.createElement("a");
    link.download = "thread.png";
    link.href = tempCanvas.toDataURL();
    link.click();
    link.remove();
  };

  //. Return
  //. ------
  return (
    <section className="mainSection--output">
      <div className="sectionHeader">
        <h2>2. Output</h2>
      </div>
      <div className="formGroup">
        <label htmlFor="iterationsSlider">Number of steps</label>
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
        <span>{DEFAULT_ITERATIONS}</span>
      </div>
      <div className="formGroup">
        <button type="button" onClick={handleSave} disabled={downloadDisabled}>
          Save Drawing
        </button>
      </div>
    </section>
  );
};

export default OutputSection;
