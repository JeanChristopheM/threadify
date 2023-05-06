import { Link } from "react-router-dom";
import SidebarButton from "../SidebarButton";

interface IHeaderProps {
  handleSidebarButtonClick: () => void;
}

const Header: React.FC<IHeaderProps> = ({ handleSidebarButtonClick }) => {
  return (
    <header>
      <SidebarButton handleClick={handleSidebarButtonClick} />
      <Link to="/" className="customLink">
        <h1>Threadify</h1>
      </Link>
    </header>
  );
};

export default Header;
