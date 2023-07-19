import { NavLink } from "react-router-dom";
import "./navbar.css";

export default function DesktopNav() {
  return (
    <div className="container desktop-nav">
      <p>Book A Delivery</p>
      <p>About</p>
      <p>Contact</p>
      <NavLink to="/driver/login">
        <p>Deliver With Us</p>
      </NavLink>
    </div>
  );
}
