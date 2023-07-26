import { useState } from "react";
import { useNavigate } from "react-router";
import { sendRequest } from "../../helpers/send-helper";
import { NavLink } from "react-router-dom";
import "../../styles/forms.css";

export default function UserLogin({ onSignUpClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await sendRequest("/api/users/login", "POST", {
        userEmail: email,
        userPassword: password,
      });

      localStorage.setItem("token", response.token);
      navigate("/user/dashboard");
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
            Hello There, <br /> Let's Log You In!
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
              No User Account? Sign Up Instead.
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
}
