import "./blocks.css";
import { NavLink } from "react-router-dom";

export default function HeroLeft({ buttonText, link, className, headerText }) {
  return (
    <div className={`hero-block ${className}`}>
      <h1>{headerText}</h1>
      <NavLink to={link}>
        <button>{buttonText}</button>
      </NavLink>
    </div>
  );
}
