import "./blocks.css";
import { NavLink } from "react-router-dom";

export default function HeroLeft({
  buttonText,
  link,
  className,
  headerText,
  smallText,
}) {
  return (
    <div className={`hero-block ${className}`}>
      <div>
        <h1>{headerText}</h1>
        <p>{smallText}</p>
      </div>
      <NavLink to={link}>
        <button>{buttonText}</button>
      </NavLink>
    </div>
  );
}
