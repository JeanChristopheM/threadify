import React, { useEffect, useState } from "react";
import Line from "../../../entities/Line";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_ITERATIONS,
} from "../../../utils/constants";
import { drawLines } from "../../../utils/functions";

type IOutputSectionProps = {
  steps: number[];
  stepsDisplay: string[];
  setStepsDisplay: (stepsDisplay: string[]) => void;
  lines: Map<number, Line>;
  iterations: number;
  className?: string;
};

const OutputSection = ({
  steps,
  stepsDisplay,
  setStepsDisplay,
  lines,
  iterations,
  className,
}: IOutputSectionProps) => {
  //. State
  //. -----
  const [craftStep, setCraftStep] = useState<number>(0);
  const [downloadDisabled, setDownloadDisabled] = useState<boolean>(true);

  //. Effects
  //. -------
  useEffect(() => {
    if (steps.length && lines.size && iterations) setDownloadDisabled(false);
    else setDownloadDisabled(true);
  }, [steps, lines, iterations]);

  //. Handlers
  //. --------

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

  const handleSaveSteps = (e?: React.MouseEvent) => {
    const link = document.createElement("a");
    if (steps.length) {
      const slicedSteps = stepsDisplay.slice(0, iterations);
      slicedSteps.push(`||${craftStep}`);
      link.setAttribute("href", `data:text/plain;charset=utf-8,${slicedSteps}`);
    } else {
      const updatedSteps = stepsDisplay.slice(0, stepsDisplay.length - 2);
      updatedSteps.push(`||${craftStep}`);
      link.setAttribute(
        "href",
        `data:text/plain;charset=utf-8,${updatedSteps}`
      );
    }
    link.setAttribute("download", "steps.txt");
    link.click();
    link.remove();
  };

  const stepFileHandler = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target) throw new Error("no target on input file change event");
    const inputFiles = target.files;
    if (!inputFiles) throw new Error("no files in inputfile");
    const file = inputFiles[0];
    if (!file) throw new Error("no file index 0 in inputfile");
    if (file.type !== "text/plain") throw new Error("file is not text");
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const frResult = (fr.result as string).split(",");
        setStepsDisplay(frResult);
        setCraftStep(Number(frResult[frResult.length - 1].split("||")[1]));
      } catch (e) {
        console.error(e);
      }
    };
    fr.readAsText(file);
  };

  const handleUploadSteps = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    input.click();
    input.onchange = stepFileHandler;
  };

  const handleChangeCraftStep = (e: React.MouseEvent) => {
    const target = e.target as HTMLButtonElement;
    if (target.id == "prev") setCraftStep((old) => (old <= 0 ? 0 : old - 1));
    else
      setCraftStep((old) =>
        old >= stepsDisplay.length - 1 ? stepsDisplay.length - 1 : old + 1
      );
  };

  // . Effects
  // . -------

  useEffect(() => {
    stepsDisplay.length &&
      setCraftStep(
        Number(stepsDisplay[stepsDisplay.length - 1].split("||")[1])
      );
  }, [steps, stepsDisplay]);

  //. Return
  //. ------
  return (
    <section className={`mainSection mainSection--output ${className}`}>
      <div className="sectionHeader">
        <h2>Make it for real !</h2>
      </div>
      <div className="subSection flex-row">
        <button type="button" onClick={handleSave} disabled={downloadDisabled}>
          Save Drawing
        </button>

        <button
          type="button"
          onClick={handleSaveSteps}
          disabled={!stepsDisplay.length}
        >
          Save Steps
        </button>

        <button type="button" onClick={handleUploadSteps}>
          Upload Steps
        </button>
      </div>
      {stepsDisplay.length ? (
        <>
          <div className="subSection stepsDisplay">
            <span>{stepsDisplay[craftStep].split(" -> ")[0]}</span>
            <span>→</span>
            <span>{stepsDisplay[craftStep].split(" -> ")[1]}</span>
          </div>
          <div className="subSection flex-row">
            <button type="button" onClick={handleChangeCraftStep} id="prev">
              {"<"}
            </button>
            <div className="craftStepDisplay">{craftStep}</div>
            <button type="button" onClick={handleChangeCraftStep} id="next">
              {">"}
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
};

export default OutputSection;
