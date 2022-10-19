import React, { ChangeEvent, useState } from "react";
import { DEFAULT_POINTS } from "../../../utils/constants";
import { getImageDataFromFile } from "../../../utils/functions";
import { Mode } from "../../../utils/interfaces";

type ISetupSectionProps = {
  imageRef: React.RefObject<HTMLCanvasElement>;
  generateHandler: (e: React.FormEvent) => void;
  setPointsAmount: (pointsAmount: number) => void;
  modeSetter: (newMode: Mode) => void;
  widthSetter: (height: number) => void;
  heightSetter: (width: number) => void;
  className?: string;
};
const SetupSection = ({
  imageRef,
  generateHandler,
  setPointsAmount,
  modeSetter,
  widthSetter,
  heightSetter,
  className,
}: ISetupSectionProps) => {
  // . State
  // . -----

  const [heightHidden, setHeightHidden] = useState<boolean>(true);
  //. Handlers
  //. --------
  const handleFileChange = async (e: React.ChangeEvent) => {
    if (!imageRef.current) return;
    const imageCanvas = imageRef.current;
    const ctx = imageCanvas.getContext("2d");
    if (!ctx) throw new Error("no ctx when uploading image via inputfile");
    const target = e.target as HTMLInputElement;
    if (!target) throw new Error("no target on input file change event");
    const inputFiles = target.files;
    if (!inputFiles) throw new Error("no files in inputfile");
    const file = inputFiles[0];
    if (!file) throw new Error("no file index 0 in inputfile");
    const { imageData: fileData, image } = await getImageDataFromFile(
      file,
      imageCanvas.width,
      0,
      0
    );
    // @ts-ignore
    imageRef.current.file = image;
    ctx.putImageData(fileData as ImageData, 0, 0);
  };
  const handleChangePoints = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const span = document.querySelector("#pointsAmountSpan");
    if (span) span.textContent = target.value;
    setPointsAmount(Number(target.value));
  };
  //. Return
  //. ------
  return (
    <section className={`mainSection mainSection--setup ${className}`}>
      <div className="sectionHeader">
        <h2>1. Setup</h2>
      </div>
      <div className="subSection">
        <div className="subSection__header">
          <h3> # Image</h3>
        </div>
        <div className="subSection__content">
          <div className="formGroup">
            <label htmlFor="imageInput">
              Upload your image
              <input
                type="file"
                name="imageInput"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="subSection">
        <div className="subSection__header">
          <h3> # Canvas</h3>
        </div>
        <div className="subSection__content">
          <form onSubmit={generateHandler}>
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
                  setHeightHidden(
                    e.target.value === Mode.CIRCLE ? true : false
                  );
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
            <div
              className={`formGroup ${heightHidden ? "hidden" : "separator"}`}
            >
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
            <div className="formGroup submitButton">
              <button type="submit">Generate steps</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SetupSection;
