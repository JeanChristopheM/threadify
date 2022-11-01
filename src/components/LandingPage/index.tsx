import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="mainContainer">
      <div className="welcomeLayout">
        <p>
          <h3>Welcome to threadify</h3>
        </p>
        <p>
          Would you like to create a new project or start from where you left
          off ?
        </p>
        <div className="flex-row">
          <Link
            to="new"
            children={<button type="button">New Project</button>}
          ></Link>
          <button type="button">Keep Going</button>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
