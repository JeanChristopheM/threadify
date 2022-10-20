import React, { useState } from "react";
import { DEFAULT_POINTS } from "../../../../utils/constants";
import { Mode } from "../../../../utils/interfaces";

interface INailsControlsProps {
  handleChangePoints: (e: React.ChangeEvent) => void;
  handleChangeMode: (newMode: Mode) => void;
  widthSetter: (height: number) => void;
  heightSetter: (width: number) => void;
}

const NailsControls: React.FC<INailsControlsProps> = ({
  handleChangePoints,
  handleChangeMode,
  widthSetter,
  heightSetter,
}) => {
  const [heightHidden, setHeightHidden] = useState<boolean>(true);
  return (
    <div className="subSection">
      <div className="subSection__header">
        <h3>Nails</h3>
      </div>
      <div className="subSection__content">
        <div className="formGroup separator">
          <label htmlFor="pointsSlider">
            Amount : <span id="pointsAmountSpan">{DEFAULT_POINTS}</span>
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
          <label htmlFor="modeSelector">Mode : </label>
          <select
            name="modeSelector"
            className="inputSelect"
            onChange={(e: any) => {
              handleChangeMode(e.target.value);
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
            onChange={(e: React.ChangeEvent) =>
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
            onChange={(e: React.ChangeEvent) =>
              heightSetter(Number((e.target as HTMLInputElement).value))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default NailsControls;
