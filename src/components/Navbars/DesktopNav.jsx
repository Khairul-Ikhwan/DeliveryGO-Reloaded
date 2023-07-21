import { NavLink } from "react-router-dom";
import "./navbar.css";

export default function DesktopNav() {
  const isLoggedIn = localStorage.getItem("token") !== null;

  const handleLogout = () => {
    // Perform logout actions (e.g., clearing token from local storage)
    localStorage.removeItem("token");
    // Optionally, redirect the user to the login page or another route
    // window.location.replace("/login");
  };

  return (
    <div className="container desktop-nav">
      <p>Book A Delivery</p>
      <p>About</p>
      <p>Contact</p>
      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Log Out</button>
        ) : (
          <NavLink to="/driver/login">
            <p>Deliver With Us</p>
          </NavLink>
        )}
      </div>
    </div>
  );
}
