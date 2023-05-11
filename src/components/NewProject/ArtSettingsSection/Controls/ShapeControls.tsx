import React, { useState } from "react";
import { DEFAULT_POINTS } from "../../../../utils/constants";
import { Mode } from "../../../../utils/interfaces";
import { cancelledCharacters } from "../constants";

interface ISizeControlsProps {
  handleChangeMode: (newMode: Mode) => void;
  setHeightHidden: (hidden: boolean) => void;
}

const SizeControls: React.FC<ISizeControlsProps> = ({
  handleChangeMode,
  setHeightHidden,
}) => {
  return (
    <div className="subSection">
      <div className="subSection__header">
        <h3>Shape</h3>
      </div>
      <div className="subSection__content">
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
      </div>
    </div>
  );
};

export default SizeControls;
