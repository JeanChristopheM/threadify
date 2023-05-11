import React from "react";
import { cancelledCharacters } from "../constants";

interface ISizeControlsProps {
  artWidthSetter: (height: number) => void;
  artHeightSetter: (width: number) => void;
  heightHidden: boolean;
  artWidth: number;
  artHeight: number;
}

const SizeControls: React.FC<ISizeControlsProps> = ({
  artWidthSetter,
  artHeightSetter,
  heightHidden,
  artWidth,
  artHeight,
}) => {
  const cancelSomeChars = (e: React.KeyboardEvent) => {
    if (cancelledCharacters.includes(e.key)) e.preventDefault();
  };
  return (
    <div className="subSection">
      <div className="subSection__header">
        <h3>Dimensions</h3>
      </div>
      <div className="subSection__content">
        <div className={`formGroup ${heightHidden ? "separator" : ""}`}>
          <label htmlFor="artWidth">Width (cm) : </label>
          <input
            type="number"
            id="artWidth"
            onKeyDown={cancelSomeChars}
            value={artWidth}
            onChange={(v) => artWidthSetter(Number(v.target.value))}
          />
        </div>
        <div className={`formGroup ${heightHidden ? "hidden" : "separator"}`}>
          <label htmlFor="artHeight">Height (cm) : </label>
          <input
            type="number"
            id="artHeight"
            onKeyDown={cancelSomeChars}
            value={artHeight}
            onChange={(v) => artHeightSetter(Number(v.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default SizeControls;
