import { NavLink } from "react-router-dom";
import { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import "./navbar.css";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="container nav">
        <div onClick={handleMenuClick}>
          <img src="DeliveryGO.png" alt="DeliveryGO Logo" />
        </div>
      </div>

      <Menu
        right
        isOpen={isMenuOpen}
        customBurgerIcon={false}
        customCrossIcon={false}
        className="container nav"
      >
        <NavLink to="/user">
          <p>Customer Login</p>
        </NavLink>
        <NavLink to="/user">
          <p>Driver Login</p>
        </NavLink>
        <NavLink to="/">
          <p>Home</p>
        </NavLink>
      </Menu>
    </>
  );
}
