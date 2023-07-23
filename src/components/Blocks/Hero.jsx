import "./blocks.css";
import { NavLink } from "react-router-dom";

export default function Hero({ buttonText, link, img, altText }) {
  return (
    <div className="hero-block">
      <img src={img} alt={altText} />
      <NavLink to={link}>
        <button>{buttonText}</button>
      </NavLink>
    </div>
  );
}
