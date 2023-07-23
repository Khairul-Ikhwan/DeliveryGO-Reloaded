import { NavLink } from "react-router-dom";

export default function DriverNavigation() {
  return (
    <>
      <div className="navigation-container">
        <NavLink to="/driver/dashboard">
          <div className="navigation">
            <h3>
              All <br /> Jobs
            </h3>
          </div>
        </NavLink>

        <NavLink to="/driver/dashboard">
          <div className="navigation">
            <h3>
              Accepted <br /> Jobs
            </h3>
          </div>
        </NavLink>

        <NavLink to="/driver/dashboard">
          <div className="navigation">
            <h3>
              Completed <br /> Jobs
            </h3>
          </div>
        </NavLink>

        <NavLink to="/driver">
          <div className="navigation">
            <h3>
              My <br /> Profile
            </h3>
          </div>
        </NavLink>
      </div>
    </>
  );
}
