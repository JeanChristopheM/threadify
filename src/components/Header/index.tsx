import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <Link to="/" className="customLink">
        <h1>Threadify</h1>
      </Link>
      <p>Turn images into thread art</p>
    </header>
  );
};

export default Header;
