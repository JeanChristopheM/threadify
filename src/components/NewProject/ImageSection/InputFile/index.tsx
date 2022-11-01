import React from "react";

interface IInputFileProps {
  fileChangeHandler: (e: Event) => void;
}
const InputFile: React.FC<IInputFileProps> = ({ fileChangeHandler }) => {
  const handleButtonClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.click();
    input.onchange = fileChangeHandler;
  };
  return (
    <div className="subSection">
      <div className="subSection__content">
        <button type="button" onClick={handleButtonClick}>
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default InputFile;
