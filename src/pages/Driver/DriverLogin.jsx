import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { sendRequest } from "../../helpers/send-helper";
import "../../styles/forms.css";

export default function DriverLogin({ onSignUpClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const response = await sendRequest("/api/drivers/login", "POST", {
        driverEmail: email,
        driverPassword: password,
      });

      localStorage.setItem("token", response.token);
      navigate("/driver/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error logging in:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <div className="forms-container">
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
          <button type="submit">{isLoading ? "Loading..." : "Login"}</button>

          <p>
            <NavLink to="#" onClick={onSignUpClick}>
              No Driver Account? Sign Up Instead.
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
}
