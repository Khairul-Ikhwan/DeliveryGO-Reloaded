import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { sendRequest } from "../../helpers/send-helper";
import "../../styles/login.css";

export default function DriverLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before the new login attempt

    try {
      const response = await sendRequest("/api/drivers/login", "POST", {
        driverEmail: email,
        driverPassword: password,
      });

      localStorage.setItem("token", response.token);
      navigate("/driver/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid email or password. Please try again."); // Set error state based on the response
    }
  };

  return (
    <>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <header>
            Hello There, <br /> Let's Get To Work
          </header>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <msg className="error-message">{error}</msg>}
          <button type="submit">Login</button>

          <p>
            <NavLink to="/driver/signup">
              No Driver Account? Sign Up Instead.
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
}
