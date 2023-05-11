import React, { useState } from "react";
import { DEFAULT_POINTS } from "../../../../utils/constants";
import { Mode } from "../../../../utils/interfaces";

interface INailsControlsProps {
  handleChangePoints: (e: React.ChangeEvent) => void;
}

const NailsControls: React.FC<INailsControlsProps> = ({
  handleChangePoints,
}) => {
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
      </div>
    </div>
  );
};

export default NailsControls;
