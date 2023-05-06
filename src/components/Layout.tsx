import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import Menu from "./Menu";

const Layout = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleSidebarButtonClick = () => {
    console.log("clicked sidebar button");
    setIsOpen((old) => !old);
  };
  return (
    <>
      <Header handleSidebarButtonClick={handleSidebarButtonClick} />
      <Menu isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="mainContainer">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
