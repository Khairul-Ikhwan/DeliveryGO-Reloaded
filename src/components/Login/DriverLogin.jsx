import { useState } from "react";
import { sendRequest } from "../../send-helper";

export default function DriverLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await sendRequest("/api/drivers/login", "POST", {
        driverEmail: email,
        driverPassword: password,
      });
      const { token, driver } = data;

      // Handle successful login
      localStorage.setItem("token", token);
      // Redirect or navigate to the driver's dashboard or another protected page
    } catch (error) {
      // Handle login error
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Hello there, let's get to work</h3>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
}
