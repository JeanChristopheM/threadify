import React from "react";

interface IImageControlsProps {
  imageSize: number;
  setImageSize: React.Dispatch<React.SetStateAction<number>>;
}

const ImageControls: React.FC<IImageControlsProps> = ({
  imageSize,
  setImageSize,
}) => {
  // . Handlers
  // . --------

  const handleChangeSize = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setImageSize(Number(target.value));
  };

  // . Return
  // . ------

  return (
    <div className="subSection">
      <div className="subSection__header">
        <h3>Image</h3>
      </div>
      <div className="subSection__content">
        <div className="formGroup">
          <label htmlFor="size">Size</label>
          <div className="inputRange_container">
            <input
              type="range"
              name="size"
              min="0"
              max="200"
              defaultValue={imageSize}
              onChange={handleChangeSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageControls;
