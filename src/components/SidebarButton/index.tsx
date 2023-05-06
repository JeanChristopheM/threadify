import React, { useState } from "react";

interface ISidebarButtonProps {
  handleClick: () => void;
}

const SidebarButton: React.FC<ISidebarButtonProps> = ({ handleClick }) => {
  return (
    <button className="sidebarButton" onClick={handleClick}>
      📚
    </button>
  );
};

export default SidebarButton;
