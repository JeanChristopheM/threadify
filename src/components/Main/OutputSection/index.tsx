import React from "react";
import { DEFAULT_ITERATIONS } from "../../../utils/constants";

type IOutputSectionProps = {
  setIterations: (iterations: number) => void;
};

const OutputSection = ({ setIterations }: IOutputSectionProps) => {
  const handleChangeIterations = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.nextSibling) target.nextSibling.textContent = target.value;
    setIterations(Number(target.value));
  };
  return (
    <section className="mainSection--output">
      <div className="sectionHeader">
        <h2>2. Output</h2>
      </div>
      <div className="formGroup">
        <label htmlFor="iterationsSlider">Number of steps</label>
        <input
          type="range"
          name="iterationsSlider"
          min="100"
          max="5000"
          defaultValue={DEFAULT_ITERATIONS}
          onChange={handleChangeIterations}
        />
        <span>{DEFAULT_ITERATIONS}</span>
      </div>
    </section>
  );
};

export default OutputSection;
