import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../helpers/send-helper";
import "../../styles/login.css";
import { NavLink } from "react-router-dom";

export default function UserLogin({ onSignUpClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  //   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await sendRequest("/api/users/login", "POST", {
        userEmail: email,
        userPassword: password,
      });

      console.log(response);

      localStorage.setItem("token", response.token);
      alert("Login Successful!");
      // Navigate to a new page if needed
      // navigate('/dashboard');
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <div className="login-container">
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
          <button type="submit">Login</button>
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
