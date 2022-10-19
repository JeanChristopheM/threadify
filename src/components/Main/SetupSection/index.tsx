import React, { ChangeEvent, useState } from "react";
import { DEFAULT_POINTS } from "../../../utils/constants";
import { getImageDataFromFile } from "../../../utils/functions";
import { Mode } from "../../../utils/interfaces";
import CanvasSection from "../CanvasSection";
import { HTMLCanvasWithImage } from "../CanvasSection/ImageCanvas";

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

  const [canConfirm, setCanConfirm] = useState<boolean>(true);
  const [heightHidden, setHeightHidden] = useState<boolean>(true);

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
      <div className="subSection">
        <div className="subSection__header">
          <h3>Nails</h3>
        </div>
        <div className="subSection__content">
          <div className="formGroup separator">
            <label htmlFor="pointsSlider">
              Number of points :{" "}
              <span id="pointsAmountSpan">{DEFAULT_POINTS}</span>
            </label>
            <div className="inputRange_container">
              <input
                type="range"
                name="pointsSlider"
                min="50"
                max="400"
                defaultValue={DEFAULT_POINTS}
                onChange={handleChangePoints}
              />
            </div>
          </div>
          <div className="formGroup separator">
            <label htmlFor="modeSelector">Mode of ouput</label>
            <select
              name="modeSelector"
              className="inputSelect"
              onChange={(e: any) => {
                modeSetter(e.target.value);
                setHeightHidden(e.target.value === Mode.CIRCLE ? true : false);
              }}
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>
          <div className={`formGroup ${heightHidden ? "separator" : ""}`}>
            <label htmlFor="width">Width</label>
            <input
              type="range"
              name="width"
              min="50"
              max="100"
              defaultValue="100"
              onChange={(e: ChangeEvent) =>
                widthSetter(Number((e.target as HTMLInputElement).value))
              }
            />
          </div>
          <div className={`formGroup ${heightHidden ? "hidden" : "separator"}`}>
            <label htmlFor="height">Height</label>
            <input
              type="range"
              name="height"
              min="50"
              max="100"
              defaultValue="100"
              onChange={(e: ChangeEvent) =>
                heightSetter(Number((e.target as HTMLInputElement).value))
              }
            />
          </div>
        </div>
      </div>
      <CanvasSection ref={canvasesRef} />
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
