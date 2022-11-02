import React from "react";

const ArtSettingsSection = () => {
  const cancelSomeChars = (e: React.KeyboardEvent) => {
    if (
      e.key === "e" ||
      e.key === "+" ||
      e.key === "-" ||
      e.key === "." ||
      e.key === ","
    )
      e.preventDefault();
  };
  return (
    <section className={`mainSection mainSection--artSettings`}>
      <div className="sectionHeader">
        <h2>Art Canvas Dimensions</h2>
      </div>
      <div className="inputWrapper">
        <label htmlFor="artWidth">Width (cm) : </label>
        <input type="number" id="artWidth" onKeyDown={cancelSomeChars} />
      </div>
      <div className="inputWrapper">
        <label htmlFor="artHeight">Height (cm) : </label>
        <input type="number" id="artHeight" onKeyDown={cancelSomeChars} />
      </div>
      <div className="inputWrapper">
        <label htmlFor="nailSpacing">Space between nails (cm) : </label>
        <input type="number" id="nailSpacing" onKeyDown={cancelSomeChars} />
      </div>
      <div className="formGroup separator">
        <label htmlFor="modeSelector">Mode : </label>
        <select id="modeSelector">
          <option value="circle">Circle</option>
          <option value="square">Square/Rectangle</option>
        </select>
      </div>
    </section>
  );
};

export default ArtSettingsSection;
