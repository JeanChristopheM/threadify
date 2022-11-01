import React from "react";

interface ISpinnerProps {
  active: boolean;
}

const index = ({ active }: ISpinnerProps) => {
  return <div className={`spinner ${active ? "active" : ""}`}>LOADING</div>;
};

export default index;
