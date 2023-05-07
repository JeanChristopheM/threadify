import React from "react";
import { useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  return (
    <div>
      <h1>ErrorPage</h1>
      <p>{JSON.stringify(location)}</p>
    </div>
  );
};

export default ErrorPage;
