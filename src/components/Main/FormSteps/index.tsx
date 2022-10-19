import React from "react";

interface IFormStepsProps {
  formStep: number;
  totalSteps: number;
  setFormStep: (step: number) => void;
}

const FormSteps: React.FC<IFormStepsProps> = ({
  formStep,
  totalSteps,
  setFormStep,
}) => {
  return (
    <div className="formSteps">
      {new Array(totalSteps).fill(1).map((s, i) => (
        <div
          key={`formStep${i}`}
          className="formSteps__circle"
          onClick={() => setFormStep(i + 1)}
        >
          <span
            className={`circle ${i + 1 === formStep ? "circle--active" : ""}`}
          >
            {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FormSteps;
