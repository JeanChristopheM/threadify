import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <Link to="/" className="customLink">
        <h1>Threadify</h1>
      </Link>
    </header>
  );
};

export default Header;
