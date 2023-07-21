import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../helpers/send-helper";

export default function DriverLogin() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.elements.password.value;

    try {
      const response = await sendRequest("/api/drivers/login", "POST", {
        driverEmail: email,
        driverPassword: password,
      });

      localStorage.setItem("token", response.token);
      navigate("/driver/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <h3>Hello there, let's get to work</h3>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input type="password" placeholder="Password" name="password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
