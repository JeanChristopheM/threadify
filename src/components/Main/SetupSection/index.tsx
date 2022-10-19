import React, { ChangeEvent, useState } from "react";
import { DEFAULT_POINTS } from "../../../utils/constants";
import { getImageDataFromFile } from "../../../utils/functions";
import { Mode } from "../../../utils/interfaces";
import CanvasSection from "../CanvasSection";
import { HTMLCanvasWithImage } from "../CanvasSection/ImageCanvas";
import NailsControls from "./Controls/NailsControls";
import OpacityControls from "./Controls/OpacityControls";

type ISetupSectionProps = {
  generateHandler: () => void;
  setPointsAmount: (pointsAmount: number) => void;
  modeSetter: (newMode: Mode) => void;
  widthSetter: (height: number) => void;
  heightSetter: (width: number) => void;
  className?: string;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
  canvasesRef: React.MutableRefObject<{
    drawingRef: React.RefObject<HTMLCanvasElement>;
    pointsRef: React.RefObject<HTMLCanvasElement>;
    imageRef: React.RefObject<HTMLCanvasWithImage>;
  }>;
};
const SetupSection = ({
  generateHandler,
  setPointsAmount,
  modeSetter,
  widthSetter,
  heightSetter,
  className,
  setFormStep,
  canvasesRef,
}: ISetupSectionProps) => {
  // . State
  // . -----
  const [imageOpacity, setImageOpacity] = useState<number>(1);
  const [drawingOpacity, setDrawingOpacity] = useState<number>(1);
  const [canConfirm, setCanConfirm] = useState<boolean>(true);

  //. Handlers
  //. --------

  const handleChangePoints = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const span = document.querySelector("#pointsAmountSpan");
    if (span) span.textContent = target.value;
    setPointsAmount(Number(target.value));
  };

  const handleConfirm = () => {
    generateHandler();
  };

  //. Return
  //. ------

  return (
    <section className={`mainSection mainSection--setup ${className}`}>
      <div className="sectionHeader">
        <h2>Change parameters</h2>
      </div>

      <div className="controls">
        <NailsControls
          handleChangePoints={handleChangePoints}
          handleChangeMode={modeSetter}
          widthSetter={widthSetter}
          heightSetter={heightSetter}
        />
        <OpacityControls
          imageOpacity={imageOpacity}
          drawingOpacity={drawingOpacity}
          setImageOpacity={setImageOpacity}
          setDrawingOpacity={setDrawingOpacity}
        />
      </div>

      <CanvasSection
        ref={canvasesRef}
        imageOpacity={imageOpacity}
        drawingOpacity={drawingOpacity}
      />

      <div className="subSection">
        <div className="subSection__content">
          <button type="button" onClick={handleConfirm} disabled={!canConfirm}>
            Generate
          </button>
          <button
            type="button"
            onClick={() => setFormStep((old: number) => old + 1)}
            disabled={!canConfirm}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default SetupSection;
