import { NavLink } from "react-router-dom";

export default function UserNavigation() {
  return (
    <>
      <div className="navigation-container">
        <NavLink to="/user/dashboard">
          <div className="navigation">
            <h3>
              New <br /> Order
            </h3>
          </div>
        </NavLink>

        <NavLink to="/user/dashboard/active-jobs">
          <div className="navigation">
            <h3>
              Ongoing <br /> Orders
            </h3>
          </div>
        </NavLink>

        <NavLink to="/user/dashboard/completed">
          <div className="navigation">
            <h3>
              Completed <br /> Orders
            </h3>
          </div>
        </NavLink>

        <NavLink to="/user/dashboard/profile">
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
