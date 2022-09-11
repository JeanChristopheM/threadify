import React, { ChangeEvent } from "react";
import { DEFAULT_POINTS } from "../../../utils/constants";
import { getImageDataFromFile } from "../../../utils/functions";

type ISetupSectionProps = {
  imageRef: React.RefObject<HTMLCanvasElement>;
  generateHandler: (e: React.FormEvent) => void;
  setPointsAmount: (pointsAmount: number) => void;
};
const SetupSection = ({
  imageRef,
  generateHandler,
  setPointsAmount,
}: ISetupSectionProps) => {
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
    const fileData = await getImageDataFromFile(file, imageCanvas.width);
    ctx.putImageData(fileData as ImageData, 0, 0);
  };
  const handleChangePoints = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.nextSibling) target.nextSibling.textContent = target.value;
    setPointsAmount(Number(target.value));
  };
  //. Return
  //. ------
  return (
    <section className="mainSection--setup">
      <div className="sectionHeader">
        <h2>1. Setup</h2>
      </div>
      <div className="formGroup">
        <label htmlFor="imageInput">Upload your image</label>
        <input type="file" name="imageInput" onChange={handleFileChange} />
      </div>
      <form onSubmit={generateHandler}>
        <div className="formGroup">
          <label htmlFor="pointsSlider">Number of points</label>
          <input
            type="range"
            name="pointsSlider"
            min="50"
            max="400"
            defaultValue={DEFAULT_POINTS}
            onChange={handleChangePoints}
          />
          <span>{DEFAULT_POINTS}</span>
        </div>
        <div className="formGroup">
          <label htmlFor="modeSelector">Mode of ouput</label>
          <select name="modeSelector">
            <option value="circle">Circle</option>
            <option value="square">Square</option>
          </select>
        </div>
        <div className="formGroup">
          <button type="submit">Generate steps</button>
        </div>
      </form>
    </section>
  );
};

export default SetupSection;
