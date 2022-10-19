import React from "react";

const ImageControls = () => {
  // . Handlers
  // . --------

  const handleChangeSize = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    console.log(target.value);
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
              max="100"
              defaultValue="100"
              onChange={handleChangeSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageControls;
