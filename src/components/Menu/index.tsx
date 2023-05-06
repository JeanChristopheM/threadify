import React, { useMemo } from "react";

interface IMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Menu: React.FC<IMenuProps> = ({ isOpen, setIsOpen }) => {
  const computedClassName = useMemo(() => {
    let result = "menu";
    if (isOpen) return (result += " isOpen");
    return (result += " isClosed");
  }, [isOpen]);

  return (
    <div className={computedClassName}>
      <div className="slidingPortion">
        <h2>Menu</h2>
      </div>
      <div className="exitPortion" onClick={() => setIsOpen(false)} />
    </div>
  );
};

export default Menu;
