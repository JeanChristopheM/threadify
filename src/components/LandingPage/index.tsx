import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="welcomeLayout">
      <div className="hero">
        <h1>Threadify</h1>
        <p>Create thread art from images</p>
        <Link to="new" children={<button type="button">New Project</button>} />
      </div>
      <div className="explaination">
        <h2>1</h2>
        <p>
          Pick the image of your liking that you want to turn into thread art.
        </p>
        <h2>2</h2>
        <p>Tweak the artboard you want to end up with as a final product.</p>
        <h2>3</h2>
        <p>Have fun with the parameters until you're happy with the results.</p>
        <h2>4</h2>
        <p>Make it for real with the progress tracker.</p>
      </div>
    </div>
  );
};

export default LandingPage;
